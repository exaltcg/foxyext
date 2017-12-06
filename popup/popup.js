document.addEventListener('DOMContentLoaded', () => {
  // TODO: https://stackoverflow.com/questions/47485053/how-do-i-create-native-looking-popups-in-a-web-extension-for-firefox
let mute_state;
  browser.storage.local.get()
  .then( settings => {
    if (settings.active === 'timer') {
      const timer = document.querySelector('#card-timer');
      let timerHtml = timer.innerHTML;
      document.getElementById('timer').innerHTML = timerHtml;

      const progressLine = document.getElementById('popup-progress-line');
      const stopButton = document.querySelector('.btn-stop');
      const resetButton = document.querySelector('.btn-reset');
      const totalTime = settings.timer.duration;

      document.querySelector('.timer-title').innerText = `${Math.ceil(totalTime / 60)} minutes timer`;
      getProgress(progressLine, stopButton, resetButton, totalTime * 1000);
    }
  })
  .catch(e => console.error(e));

  const turnOffImage = document.querySelector('.turn-off-img');
  browser.storage.local.get('mute_state')
  .then( response => {
    mute_state = response.mute_state;
    if (response.mute_state) {
      turnOffImage.setAttribute('src', '/sidebar/resources/mute-microphone.svg');
    } else {
      turnOffImage.setAttribute('src', '/sidebar/resources/confused.svg');
    }
  })
  .catch(e => console.error(e));

  document.querySelector('.turn-off-btn').addEventListener('click', e => {
    e.preventDefault();
    if (!mute_state) {
      turnOffImage.setAttribute('src', '/sidebar/resources/mute-microphone.svg');
    } else {
      turnOffImage.setAttribute('src', '/sidebar/resources/confused.svg');
    }
    mute_state = !mute_state;
    browser.storage.local.set({mute_state});
    browser.runtime.sendMessage({ mute_state});
  });
});
