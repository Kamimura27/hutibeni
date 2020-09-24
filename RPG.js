var cvs = document.getElementById('cv');
var ctx = cvs.getContext('2d');
var SCREEN_X = 1024;
var SCREEN_Y = 768;

window.onload = () => {

    var img = new Image();
    img.src = "./画像/pipo-bg001a.jpg"

    const TITLE = '音声認識RPG';

    img.addEventListener('load', function () {
        ctx.drawImage(img, 0, 0, SCREEN_X, SCREEN_Y);
        writeTitle();
        writeSTART();

    })

    document.addEventListener('keydown', function () {
        if(event.keyCode == 13){
            writeMode();
       }
    })

    function writeTitle() {
        ctx.font = 'bold 60pt Arial';
        ctx.fillStyle = '#bbb';
        ctx.fillText(TITLE, 262, 264);
        ctx.fillStyle = 'orange';
        ctx.fillText(TITLE, 256, 270);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.strokeText(TITLE, 256, 270);

    };

    function writeSTART() {
        ctx.font = 'bold 48pt Arial';
        ctx.fillStyle = 'orange';
        ctx.fillText('START', 420, 576);
        /*ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.strokeText('音声認識RPG', 256, 270);*/
    }

    function writeMode() {
        var WIN_X =335;
        var WIN_Y = 340;
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
        ctx.font = "bold 36px Arial";
        ctx.fillText('>', 395, 590);
        ctx.fillText('>', 395, 630);

    }

    function writeNum() {

    }

/*

*/


};


