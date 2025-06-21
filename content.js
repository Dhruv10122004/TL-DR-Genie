// Extract article content
function getArticleContent() {
    const article = document.querySelector('article');
    if (article) {
        return article.innerText;
    }

    const paragraphs = Array.from(document.querySelectorAll('p'));
    return paragraphs.map(p => p.innerText).join('\n');
}

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    if (req.type === "GET_ARTICLE_CONTENT") {
        const text = getArticleContent();
        sendResponse({ text });
    }

    return true; // Required if sendResponse is async or called after delay
});
