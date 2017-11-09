var muteEnabled = false;

function wrapper(id, ci, tab) {
  muteTab(tab);
}

function muteTab(tab) {
  browser.tabs.update(tab.id, { muted: true });
}

function toggleMute() {
  muteEnabled = !muteEnabled;
  if (muteEnabled) {
    browser.tabs.query({}, result =>
      result.forEach(tab => browser.tabs.update(tab.id, { muted: true }))
    );
    browser.tabs.onCreated.addListener(muteTab);
    browser.tabs.onUpdated.addListener(wrapper);
  } else {
    browser.tabs.query({}, result =>
      result.forEach(tab => browser.tabs.update(tab.id, { muted: false }))
    );
    if (browser.tabs.onCreated.hasListener(muteTab)) {
      browser.tabs.onCreated.removeListener(muteTab);
    }
    if (browser.tabs.onUpdated.hasListener(wrapper)) {
      browser.tabs.onUpdated.removeListener(wrapper);
    }
  }
}
browser.browserAction.onClicked.addListener(toggleMute);
