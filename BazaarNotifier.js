// BazaarNotifier.js
// Main module file for Bazaar Notifier ChatTriggers module

/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

import Settings from "./settings";

// Register module metadata
register("command", () => Settings.openGUI()).setName("bn", true);
register("command", () => Settings.openGUI()).setName("bazaarnotifier", true);
register("command", getItemPrice).setName("bz", true);

// Module constants
const MODULE_NAME = "BazaarNotifier";
const VERSION = "1.0.0";

// State variables
let playerBuyOrders = {};
let playerSellOrders = {};
let bazaarData = {};
let lastUpdateTime = 0;
let inBazaarGui = false;

// Register necessary events
register("step", updateData).setDelay(1);
register("renderOverlay", renderOrdersDisplay);
register("guiOpened", onGuiOpen);
register("guiClosed", onGuiClose);
register("soundPlay", onSoundPlay);

// Initialize the module
function initialize() {
    ChatLib.chat("&6[BazaarNotifier] &fLoaded version " + VERSION);
}

/**
 * Updates data periodically
 */
function updateData() {
    if (!Settings.enabled) return;
    
    const currentTime = Date.now();
    if (currentTime - lastUpdateTime > Settings.updateInterval * 1000) {
        lastUpdateTime = currentTime;
        updateBazaarData();
        checkPlayerOrders();
    }
}

/**
 * Updates bazaar data from API
 */
function updateBazaarData() {
    // Use a more compatible approach that should work across all CT versions
    new Thread(() => {
        try {
            // Using the most basic HTTP request method in CT
            const url = new java.net.URL("https://api.hypixel.net/skyblock/bazaar");
            const connection = url.openConnection();
            connection.setRequestMethod("GET");
            connection.setConnectTimeout(10000);
            connection.setReadTimeout(10000);
            
            const inputStream = connection.getInputStream();
            const scanner = new java.util.Scanner(inputStream).useDelimiter("\\A");
            const response = scanner.hasNext() ? scanner.next() : "";
            scanner.close();
            
            try {
                const data = JSON.parse(response);
                if (data && data.success) {
                    bazaarData = data.products || {};
                    // ChatLib.chat("&a[BazaarNotifier] Bazaar data updated successfully");
                } else {
                    ChatLib.chat("&c[BazaarNotifier] Invalid API response format");
                }
            } catch (parseError) {
                ChatLib.chat("&c[BazaarNotifier] Error parsing bazaar data: " + parseError.message);
            }
        } catch (e) {
            ChatLib.chat("&c[BazaarNotifier] Error updating bazaar data: " + e.message);
        }
    }).start();
}

/**
 * Checks for filled orders by comparing with stored orders
 */
function checkPlayerOrders() {
    // This would need to read from the currently open inventory in the game
    if (inBazaarGui) {
        parseOrdersFromGui();
    }
    
    // Check for changes in orders and notify
    for (const itemId in playerBuyOrders) {
        const oldOrder = playerBuyOrders[itemId];
        // In a real implementation, you would compare old and current values
        if (oldOrder.filled > oldOrder.lastCheckedFilled) {
            notifyOrderUpdate(itemId, "buy", oldOrder.filled - oldOrder.lastCheckedFilled);
            playerBuyOrders[itemId].lastCheckedFilled = oldOrder.filled;
        }
    }
    
    for (const itemId in playerSellOrders) {
        const oldOrder = playerSellOrders[itemId];
        if (oldOrder.filled > oldOrder.lastCheckedFilled) {
            notifyOrderUpdate(itemId, "sell", oldOrder.filled - oldOrder.lastCheckedFilled);
            playerSellOrders[itemId].lastCheckedFilled = oldOrder.filled;
        }
    }
}

/**
 * Parses orders from the bazaar GUI
 */
function parseOrdersFromGui() {
    // Example implementation
    try {
        const inventory = Player.getOpenedInventory();
        if (!inventory || !inventory.getName().includes("Bazaar")) return;
        
        // In a real implementation, this would loop through inventory slots
        // and read lore information to identify and update orders
        
        // This is a simplified example:
        for (let i = 0; i < inventory.getSize(); i++) {
            const item = inventory.getStackInSlot(i);
            if (!item || !item.getName()) continue;
            
            // Check if this is an order item
            if (item.getName().includes("Buy Order") || item.getName().includes("Sell Offer")) {
                const lore = item.getLore();
                // Parse the lore to extract order information
                // This would require specific implementation based on Hypixel's format
            }
        }
    } catch (e) {
        // Silently handle errors to prevent spamming console
    }
}

/**
 * Notifies the player about an order update
 */
function notifyOrderUpdate(itemId, orderType, amount) {
    const formattedName = formatItemName(itemId);
    
    if (orderType === "buy") {
        const price = playerBuyOrders[itemId].pricePerUnit;
        const total = price * amount;
        
        ChatLib.chat(
            Settings.headerColor + "[BazaarNotifier] " + 
            Settings.textColor + "Your buy order for " + 
            Settings.highlightColor + amount + "x " + formattedName + 
            Settings.textColor + " was filled for " + 
            Settings.highlightColor + formatNumber(total) + " coins" +
            Settings.textColor + "!"
        );
    } else {
        const price = playerSellOrders[itemId].pricePerUnit;
        const total = price * amount;
        
        ChatLib.chat(
            Settings.headerColor + "[BazaarNotifier] " + 
            Settings.textColor + "Your sell offer for " + 
            Settings.highlightColor + amount + "x " + formattedName + 
            Settings.textColor + " was filled for " + 
            Settings.highlightColor + formatNumber(total) + " coins" +
            Settings.textColor + "!"
        );
    }
    
    if (Settings.soundAlerts) {
        World.playSound("note.pling", 1.0, 1.0);
    }
}

