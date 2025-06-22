// Enhanced content script with better text extraction
(function() {
  'use strict';

  // Avoid multiple injections
  if (window.tldrGenieInjected) return;
  window.tldrGenieInjected = true;

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "GET_ARTICLE_CONTENT") {
      try {
        const content = extractArticleContent();
        sendResponse({ text: content });
      } catch (error) {
        sendResponse({ text: "", error: error.message });
      }
    }
    return true; // Keep the message channel open for async response
  });

  function extractArticleContent() {
    // Remove unwanted elements first
    const unwantedSelectors = [
      'script', 'style', 'nav', 'header', 'footer', 'aside',
      '.sidebar', '.navigation', '.nav', '.menu', '.ads', '.advertisement',
      '.social-media', '.comments', '.comment', '.related-posts',
      '[class*="cookie"]', '[class*="popup"]', '[class*="modal"]',
      '.skip-link', '.screen-reader-text', '.sr-only'
    ];

    // Try multiple extraction strategies
    const strategies = [
      extractFromJsonLd,
      extractFromArticleTag,
      extractFromMainContent,
      extractFromReadabilityHeuristics,
      extractFromCommonSelectors,
      extractFromBodyText
    ];

    for (const strategy of strategies) {
      try {
        const content = strategy();
        if (content && content.length > 200) {
          return cleanText(content);
        }
      } catch (error) {
        console.warn('TL;DR Genie extraction strategy failed:', error);
      }
    }

    throw new Error("Could not extract meaningful content from this page");
  }

  function extractFromJsonLd() {
    // Look for JSON-LD structured data
    const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
    
    for (const script of jsonLdScripts) {
      try {
        const data = JSON.parse(script.textContent);
        const articles = Array.isArray(data) ? data : [data];
        
        for (const item of articles) {
          if (item['@type'] === 'Article' || item['@type'] === 'NewsArticle') {
            const content = item.articleBody || item.description || item.text;
            if (content && content.length > 200) {
              return content;
            }
          }
        }
      } catch (e) {
        continue;
      }
    }
    return null;
  }

  function extractFromArticleTag() {
    const article = document.querySelector('article');
    if (article) {
      return getTextContent(article);
    }
    return null;
  }

  function extractFromMainContent() {
    const mainSelectors = [
      'main', '[role="main"]', '.main-content', '.content',
      '.post-content', '.entry-content', '.article-content'
    ];

    for (const selector of mainSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        const content = getTextContent(element);
        if (content.length > 200) {
          return content;
        }
      }
    }
    return null;
  }

  function extractFromReadabilityHeuristics() {
    // Find the element with the most text content
    const candidates = [];
    const elements = document.querySelectorAll('div, section, article, main');

    for (const element of elements) {
      const text = getTextContent(element);
      const wordCount = text.split(/\s+/).length;
      
      if (wordCount > 50) {
        const score = calculateReadabilityScore(element, text, wordCount);
        candidates.push({ element, text, score });
      }
    }

    candidates.sort((a, b) => b.score - a.score);
    return candidates[0]?.text || null;
  }

  function calculateReadabilityScore(element, text, wordCount) {
    let score = wordCount;

    // Boost score for semantic elements
    const tagName = element.tagName.toLowerCase();
    if (['article', 'main', 'section'].includes(tagName)) {
      score *= 1.5;
    }

    // Boost score for content-related classes/IDs
    const className = (element.className || '').toLowerCase();
    const id = (element.id || '').toLowerCase();
    const identifiers = className + ' ' + id;

    if (/content|article|post|entry|main|body/.test(identifiers)) {
      score *= 1.3;
    }

    // Penalize for navigation/sidebar classes
    if (/nav|sidebar|menu|header|footer|ad|comment|social/.test(identifiers)) {
      score *= 0.5;
    }

    // Penalize elements with too many links relative to text
    const links = element.querySelectorAll('a').length;
    const linkDensity = links / Math.max(wordCount / 10, 1);
    if (linkDensity > 0.5) {
      score *= 0.7;
    }

    // Boost for paragraph density
    const paragraphs = element.querySelectorAll('p').length;
    if (paragraphs > 3) {
      score *= 1.2;
    }

    return score;
  }

  function extractFromCommonSelectors() {
    const contentSelectors = [
      '.post', '.entry', '.content', '.article',
      '.story', '.news-article', '.blog-post',
      '[itemprop="articleBody"]', '[class*="content"]'
    ];

    for (const selector of contentSelectors) {
      const elements = document.querySelectorAll(selector);
      for (const element of elements) {
        const content = getTextContent(element);
        if (content.length > 200) {
          return content;
        }
      }
    }
    return null;
  }

  function extractFromBodyText() {
    // Last resort: get all body text but filter out navigation
    const body = document.body.cloneNode(true);
    
    // Remove unwanted elements
    const unwantedSelectors = [
      'script', 'style', 'nav', 'header', 'footer', 'aside',
      '.navigation', '.nav', '.menu', '.sidebar', '.ads',
      '.social', '.comments', '.cookie', '.popup', '.modal'
    ];

    for (const selector of unwantedSelectors) {
      const elements = body.querySelectorAll(selector);
      elements.forEach(el => el.remove());
    }

    return getTextContent(body);
  }

  function getTextContent(element) {
    if (!element) return '';

    // Clone to avoid modifying the original
    const clone = element.cloneNode(true);

    // Remove unwanted elements
    const unwantedSelectors = [
      'script', 'style', 'nav', 'header', 'footer',
      '.navigation', '.sidebar', '.ads', '.cookie-notice',
      '.social-share', '.comments', '.related-posts'
    ];

    for (const selector of unwantedSelectors) {
      const elements = clone.querySelectorAll(selector);
      elements.forEach(el => el.remove());
    }

    // Get text content
    let text = clone.textContent || clone.innerText || '';
    
    // Clean up the text
    return cleanText(text);
  }

  function cleanText(text) {
    if (!text) return '';

    return text
      // Normalize whitespace
      .replace(/\s+/g, ' ')
      // Remove excessive line breaks
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      // Remove leading/trailing whitespace
      .trim()
  }
})();