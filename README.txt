BazaarNotifier for ChatTriggers
A powerful ChatTriggers module for Hypixel SkyBlock that tracks and notifies you of bazaar activity in real-time.

Features
Real-time Order Tracking: Get instant notifications when your buy orders and sell offers are filled
On-screen Display: View all your active bazaar orders directly on your game screen
Price Checking: Use the /bz command to quickly check current prices for any bazaar item
Price History: Track price trends for popular bazaar items with graphical displays
Sound Alerts: Optional audio notifications when orders are completed
Fully Customizable: Adjust colors, positions, update intervals, and more
Installation
Prerequisites:

ChatTriggers (version 1.3.0 or higher)
Vigilance module (for settings GUI)
Install Vigilance (if not already installed):

/ct import Vigilance
Install BazaarNotifier: download the module manually and place it in:

.minecraft/config/ChatTriggers/modules/
Activate the Module:

Restart Minecraft, or
Run /ct reload
Commands
/bn or /bazaarnotifier - Open the settings menu
/bz <item> - Check current bazaar prices for an item
/marketget - Manually update the market tracker
Price History Tracker
The module features an integrated market tracker that:

Tracks buy/sell prices for popular bazaar items
Displays historical price data for the past 6 hours
Updates automatically every 10 minutes
Shows interactive price charts with trends
Settings
Configure the module through the settings GUI:

General Settings:

Enable/disable the entire module
Toggle notifications and sound alerts
Adjust update interval
Display Settings:

Toggle the on-screen order display
Customize display position (X/Y coordinates)
Color Settings:

Customize header color
Customize text color
Customize highlight color
Troubleshooting
If you encounter issues:

Unknown Command Errors:

Ensure both Vigilance and BazaarNotifier are properly imported
Try running /ct reload
Check ChatTriggers console for errors
No Notifications:

Make sure notifications are enabled in settings
Verify that the module is enabled
Market Tracker Not Working:

Run /marketget to manually trigger a download
Run /ct reload after downloading
Credits
Created by DinosRUS
Version: 1.2.1
For Hypixel SkyBlock players, by a Hypixel SkyBlock player
Support & Feedback
If you have suggestions or encounter bugs, feel free to report them on the GitHub repository or contact DinosRUS on Discord.

Happy flipping and enjoy the profits!