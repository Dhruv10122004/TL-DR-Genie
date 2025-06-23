// Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Load saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);

    // Theme toggle event listener
    themeToggle.addEventListener('click', () => {
      const currentTheme = body.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });

    // Placeholder for the rest of your popup.js functionality
    // You would include your existing popup.js code here

    // Example functionality for the buttons (replace with your actual logic)
    document.getElementById('summarize').addEventListener('click', function() {
      const resultDiv = document.getElementById('result');
      const wordCount = document.getElementById('word-count');
      const copyBtn = document.getElementById('copy-btn');
      
      // Show loading state
      resultDiv.innerHTML = `
        <div class="loading">
          <div class="loader"></div>
          <div class="loading-text">Generating summary...</div>
        </div>
      `;
    });

    document.getElementById('copy-btn').addEventListener('click', function() {
      const result = document.getElementById('result').textContent;
      navigator.clipboard.writeText(result).then(() => {
        const button = this;
        const originalText = button.textContent;
        button.textContent = '✓ Copied!';
        button.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
        
        setTimeout(() => {
          button.textContent = originalText;
          button.style.background = 'linear-gradient(135deg, #f093fb, #f5576c)';
        }, 2000);
      });
    });