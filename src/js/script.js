import {limit, substr} from 'stringz';

const discoMusic = require('../assets/disco.mp3');

let phrase = window.location.pathname.substr(1) || 'Disco';
phrase = decodeURIComponent(phrase);
const color = [
  'blue', 'yellow', 'lime', 'magenta', 'aqua', 'green', 'orange',
  'crimson', 'royalblue', 'hotpink', 'indigo', 'dodgerblue', 'chartreuse',
  'skyblue', 'red',
];
let backgroundCounter = 0;
let foregroundCounter = 1;
let title = limit(phrase, 30, '-') + '-';
document.title = title;

const cursors = [
  'wait', 'pointer', 'help', 'copy', 'zoom-in', 'zoom-out', 'move',
];
let cursorCounter = 0;

const faviconCanvas = document.createElement('canvas');
faviconCanvas.width = 16;
faviconCanvas.height = 16;
const faviconCtx = faviconCanvas.getContext('2d');

const events = ['touchend', 'click', 'keydown'];

window.addEventListener('load', function() {
  tick();
  try {
    vibrate();
  } catch {}

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

  // Set color of different tab bars
  const browsers = document.querySelectorAll('.browser-color');
  for (let k = 0; k < browsers.length; k++) {
    browsers[k].setAttribute(
      'content',
      window.getComputedStyle(document.body).backgroundColor,
    );
  }

  const fs = Math.round(Math.random() * 30);
  document.querySelector('.text-top').style.fontSize = (fs + 10) + 'vmin';
  document.querySelector('.text-bottom').style.fontSize = (40 - fs) + 'vmin';

  title = substr(title, 1) + substr(title, 0, 1);
  document.title = title;

  setTimeout(tick, 50);
}

function vibrate(event) {
  // Vibrate for 700 ms. Returns a bool if the vibration was successful or not.
  const success = window.navigator.vibrate(700);

  if (event !== undefined) {
    // Remove the event listeners after an event has happened.
    events.forEach((eventType) => {
      document.removeEventListener(eventType, vibrate);
    });
  }

  if (!success) {
    // If vibrate failed, try again after a user interaction.
    events.forEach((eventType) => {
      document.addEventListener(eventType, vibrate);
    });
  } else {
    // If successful, vibrate again after 1 second.
    setTimeout(vibrate, 1000);
  }
}


let invertedText = false;
function audioSetup() {
  const audioFile = new Audio(discoMusic);
  audioFile.addEventListener('timeupdate', function() {
    const buffer = .44;
    if (audioFile.currentTime > audioFile.duration - buffer) {
      audioFile.currentTime = 0;
      audioFile.play();

      invertedText = !invertedText;
      if (invertedText) {
        document.querySelector('.text').style.transform = 'scaleY(-1)';
      } else {
        document.querySelector('.text').style.transform = 'scaleY(1)';
      }
    }
  }, false);

  async function playUnmuteAudio() {
    audioFile.muted = false;

    // The muted play might have failed, then play it now.
    if (audioFile.paused) {
      /*
        Note: For some reason Firefox still might fail here, but only on key
        events if a special key is pressed (e.g. Control, Shift, etc).
      */
      await audioFile.play().catch(() => {});
    }

    if (!audioFile.paused) {
    // If it's playing, remove all the event listeners.
      events.forEach((event) => {
        document.removeEventListener(event, playUnmuteAudio);
      });
    }
  }

  audioFile.addEventListener('canplaythrough', async() => {
    try {
      // Try to play unmuted audio.
      await audioFile.play();
    } catch (error) {
      // If playing the unmuted audio fails, mute it and play it.
      audioFile.muted = true;

      // Unmute it on any user interaction.
      events.forEach((event) => {
        document.addEventListener(event, playUnmuteAudio);
      });

      // This might still fail, maybe third time's the charm in playUnmuteAudio.
      await audioFile.play().catch(() => {});
    }
  });
}

function generateFavicon() {
  faviconCtx.fillStyle = window.getComputedStyle(document.body).backgroundColor;
  faviconCtx.fillRect(0, 0, 16, 16);

  document.getElementById('favicon').setAttribute(
    'href',
    faviconCanvas.toDataURL('image/x-icon'),
  );
}
