// class
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Enemy {
  constructor(handle, locationX, locationY, moveX, moveY, accelX, accelY) {
    this.handle = handle;
    this.locationX = locationX;
    this.locationY = locationY;
    this.moveX = moveX;
    this.moveY = moveY;
    this.accelX = accelX;
    this.accelY = accelY;
  }
}


// global
var screenCanvas;// html elems
var run = true;
var fps = 1000 / 60;// 60fps

// キーボードの入力状態を記録する配列
var inputKeys = new Array();
//プレイヤー
var playerLocation;
var playerWindow;
var playerSpeed;//移動速度
//敵
var enemiesCount;
var enemies = new Array();
//ゲームフラグ
var start = false;
//時間
var time;

// main
window.onload = function () {
  //初期化
  init();


  //ループ
  (function () {
    if (start) {//ゲーム中
      //プレイヤー操作
      mainKeydown();//キー検知
      playerMove();//プレイヤー移動

      //敵
      enemyMove();//敵移動

      //あたり判定
      if (playerCollider()) {
        end();
      }
      time++;
    }

    //fps管理
    if (run) { setTimeout(arguments.callee, fps); }
  })();
};


//イベント
function windowDance() {
  removeAllWindows();//初期化
  enemiesCount = 364;
  for (var i = 0; i < enemiesCount; i++) {
    var top = 10 + 70 * (i % 14);
    var left = 10 + 70 * Math.floor(i / 14);
    enemies[i] = new Enemy(playerCreate("enemy.html", "Enemy" + i, "top=" + top + ",left=" + left + ",width=50,height=50"), top, left, 0, 0, 0, 0);
  }
}

function gameStart() {//ゲーム開始
  start = true;//ゲームスタートフラグ
}

function gameStop() {//ゲーム停止
  start = false;//ゲームスタートフラグ
}

function gameRestart() {
  init();
  start = true;
}

function end() {//ﾀｰﾐﾈｰﾀｰ
  start = false;
  for (var i = 0; i < enemiesCount; i++) {
    enemies[i].handle.resizeTo(15 * 16, 15 * 9)
    enemies[i].handle.say("耐えた時間＝" + Math.floor((time / 60) * 100) / 100 + "秒");
    playerWindow.say("Windows\n耐えた時間＝" + Math.floor((time / 60) * 100) / 100 + "秒");
  }
}

function init() {//ゲーム開始
  enemiesCount = 10;
  time = 0;

  //プレイヤーウィンドウ作成
  playerLocation = new Point(200, 800);
  playerWindow = playerCreate("player.html", "Player", "top=" + playerLocation.y + ",left=" + playerLocation.x + ",width=50,height=50");//ハンドル格納

  //敵ウィンドウ作成
  for (var i = 0; i < enemiesCount; i++) {//敵生成
    var top = 200, left = 180 * i + 50;
    enemies[i] = new Enemy(playerCreate("enemy.html", "Enemy" + i, "top=" + top + ",left=" + left + ",width=" + (10 * i + 10) + ",height=" + (10 * i + 10)), left, top, 0, 0, 0, 0);
    enemies[i].handle.resizeTo(20 * i + 50, 20 * i + 50);
  }
  start = false;//ゲームスタートフラグ
}

function removeAllWindows() {//すべてのウィンドウを消す
  for (var i = 0; i < enemiesCount; i++) {
    enemies[i].handle.close();
  }
  playerWindow.close();
  start = false;
}

function playerCreate(url, name, option) {//ウィンドウ作成
  var windowHandle = window.open(url, name, option);
  windowHandle.resizeTo(50, 50);
  return windowHandle;//作成したウィンドウのハンドル
}

//---キー入力関係---
//キーを押したとき
document.onkeydown = function (ev) {
  if (!ev) ev = window.event;
  inputKeys[ev.keyCode] = true;
};

//キーを離したとき
document.onkeyup = function (ev) {
  if (!ev) ev = window.event;
  inputKeys[ev.keyCode] = false;
};

