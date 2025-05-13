/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

// Import core modules
import "./BazaarNotifier";
import "./BasicMarketTracker";
import "./MarketTrackerDownloaded";

// The BasicMarketTracker will download the file on startup
// After download, run /ct reload to activate it
// You can also manually trigger download with:
// /marketget