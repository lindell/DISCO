let phrase = window.location.pathname.substr(1) || 'Disco';
phrase = decodeURIComponent(phrase);
const color = [
  'blue', 'yellow', 'lime', 'magenta', 'aqua', 'green', 'orange',
  'crimson', 'royalblue', 'hotpink', 'indigo', 'dodgerblue', 'chartreuse',
  'skyblue', 'red',
];
let backgroundCounter = 0;
let foregroundCounter = 1;
document.title = phrase + '-'.repeat(Math.max(1, 31 - phrase.length));

const cursors = [
  'wait', 'pointer', 'help', 'copy', 'zoom-in', 'zoom-out', 'move',
];
let cursorCounter = 0;

const faviconCanvas = document.createElement('canvas');
faviconCanvas.width = 16;
faviconCanvas.height = 16;
const faviconCtx = faviconCanvas.getContext('2d');

window.addEventListener('load', function() {
  tick();

  document.querySelector('.text-top').innerText = phrase;
  document.querySelector('.text-bottom').innerText = phrase;

  audioSetup();
}, false);


function tick() {
  document.body.style.backgroundColor = color[backgroundCounter];
  document.body.style.color = color[foregroundCounter];
  document.body.style.cursor = cursors[cursorCounter];

  if (++backgroundCounter >= color.length) {
    backgroundCounter = 0;
  }

  if (++foregroundCounter >= color.length) {
    foregroundCounter = 0;
  }

  if (++cursorCounter >= cursors.length) {
    cursorCounter = 0;
  }

  generateFavicon();

  const browsers = document.querySelectorAll('.browser-color');
  for (let k = 0; k < browsers.length; k++) {
    browsers[k].setAttribute(
      'content',
      window.getComputedStyle(document.body).backgroundColor
    );
  }

  const fs = Math.round(Math.random() * 30);
  document.querySelector('.text-top').style.fontSize = (fs + 10) + 'vmin';
  document.querySelector('.text-bottom').style.fontSize = (40 - fs) + 'vmin';

  document.title = document.title.substr(1) + document.title.substr(0, 1);

  setTimeout(tick, 50);
}

// Add vibrations on some devices?
setInterval(function() {
  window.navigator.vibrate(700);
}, 1000);

let invertedText = false;
function audioSetup() {
  const audioFile = new Audio('/assets/disco.mp3');
  audioFile.addEventListener('timeupdate', function() {
    const buffer = .44;
    if (this.currentTime > this.duration - buffer) {
      this.currentTime = 0;
      this.play();

      invertedText = !invertedText;
      if (invertedText) {
        document.querySelector('.text').style.transform = 'scaleY(-1)';
      } else {
        document.querySelector('.text').style.transform = 'scaleY(1)';
      }
    }
  }, false);
  audioFile.play();

  // Make music playable on some mobile devices
  let ts = document.addEventListener('touchstart', function() {
    audioFile.play();
    document.removeEventListener('touchstart', ts);
  });
}

function generateFavicon() {
  faviconCtx.fillStyle = window.getComputedStyle(document.body).backgroundColor;
  faviconCtx.fillRect(0, 0, 16, 16);

  document.getElementById('favicon').setAttribute(
    'href',
    faviconCanvas.toDataURL('image/x-icon')
  );
}
