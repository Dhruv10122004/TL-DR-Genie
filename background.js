// for searching gemini api key when extension is installed on chrome

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(['geminiApiKey'], (result) => {
        if(!result.geminiApiKey) {
            chrome.tabs.create({url:"option.html"})
        }
    })
});