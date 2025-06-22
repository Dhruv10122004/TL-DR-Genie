document.addEventListener("DOMContentLoaded", () => {
  const summarizeBtn = document.getElementById("summarize");
  const copyBtn = document.getElementById("copy-btn");
  const result = document.getElementById("result");
  const wordCount = document.getElementById("word-count");
  const settingsLink = document.getElementById("settings-link");
  
  let currentSummary = "";
  let isLoading = false;

  // Settings link handler
  settingsLink.addEventListener("click", (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });

  // Copy button handler
  copyBtn.addEventListener("click", async () => {
    if (!currentSummary) return;
    
    try {
      await navigator.clipboard.writeText(currentSummary);
      showSuccessMessage("Summary copied to clipboard!");
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = currentSummary;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      showSuccessMessage("Summary copied to clipboard!");
    }
  });

  // Main summarize button handler
  summarizeBtn.addEventListener("click", async () => {
    if (isLoading) return;
    
    const summaryType = document.getElementById("summary-type").value;
    const lengthLevel = parseInt(document.getElementById("length-slider").value);
    
    setLoadingState(true);
    
    try {
      const { geminiApiKey } = await chrome.storage.sync.get(["geminiApiKey"]);
      
      if (!geminiApiKey) {
        throw new Error("Please set your Gemini API key in settings first.");
      }

      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab?.id) {
        throw new Error("No active tab found.");
      }

      // Check if the page is accessible
      if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('moz-extension://')) {
        throw new Error("Cannot access browser internal pages or extensions.");
      }

      // Inject content script
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
      });

      // Get page content
      const response = await sendMessageToTab(tab.id, { type: "GET_ARTICLE_CONTENT" });
      
      if (!response?.text) {
        throw new Error("Could not extract readable content from this page. Try a different webpage with more text content.");
      }

      if (response.text.length < 100) {
        throw new Error("Page content is too short to summarize meaningfully.");
      }

      // Generate summary
      const summary = await getGeminiSummary(response.text, summaryType, lengthLevel, geminiApiKey);
      
      if (!summary || summary.trim().length === 0) {
        throw new Error("Failed to generate summary. Please try again.");
      }

      displaySummary(summary);
      
    } catch (error) {
      displayError(error.message);
    } finally {
      setLoadingState(false);
    }
  });

  function setLoadingState(loading) {
    isLoading = loading;
    summarizeBtn.disabled = loading;
    copyBtn.disabled = loading || !currentSummary;
    
    if (loading) {
      result.innerHTML = `
        <div class="loading">
          <div class="loader"></div>
          <div class="loading-text">Analyzing page content...</div>
        </div>
      `;
      wordCount.textContent = "";
    }
  }

  function displaySummary(summary) {
    currentSummary = summary;
    result.textContent = summary;
    copyBtn.disabled = false;
    
    // Update word count
    const words = summary.trim().split(/\s+/).length;
    wordCount.textContent = `${words} words`;
  }

  function displayError(message) {
    currentSummary = "";
    result.innerHTML = `<div class="error">❌ ${message}</div>`;
    copyBtn.disabled = true;
    wordCount.textContent = "";
  }

  function showSuccessMessage(message) {
    const successDiv = document.createElement("div");
    successDiv.className = "success";
    successDiv.textContent = `✅ ${message}`;
    
    const resultContainer = document.querySelector(".result-container");
    resultContainer.appendChild(successDiv);
    
    setTimeout(() => {
      successDiv.remove();
    }, 3000);
  }

  function sendMessageToTab(tabId, message) {
    return new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(tabId, message, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(response);
        }
      });
    });
  }
});

async function getGeminiSummary(text, summaryType, lengthLevel, apiKey) {
  // Intelligent text truncation based on content type
  const maxLength = getMaxLengthForContent(text);
  const trimmedText = text.length > maxLength ? 
    smartTruncate(text, maxLength) : text;

  const prompt = buildPrompt(trimmedText, summaryType, lengthLevel);

  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { 
      temperature: getTemperatureForType(summaryType),
      maxOutputTokens: getMaxTokensForLength(lengthLevel),
      topP: 0.8,
      topK: 40
    }
  };

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "User-Agent": "TL;DR-Genie/1.0"
      },
      body: JSON.stringify(requestBody)
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(`API Error: ${errorMessage}`);
  }

  const data = await response.json();
  const summary = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!summary) {
    throw new Error("No summary generated. The content might be inappropriate or too complex.");
  }

  return summary.trim();
}

function getMaxLengthForContent(text) {
  // Dynamic max length based on content size
  if (text.length < 5000) return 3000;
  if (text.length < 15000) return 6000;
  return 10000;
}

function smartTruncate(text, maxLength) {
  if (text.length <= maxLength) return text;
  
  // Try to truncate at sentence boundary
  const truncated = text.substring(0, maxLength);
  const lastSentence = truncated.lastIndexOf('. ');
  const lastParagraph = truncated.lastIndexOf('\n\n');
  
  const cutPoint = Math.max(lastSentence, lastParagraph);
  
  if (cutPoint > maxLength * 0.7) {
    return text.substring(0, cutPoint + 1).trim();
  }
  
  return truncated.trim() + "...";
}

function buildPrompt(text, summaryType, lengthLevel) {
  const lengthInstructions = {
    1: "Keep it concise and focused on the most essential points.",
    2: "Provide a balanced summary with key details and context.",
    3: "Include comprehensive details while maintaining clarity and structure."
  };

  const basePrompts = {
    brief: `Create a concise summary that captures the main points and key takeaways. Focus on what's most important for quick understanding.`,
    
    detailed: `Provide a comprehensive analysis that covers the main topics, supporting details, and important context. Structure your response logically.`,
    
    bullets: `Summarize using clear bullet points. Each point should be substantial and capture important information. Use sub-bullets for related details when needed.`,
    
    academic: `Write a scholarly summary that identifies the main thesis, key arguments, methodology (if applicable), and conclusions. Maintain an objective, analytical tone.`,
    
    creative: `Transform this content into an engaging, digestible summary. Use creative language while preserving accuracy. Make it interesting and memorable.`
  };

  return `${basePrompts[summaryType] || basePrompts.brief}

${lengthInstructions[lengthLevel]}

Important guidelines:
- Extract meaningful and useful information
- Maintain accuracy and objectivity
- Structure the response clearly
- Focus on actionable insights when relevant
- Preserve important names, dates, and numbers

Content to summarize:

${text}`;
}

function getTemperatureForType(summaryType) {
  const temperatures = {
    brief: 0.2,
    detailed: 0.3,
    bullets: 0.2,
    academic: 0.1,
    creative: 0.7
  };
  return temperatures[summaryType] || 0.3;
}

function getMaxTokensForLength(lengthLevel) {
  const tokenLimits = {
    1: 200,
    2: 400,
    3: 600
  };
  return tokenLimits[lengthLevel] || 400;
}