//キーが押されているか
function keyIsDown(keyCode) {
  if (inputKeys[keyCode]) return true;
  return false;
}


//////////////キャラ移動
//プレイヤー移動
function mainKeydown() {
  //shift
  if (keyIsDown(16)) {
    playerSpeed = 5;//低速移動
  } else {//押してないとき
    playerSpeed = 15;//高速
  }
  //うえ
  if (keyIsDown(38)) {
    playerLocation.y += -playerSpeed;
  }
  //した
  if (keyIsDown(40)) {
    playerLocation.y += playerSpeed;
  }
  //ひだり
  if (keyIsDown(37)) {
    playerLocation.x += -playerSpeed;
  }
  //みぎ
  if (keyIsDown(39)) {
    playerLocation.x += playerSpeed;
  }
}

function playerMove() {
  //画面端
  if (playerLocation.x < 0) {
    playerLocation.x = 0;
  }
  if (playerLocation.y < 0) {
    playerLocation.y = 0;
  }
  if (playerLocation.x > screen.availWidth - playerWindow.outerWidth) {//1788
    playerLocation.x = screen.availWidth - playerWindow.outerWidth;
  }
  if (playerLocation.y > screen.availHeight - playerWindow.outerHeight) {//874
    playerLocation.y = screen.availHeight - playerWindow.outerHeight;
  }

  //移動
  playerWindow.moveTo(playerLocation.x, playerLocation.y);
}

//敵移動
function enemyMove() {
  for (var i = 0; i < enemiesCount; i++) {
    //加速量
    enemies[i].accelX = Math.random() * 1 - Math.random() * 1;
    enemies[i].accelY = Math.random() * 1 - Math.random() * 1;
    //力学的あれ
    enemies[i].moveX += enemies[i].accelX;//力を加える
    enemies[i].moveY += enemies[i].accelY;
    enemies[i].locationX += enemies[i].moveX;//運動する
    enemies[i].locationY += enemies[i].moveY;

    //画面端
    if (enemies[i].locationX < 0) {
      enemies[i].locationX = 0;
      enemies[i].moveX = 0;
    }
    if (enemies[i].locationY < 0) {
      enemies[i].locationY = 0;
      enemies[i].moveY = 0;
    }
    if (enemies[i].locationX > screen.availWidth - enemies[i].handle.outerWidth) {
      enemies[i].locationX = screen.availWidth - enemies[i].handle.outerWidth;
      enemies[i].moveX = 0;
    }
    if (enemies[i].locationY > screen.availHeight - enemies[i].handle.outerHeight) {
      enemies[i].locationY = screen.availHeight - enemies[i].handle.outerHeight;
      enemies[i].moveY = 0;
    }

    //ウィンドウ操作
    enemies[i].handle.moveTo(enemies[i].locationX, enemies[i].locationY);
  }
  //画面サイズ大きくする
  enemies[Math.floor(Math.random() * enemies.length)].handle.resizeBy(1, 0);
  enemies[Math.floor(Math.random() * enemies.length)].handle.resizeBy(0, 1);
}

///////////あたり判定
function collisionDetect(x1, y1, x2, y2, width1, height1, width2, height2) {
  var horizontal = (x2 < x1 + width1) && (x1 < x2 + width2);
  var vertical = (y2 < y1 + height1) && (y1 < y2 + height2);
  return (horizontal && vertical);
}

//自機と敵すべてとのあたり判定をとる
function playerCollider() {
  for (var i = 0; i < enemiesCount; i++) {
    x1 = playerLocation.x + 20;
    y1 = playerLocation.y + 20;
    x2 = enemies[i].locationX + 20;
    y2 = enemies[i].locationY + 20;
    width1 = playerWindow.outerWidth - 20 * 2;
    height1 = playerWindow.outerHeight - 20 * 2;
    width2 = enemies[i].handle.outerWidth - 20 * 2;
    height2 = enemies[i].handle.outerHeight - 20 * 2;
    if (collisionDetect(x1, y1, x2, y2, width1, height1, width2, height2)) return true;
  }
  return false;
}
