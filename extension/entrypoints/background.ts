export default defineBackground(() => {
  // Tell Chrome to open the side panel automatically when the extension icon is clicked.
  // Using chrome directly because sidePanel is a Chrome-specific API not in the webextension polyfill.
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});
