// Settings.js - Settings manager for BazaarNotifier

/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

import { @Vigilant, @TextProperty, @ColorProperty, @SwitchProperty, 
         @SliderProperty, @ButtonProperty, Color } from 'Vigilance';

@Vigilant("BazaarNotifier")
class Settings {
    @SwitchProperty({
        name: "Enabled",
        description: "Toggle the entire module functionality",
        category: "General"
    })
    enabled = true;

    @SwitchProperty({
        name: "Notifications",
        description: "Show notifications when orders are filled",
        category: "General"
    })
    notifications = true;

    @SwitchProperty({
        name: "Sound Alerts",
        description: "Play sounds for notifications",
        category: "General"
    })
    soundAlerts = true;

    @SwitchProperty({
        name: "Display Orders",
        description: "Show your current buy/sell orders on screen",
        category: "Display"
    })
    displayOrders = true;

    @SliderProperty({
        name: "Update Interval",
        description: "Time in seconds between bazaar data updates",
        category: "General",
        min: 5,
        max: 60
    })
    updateInterval = 10;

    @SliderProperty({
        name: "Display X",
        description: "X position for the orders display",
        category: "Display",
        min: 0,
        max: Renderer.screen.getWidth()
    })
    displayX = 5;

    @SliderProperty({
        name: "Display Y",
        description: "Y position for the orders display",
        category: "Display",
        min: 0,
        max: Renderer.screen.getHeight()
    })
    displayY = 5;

    @TextProperty({
        name: "Header Color",
        description: "Color for headers (use & color codes)",
        category: "Colors"
    })
    headerColor = "&6";

    @TextProperty({
        name: "Text Color",
        description: "Color for regular text (use & color codes)",
        category: "Colors"
    })
    textColor = "&f";

    @TextProperty({
        name: "Highlight Color",
        description: "Color for highlights/profits (use & color codes)",
        category: "Colors"
    })
    highlightColor = "&a";

    @ButtonProperty({
        name: "Reset Settings",
        description: "Reset all settings to default values",
        category: "General"
    })
    resetSettings() {
        this.enabled = true;
        this.notifications = true;
        this.soundAlerts = true;
        this.displayOrders = true;
        this.updateInterval = 10;
        this.displayX = 5;
        this.displayY = 5;
        this.headerColor = "&6";
        this.textColor = "&f";
        this.highlightColor = "&a";
        
        ChatLib.chat("&6[BazaarNotifier] &fSettings have been reset to defaults.");
    }

    constructor() {
        this.initialize(this);
        this.setCategoryDescription("General", "General settings for BazaarNotifier");
        this.setCategoryDescription("Display", "Settings for the on-screen display");
        this.setCategoryDescription("Colors", "Customize the colors used in the module");
    }

    openGUI() {
        this.display();
    }
}

export default new Settings();