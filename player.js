// global
var info;
var run = true;
var start = true;
var fps = 1000 / 60;
// main
window.onload = function () {
  info = document.getElementById('info');

  //ループ呼び出し
  (function () {
    //fps管理
    if (run) { setTimeout(arguments.callee, fps); }
  })();
};

function say(saying) {
  start = false;
  info.innerText = saying;
}
