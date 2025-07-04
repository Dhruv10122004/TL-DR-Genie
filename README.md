# TL;DR Genie

**TL;DR Genie** is a powerful browser extension that uses **Google's Gemini AI** to instantly summarize any webpage. Whether you're researching, studying, or just trying to quickly understand content, TL;DR Genie transforms lengthy articles into **digestible summaries tailored to your preferences**.

> ⚠️ **Note:** This extension is currently available for **manual installation only**. Due to the Chrome Web Store's $5 developer registration fee, we haven't published it yet. However, you can **easily install and use it** by following the steps below!

---

## Features

### Smart Summarization
- **5 Summary Styles**: Brief, Detailed, Bullet Points, Academic, and Creative
- **3 Length Options**: Short, Medium, and Long

### Beautiful Interface
- **Dark/Light Theme Toggle**: Seamless theme switching with smooth animations
- **Responsive Layout**: Fully optimized for the Chrome extension popup view

### 🔧 User Experience
- **One-Click Summarization**: Simple and intuitive workflow
- **Copy to Clipboard**: Effortlessly share or save summaries
- **Real-Time Word Count**: Instantly track summary length
- **Robust Error Handling**: Graceful fallback for API issues or page errors

### Performance
- **Fast Processing**: Powered by **Google's Gemini Pro model**
- **Optimized Content Extraction**: Smart text cleanup for clean summaries
- **Memory Efficient**: Clean, lightweight, and performant codebase

---

## Quick Start

### Prerequisites
- A Chromium-based browser (e.g., Google Chrome, Brave, Edge)
- A free **Google Gemini API key** - [Get your key from Google AI Studio](https://aistudio.google.com/app/apikey)

---

### Installation Steps

#### 1. Clone the Repository

**Choose one of these methods:**

**Option A: Using Git (Recommended)**
```bash
git clone https://github.com/Dhruv10122004/TL-DR-Genie.git
cd TL-DR-Genie
```

**Option B: Download ZIP**
1. Go to the [TL;DR Genie repository](https://github.com/Dhruv10122004/TL-DR-Genie)
2. Click the green **"Code"** button
3. Select **"Download ZIP"**
4. Extract the ZIP file to your desired location
5. Rename the folder to `TL-DR-Genie` (remove any version suffixes)

**Important**: Remember the folder location - you'll need it in step 3!

#### 2. Set Up Your API Key

**Detailed API setup process:**

1. **Get your Gemini API key**:
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Sign in with your Google account
   - Click **"Create API Key"** button
   - Copy the generated API key (keep it safe!)

2. **Configure the extension**:
   - After installing the extension (see step 3), click on the **TL;DR Genie** icon in your Chrome toolbar
   - If you don't see the icon, click the puzzle piece (🧩) in the toolbar to find it
   - In the extension popup, click the **⚙️ Settings** gear icon (usually in the top-right)
   - Paste your API key in the **"API Key"** field
   - Click **"Save"** to store your key

3. **Test the setup**:
   - Navigate to any webpage with content
   - Click the TL;DR Genie icon
   - Try generating a summary to ensure everything works

#### 3. Load the Extension in Chrome

**Step-by-step detailed instructions:**

1. **Open Google Chrome** on your computer

2. **Navigate to Extensions page**:
   - Type `chrome://extensions/` in the address bar and press Enter
   - **OR** click the three dots menu (⋮) → More tools → Extensions

3. **Enable Developer Mode**:
   - Look for the **"Developer mode"** toggle switch in the **top-right corner** of the page
   - Click the toggle to turn it **ON** (it should turn blue/green)
   - You'll see new buttons appear: "Load unpacked", "Pack extension", "Update"

4. **Load the Extension**:
   - Click the **"Load unpacked"** button (appears after enabling Developer mode)
   - A file browser window will open
   - Navigate to and select the **`TL-DR-Genie`** folder you cloned earlier
   - Click **"Select Folder"** (or "Open" depending on your OS)

5. **Verify Installation**:
   - The extension should now appear in your extensions list
   - Look for the **TL;DR Genie extension icon** in your Chrome toolbar (top-right area)
   - If you don't see it, click the puzzle piece icon (🧩) to access hidden extensions
   - Pin the extension by clicking the pin icon next to it

**✅ Success!** The extension is now installed and ready to use!

---

## Usage

### Basic Summarization
1. Navigate to any webpage you want to summarize
2. Click the **TL;DR Genie** extension icon
3. Choose your preferences:
   - **Summary Style**: Brief, Detailed, Bullets, Academic, or Creative
   - **Length**: Short (2–3 sentences), Medium (1 paragraph), or Long (2–3 paragraphs)
4. Click **📄 Summarize**
5. Copy the result using the **📋 Copy** button

---

## Summary Styles Explained

| Style | Description | Best For |
|-------|-------------|----------|
| **Brief** | Quick overview with main points | Fast reading, quick understanding |
| **Detailed** | Comprehensive summary with full context | Research, deep comprehension |
| **Bullets** | Clear, structured bullet points | Skimming, note-taking |
| **Academic** | Formal, structured summary style | Studies, academic reference |
| **Creative** | Engaging, human-like storytelling summary | Social sharing, entertainment |

---

## API Setup Guide

### Getting Your Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **Create API Key**
4. Copy the generated key
5. Paste it in the extension settings

### API Usage
- The extension uses Google's **Gemini Pro model** for high-quality summaries
- Your API key is stored locally in your browser
- No data is shared or stored externally

---

## Troubleshooting

### Common Issues

**🔧 Extension not loading**
- Make sure **Developer mode** is enabled in `chrome://extensions/`
- Try refreshing the extensions page and reloading the extension
- Check that you selected the correct folder (should contain `manifest.json`)

**🔑 API key issues**
- Verify your API key is correct (no extra spaces)
- Check your Google AI Studio quota hasn't been exceeded
- Try generating a new API key if the current one doesn't work

**📄 No summary generated**
- Ensure the webpage has readable text content
- Try refreshing the page and attempting again
- Check browser console for error messages (F12 → Console tab)

**🧩 Extension icon not visible**
- Click the puzzle piece icon (🧩) in your toolbar
- Find TL;DR Genie in the dropdown
- Click the pin icon to keep it visible in your toolbar

**⚠️ Permission errors**
- Some websites may block content extraction
- Try the extension on different websites to test functionality
- Ensure you're not on restricted pages (chrome://, about:, etc.)

### Still Having Issues?

1. **Check the Console**:
   - Right-click on the extension icon → Inspect popup
   - Look for error messages in the Console tab

2. **Reinstall the Extension**:
   - Remove the extension from `chrome://extensions/`
   - Follow the installation steps again

3. **Get Help**:
   - Check the [Issues page](https://github.com/Dhruv10122004/TL-DR-Genie/issues) for similar problems
   - Create a new issue with detailed description and error messages

---

## Contributing

We welcome contributions! Please feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

---

## License

This project is open source. Please check the repository for license details.

---

## Support

If you find this extension helpful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting any bugs you find
- 💡 Suggesting new features
- 🔄 Sharing with others who might benefit

---

**Made with ❤️ by [Dhruv10122004](https://github.com/Dhruv10122004)**