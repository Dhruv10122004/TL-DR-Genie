document.addEventListener("DOMContentLoaded", () => {
  const summarizeBtn = document.getElementById("summarize");
  const result = document.getElementById("result");

  summarizeBtn.addEventListener("click", () => {
    const summaryType = document.getElementById("summary-type").value;
    result.innerHTML = '<div class="loader"></div>';

    chrome.storage.sync.get(["geminiApiKey"], ({ geminiApiKey }) => {
      if (!geminiApiKey) {
        result.textContent = "Please set your Gemini API key in the options.";
        return;
      }

      chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        if (!tab || !tab.id) {
          result.textContent = "No active tab found.";
          return;
        }

        // Inject content.js in case it's not loaded
        chrome.scripting.executeScript(
          {
            target: { tabId: tab.id },
            files: ["content.js"]
          },
          () => {
            chrome.tabs.sendMessage(
              tab.id,
              { type: "GET_ARTICLE_CONTENT" },
              async (response) => {
                if (chrome.runtime.lastError || !response?.text) {
                  result.textContent = "Could not get article content. Make sure you're on a readable webpage.";
                  return;
                }

                try {
                  const summary = await getGeminiSummary(response.text, summaryType, geminiApiKey);
                  result.textContent = summary;
                } catch (error) {
                  result.textContent = `Error: ${error.message}`;
                }
              }
            );
          }
        );
      });
    });
  });
});

async function getGeminiSummary(text, summaryType, apiKey) {
  const max = 2000;
  const trimmedText = text.length > max ? text.slice(0, max) + "..." : text;

  const promptMap = {
    brief: `Summarize the following text in a concise manner, take out meanigful and useful data, it should be brief but should atleast have all important details:\n\n${text}`,
    detailed: `Provide a detailed summary of the following text,  take out meanigful and useful data:\n\n${text}`,
    bullets: `Summarize the following text as bullet points,  take out meanigful and useful data, it should be brief but should atleast have all important details:\n\n${text}`

  };

  const prompt = promptMap[summaryType] || promptMap.brief;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2 }
      })
    }
  );

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(`API Error: ${error.message}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "No summary available.";
}
