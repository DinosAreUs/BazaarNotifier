/**
 * SimpleDownloader.js
 * 
 * Just downloads the market tracker file without any modifications.
 */

// Debug flag
const DEBUG = true;

// GitHub URL
const GITHUB_URL = "https://raw.githubusercontent.com/DinosAreUs/marketforbazaartracker/main/FreeTrialMarketTracker.js";

// Local file path
const LOCAL_FILE = "./config/ChatTriggers/modules/BazaarNotifier-1/MarketTrackerDownloaded.js";

/**
 * Debug logging function
 */
function debug(message) {
  if (DEBUG) {
    ChatLib.chat("§b[Download] §f" + message);
  }
}

/**
 * Download the market tracker code
 */
function downloadMarketTracker() {
  debug("Starting download...");
  ChatLib.chat("§6[Market Tracker] §fDownloading market tracker...");
  
  // Run in separate thread
  new Thread(() => {
    try {
      // Set up HTTP connection
      const url = new java.net.URL(GITHUB_URL);
      const connection = url.openConnection();
      connection.setRequestMethod("GET");
      connection.setRequestProperty("User-Agent", "Mozilla/5.0");
      connection.setConnectTimeout(5000);
      connection.setReadTimeout(5000);
      
      // Read response
      const responseCode = connection.getResponseCode();
      debug("Response code: " + responseCode);
      
      if (responseCode === 200) {
        // Read content
        const reader = new java.io.BufferedReader(
          new java.io.InputStreamReader(connection.getInputStream())
        );
        const stringBuilder = new java.lang.StringBuilder();
        let line;
        
        while ((line = reader.readLine()) !== null) {
          stringBuilder.append(line).append("\n");
        }
        reader.close();
        
        const code = stringBuilder.toString();
        
        if (code && code.length > 0) {
          debug("Download successful!");
          
          // Save to file
          saveToFile(code);
          
          // Notify success
          ChatLib.chat("§a[Market Tracker] §fDownload complete! Run §e/ct reload§f to activate.");
        } else {
          ChatLib.chat("§c[Market Tracker] §fDownloaded content is empty!");
        }
      } else {
        ChatLib.chat("§c[Market Tracker] §fHTTP error: " + responseCode);
      }
    } catch (error) {
      ChatLib.chat("§c[Market Tracker] §fError downloading: " + error);
    }
  }).start();
}

/**
 * Save content to local file
 */
function saveToFile(content) {
  try {
    // Create directory if it doesn't exist
    const directory = new java.io.File("./config/ChatTriggers/modules/DinosBazaarNotifier");
    if (!directory.exists()) {
      directory.mkdirs();
    }
    
    // Save the file
    const file = new java.io.File(LOCAL_FILE);
    const writer = new java.io.FileWriter(file);
    writer.write(content);
    writer.close();
    
    debug("File saved to: " + LOCAL_FILE);
    
  } catch (error) {
    debug("Error saving file: " + error);
  }
}

// Register command for manual download
register("command", () => {
  downloadMarketTracker();
}).setName("marketget");

// Download on module load
downloadMarketTracker();

// Export for use in other files
export {
  downloadMarketTracker
};
