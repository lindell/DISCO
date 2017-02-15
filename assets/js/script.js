var phrase = window.location.pathname.substr(1) || "Disco";
phrase = decodeURIComponent(phrase);
var color = ["blue", "yellow", "lime", "magenta", "aqua", "green", "orange", "crimson", "royalblue", "hotpink", "indigo", "dodgerblue", "chartreuse", "skyblue", "red"];
var bg = 0;
var fg = 1;
document.title = phrase + "-".repeat(Math.max(1, 31 - phrase.length));

var cursors = ["wait", "pointer", "help", "copy", "zoom-in", "zoom-out", "move"];
var c = 0;

var canvas = document.createElement('canvas');
canvas.width = 16;canvas.height = 16;
var ctx = canvas.getContext('2d');

window.addEventListener("load", function () {
  tick();

  document.querySelector(".text-top").innerText = phrase;
  document.querySelector(".text-bottom").innerText = phrase;

  audioSetup();
}, false);


var tick = function () {
  document.body.style.backgroundColor = color[bg];
  document.body.style.color = color[fg];
  document.body.style.cursor = cursors[c];

  if (++bg >= color.length) {
    bg = 0;
  }

  if(++fg >= color.length){
    fg = 0;
  }

  if(++c >= cursors.length){
    c = 0;
  }

  generateFavicon();

  var browsers = document.querySelectorAll(".browser-color");
  for (var k = 0; k < browsers.length; k++) {
    browsers[k].setAttribute("content", window.getComputedStyle(document.body).backgroundColor);
  }

  var fs = Math.round(Math.random() * 30);
  document.querySelector(".text-top").style.fontSize = (fs + 10) + "vmin";
  document.querySelector(".text-bottom").style.fontSize = (40 - fs) + "vmin";

  document.title = document.title.substr(1) + document.title.substr(0, 1);

  setTimeout(tick, 50);
};

// Add vibrations on some devices?
setInterval(function(){
  window.navigator.vibrate(700);
}, 1000);

var invertedText = false;
function audioSetup(){
  var audio_file = new Audio('/assets/disco.mp3');
  audio_file.addEventListener('timeupdate', function(){
    var buffer = .44;
    if(this.currentTime > this.duration - buffer){
      this.currentTime = 0;
      this.play();

      invertedText = !invertedText;
      if(invertedText){
        document.querySelector("body").style.transform = "scaleY(-1)";
      }
      else{
        document.querySelector("body").style.transform = "scaleY(1)";
      }
    }
  }, false);
  audio_file.play();

  // Make music playable on some mobile devices
  var ts = document.addEventListener("touchstart", function () {
    audio_file.play();
    document.removeEventListener("touchstart", ts);
  });
}

function generateFavicon() {
  ctx.fillStyle = window.getComputedStyle(document.body).backgroundColor;
  ctx.fillRect(0, 0, 16, 16);

  document.getElementById("favicon").setAttribute("href", canvas.toDataURL("image/x-icon"));
}
