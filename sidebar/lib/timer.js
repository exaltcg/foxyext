let width = 0;
let id;
let period;
let remainingTimeId;
let remainingTime;

const getProgress = (progressLine, stopButton, resetButton, totalTime) => {
  browser.storage.local.get('timeRemaining')
  .then((response) => {
    remainingTime = response.timeRemaining;
    width = (totalTime - response.timeRemaining) * 100 / totalTime;
    period = totalTime / 100;
    console.log('--- Message resp ---', response, width);
    showProgress(progressLine, period, stopButton, resetButton).startProgress();
  })
  .catch(e => console.error(e));
};

const showRemaining = (remainingTime) => {
  if (width >= 100) {
    document.querySelector('.loading-block__title').style.color = '#ffffff';
    document.querySelector('.loading-block__title').innerText = "Time's up!";
    return;
  }
  if (remainingTimeId !== undefined) {
    clearInterval(remainingTimeId);
      remainingTimeId = setInterval(() => {
      remainingTime = remainingTime - 1000;
      let minutes = ('0' + Math.floor(remainingTime / 1000 / 60)).toString().slice(-2);
      let seconds = ('0' + Math.floor((remainingTime / 1000) % 60)).toString().slice(-2);
      document.querySelector('.loading-block__title').innerText = `${minutes}:${seconds} remaining`;
    }, 1000);
}
else if (!remainingTimeId) {
    remainingTimeId = setInterval(() => {
    remainingTime = remainingTime - 1000;
    let minutes = ('0' + Math.floor(remainingTime / 1000 / 60)).toString().slice(-2);
    let seconds = ('0' + Math.floor((remainingTime / 1000) % 60)).toString().slice(-2);
    document.querySelector('.loading-block__title').innerText = `${minutes}:${seconds} remaining`;
  }, 1000);
}
};

const showProgress = (progressLine, interval, stopButton, resetButton) => {
    const startProgress = () => {
      if (id !== undefined) {
      clearInterval(id);
      width = 0;
      progressLine.style.width = '0%';
      id = setInterval(frame, period);
      showRemaining(remainingTime);
    }
      else if (!id) {
        id = setInterval(frame, period);
        showRemaining(remainingTime);
      }
    };
    const frame = () => {
      if (width >= 100) {
        clearInterval(id);
        clearInterval(remainingTimeId);
        document.querySelector('.loading-block__title').style.color = '#ffffff';
        document.querySelector('.loading-block__title').innerText = "Time's up!";
        progressLine.style.width = '100%';
      } else {
        width++;
        progressLine.style.width = width + '%';
      }
    };

  stopButton.addEventListener('click', e => {
  e.preventDefault();
  browser.runtime.sendMessage({ 'stop': 'true' });
  width = 100;
  progressLine.style.width = '100%';
  document.querySelector('.loading-block__title').style.color = '#ffffff';
  document.querySelector('.loading-block__title').innerText = "Time's up!";
  clearInterval(remainingTimeId);
});

resetButton.addEventListener('click', e => {
  e.preventDefault();
  browser.runtime.sendMessage({ 'reset': 'true' });
  progressLine.style.width = '0%';
  startProgress();
  document.querySelector('.loading-block__title').style.color = '#000000';
  document.querySelector('.loading-block__title').innerText = '';
  showRemaining(period * 100);
});
  return { startProgress };
  };
