var cvs = document.getElementById('cv');
var ctx = cvs.getContext('2d');
var INPUT = document.getElementById('input');
var SCREEN_X = 1024;
var SCREEN_Y = 768;

INPUT.style.display = "none";
let text = "";
var playerName = [];


window.onload = () => {

    var img = new Image();
    img.src = "./image/pipo-bg001a.jpg"

    const TITLE = '音声認識RPG';

    //矢印の位置
    var arrow_point = 0;
    //矢印を表示座標
    var arrow_x = 395;
    var arrow_y = 590;
    var arrow_py = 40;
    //キー管理
    var down = false;
    var up = false;
    var enter = false;
    //
    var playerNum = 0;
    //requestAnimationFrameで動作しているメソッドの管理
    var callbackId;

    document.addEventListener('keydown', keyDown, false);
    document.addEventListener('keyup', keyUp, false);


    img.addEventListener('load', function () {
        Init_Title();
    })

    //タイトル画面関連の処理
    function Init_Title() {
        ctx.drawImage(img, 0, 0, SCREEN_X, SCREEN_Y);
        drawTitle();
        drawSTART();
        callbackId = requestAnimationFrame(Init_Title);
        if (enter) {
            cancelAnimationFrame(callbackId);
            enter = false;
            selectMode();
        }

    }

    //キーが押されたとき
    function keyDown(e) {
        if (e.keyCode == 13) {
            enter = true;
        }
        else if (e.keyCode == 38) {
            up = true;
        }
        else if (e.keyCode == 40) {
            down = true;
        }
    };

    //キーが離れたとき
    function keyUp(e) {
        if (e.keyCode == 13) {
            enter = false;
        }
        else if (e.keyCode == 38) {
            up = false;
        }
        else if (e.keyCode == 40) {
            down = false;
        }
    };

    //タイトルの描画
    function drawTitle() {
        ctx.font = 'bold 60pt Arial';
        ctx.fillStyle = '#bbb';
        ctx.fillText(TITLE, 262, 264);
        ctx.fillStyle = 'orange';
        ctx.fillText(TITLE, 256, 270);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.strokeText(TITLE, 256, 270);

    };

    //STARTの描画
    function drawSTART() {
        ctx.font = 'bold 48pt Arial';
        ctx.fillStyle = 'orange';
        ctx.fillText('START', 420, 576);
        /*ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.strokeText('音声認識RPG', 256, 270);*/
    }

    //モード選択のウィンドウの描画
    function drawMode() {
        var WIN_X = 335;
        var WIN_Y = 340;
        //ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.fillRect(370, 430, 300, 250);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 5;
        ctx.strokeRect(370, 430, 300, 250);

        ctx.font = 'bold 24pt Arial';
        ctx.fillStyle = 'black';
        ctx.fillText('あそぶモードを', 400, 490);
        ctx.fillText('教えてね', 400, 530);
        ctx.fillText('OITモード', 420, 590);
        ctx.fillText('ムゲンモード', 420, 630);
        //ctx.closePath();
    }

    //矢印の描画と操作
    function drawArrow() {

        if (down && arrow_point < 1) {
            arrow_point += 1;
            down = false;
        } else if (up && arrow_point > 0) {
            arrow_point -= 1;
            up = false;
        }
        var a_y = arrow_y + arrow_py * arrow_point;

        //ctx.beginPath();
        ctx.font = 'bold 24pt Arial';
        ctx.fillStyle = 'black';
        ctx.fillText('>', arrow_x, a_y)
        //ctx.closePath();
    }

    //モード選択の操作
    function selectMode() {
        drawMode();
        drawArrow();
        callbackId = requestAnimationFrame(selectMode);
        if (enter) {
            cancelAnimationFrame(callbackId);
            enter = false;
            selectNum();
        }
    }

    //人数選択のウィンドウの描画
    function drawNum() {
        ctx.fillStyle = "white";
        ctx.fillRect(370, 430, 300, 300);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 5;
        ctx.strokeRect(370, 430, 300, 300);
        ctx.font = 'bold 24pt Arial';
        ctx.fillStyle = 'black';
        ctx.fillText('あそぶ人数を', 400, 490);
        ctx.fillText('教えてね', 400, 530);
        ctx.fillText('１人', 420, 590);
        ctx.fillText('２人', 420, 630);
        ctx.fillText('３人', 420, 670);
        ctx.fillText('４人', 420, 710);
    }

    //人数選択の操作
    function selectNum() {
        drawNum();
        drawArrow2();
        callbackId = requestAnimationFrame(selectNum);
        if (enter) {
            cancelAnimationFrame(callbackId);
            playerNum = arrow_point + 1;
            enter = false;
            registChara();
        }
    }

    //キャラクター登録
    function registChara() {
        for (let i = 1; i <= playerNum; i++) {
            console.log(i);
            drawChara(i);

        }

    }

    //キャラクター登録画面の表示
    function drawChara(i) {
        ctx.fillStyle = "white";
        ctx.fillRect(370, 430, 300, 300);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 5;
        ctx.strokeRect(370, 430, 300, 300);
        ctx.font = 'bold 24pt Arial';
        ctx.fillStyle = 'black';
        ctx.fillText('プレイヤー' + i + 'の', 400, 490);
        ctx.fillText('名前を教えてね', 400, 530);
        inputString();
    }

    //文字入力
    function inputString() {
        INPUT.style.display = "block";
        //console.log("異議あり");
        //console.log(enter);
        if (enter) {
            cancelAnimationFrame(callbackId);
            enter = false;
            text = INPUT.value;
            console.log(INPUT.value);
            ctx.font = 'bold 24pt Arial';
            ctx.fillStyle = 'black';
            ctx.fillText(text, 410, 620);
        }
        callbackId = requestAnimationFrame(inputString);
    }

    //人数選択の矢印の描画と操作
    function drawArrow2() {
        if (down && arrow_point < 3) {
            arrow_point += 1;
            down = false;
        } else if (up && arrow_point > 0) {
            arrow_point -= 1;
            up = false;
        }
        var a_y = arrow_y + arrow_py * arrow_point;

        ctx.font = 'bold 24pt Arial';
        ctx.fillStyle = 'black';
        ctx.fillText('>', arrow_x, a_y)
    }

    function sleep(waitMsec) {
        var startMsec = new Date();

        // 指定ミリ秒間だけループさせる（CPUは常にビジー状態）
        while (new Date() - startMsec < waitMsec);
    }
};
