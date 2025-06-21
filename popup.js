document.addEventListener("DOMContentLoaded", () => {
  const summarizeBtn = document.getElementById("summarize");
  const result = document.getElementById("result");

  summarizeBtn.addEventListener("click", () => {
    result.textContent = "Summarizing...";

    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      chrome.tabs.sendMessage(
        tab.id,
        { type: "GET_ARTICLE_CONTENT" },
        ({ text }) => {
          result.textContent = text
            ? text.slice(0, 300) + "..."
            : "No article content found.";
        }
      );
    });
  });
});