/**
 * Renders orders display on screen
 */
function renderOrdersDisplay() {
    if (!Settings.enabled || !Settings.displayOrders) return;
    
    const x = Settings.displayX;
    const y = Settings.displayY;
    
    let currentY = y;
    
    // Draw background
    Renderer.drawRect(
        Renderer.color(0, 0, 0, 100),
        x - 5,
        y - 5,
        200,
        20 + (Object.keys(playerBuyOrders).length + Object.keys(playerSellOrders).length) * 10
    );
    
    // Draw header
    Renderer.drawString(
        Settings.headerColor + "Bazaar Orders",
        x,
        currentY
    );
    currentY += 15;
    
    // Draw buy orders
    if (Object.keys(playerBuyOrders).length > 0) {
        Renderer.drawString(
            Settings.headerColor + "Buy Orders:",
            x,
            currentY
        );
        currentY += 10;
        
        for (const itemId in playerBuyOrders) {
            const order = playerBuyOrders[itemId];
            Renderer.drawString(
                Settings.textColor + formatItemName(itemId) + ": " +
                Settings.highlightColor + order.filled + "/" + order.amount + " @ " +
                formatNumber(order.pricePerUnit) + " coins each",
                x,
                currentY
            );
            currentY += 10;
        }
    }
    
    // Draw sell offers
    if (Object.keys(playerSellOrders).length > 0) {
        Renderer.drawString(
            Settings.headerColor + "Sell Offers:",
            x,
            currentY
        );
        currentY += 10;
        
        for (const itemId in playerSellOrders) {
            const order = playerSellOrders[itemId];
            Renderer.drawString(
                Settings.textColor + formatItemName(itemId) + ": " +
                Settings.highlightColor + order.filled + "/" + order.amount + " @ " +
                formatNumber(order.pricePerUnit) + " coins each",
                x,
                currentY
            );
            currentY += 10;
        }
    }
}

/**
 * Gets price info for an item
 */
function getItemPrice(args) {
    if (!args || args.length === 0) {
        ChatLib.chat(Settings.headerColor + "[BazaarNotifier] " + Settings.textColor + "Usage: /bz <item>");
        return;
    }
    
    const query = args.join(" ").toUpperCase().replace(/ /g, "_");
    let found = false;
    
    for (const itemId in bazaarData) {
        if (itemId.includes(query)) {
            found = true;
            const item = bazaarData[itemId];
            
            if (item && item.quick_status) {
                const status = item.quick_status;
                
                ChatLib.chat(Settings.headerColor + "⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯");
                ChatLib.chat(Settings.headerColor + "Bazaar Info: " + Settings.highlightColor + formatItemName(itemId));
                ChatLib.chat(Settings.textColor + "Buy Price: " + Settings.highlightColor + formatNumber(status.buyPrice) + " coins");
                ChatLib.chat(Settings.textColor + "Sell Price: " + Settings.highlightColor + formatNumber(status.sellPrice) + " coins");
                ChatLib.chat(Settings.textColor + "Buy Volume: " + Settings.highlightColor + formatNumber(status.buyVolume));
                ChatLib.chat(Settings.textColor + "Sell Volume: " + Settings.highlightColor + formatNumber(status.sellVolume));
                ChatLib.chat(Settings.textColor + "Margin: " + Settings.highlightColor + formatNumber(status.buyPrice - status.sellPrice) + " coins");
                ChatLib.chat(Settings.headerColor + "⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯");
                break;
            }
        }
    }
    
    if (!found) {
        ChatLib.chat(Settings.headerColor + "[BazaarNotifier] " + Settings.textColor + "Item not found. Try a different name.");
    }
}

/**
 * Handles GUI open events
 */
function onGuiOpen(event) {
    try {
        const gui = event.gui;
        if (gui && gui.toString().includes("ContainerChest")) {
            const container = gui.getContainer();
            if (container && container.getName() && container.getName().includes("Bazaar")) {
                inBazaarGui = true;
            }
        }
    } catch (e) {
        // Silent error handling
    }
}

/**
 * Handles GUI close events
 */
function onGuiClose() {
    inBazaarGui = false;
}

/**
 * Handles sound events to detect bazaar transactions
 */
function onSoundPlay(pos, name, volume, pitch, category) {
    if (!Settings.enabled) return;
    
    // In Hypixel, certain sounds play when orders are filled
    if (name === "random.orb" && inBazaarGui) {
        // Potential order update - force check
        checkPlayerOrders();
    }
}

/**
 * Formats item ID to a readable name
 */
function formatItemName(itemId) {
    // Convert something like ENCHANTED_BREAD to "Enchanted Bread"
    return itemId.split("_")
        .map(word => word.charAt(0) + word.slice(1).toLowerCase())
        .join(" ");
}

/**
 * Formats a number with commas
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Export utility functions
export {
    formatItemName,
    formatNumber
};

// Initialize module on load
initialize();