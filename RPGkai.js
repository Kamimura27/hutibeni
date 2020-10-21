const cvs = document.getElementById('cv');      //  cvキャンバスの要素を取得
const ctx = cvs.getContext('2d');               //  2D描画コンテキストの要素を取得
const FONT = 'bold 24pt Meiryo';                //  フォント
const FONT_TITLE = '60pt Meiryo';               //  タイトルフォント
const FONT_START = 'bold 48pt Meiryo';          //  スタートフォント
const FONT_STYLE = 'black';                     //  フォントの色
const FONT_W = 2;                               //  フォントの幅
const NAME_MAX = 8;                             //  プレイヤー名の最大長
const SCREEN_W = 1024;                          //  キャンバス画面の幅
const SCREEN_H = 768;                           //  キャンバス画面の高さ
const SELECT_X = 370;                           //  セレクト画面のx座標
const SELECT_Y = 430;                           //  セレクト画面のy座標
const SELECT_WH = 300;                          //  セレクト画面の幅,高さ
const SELECT_FSTYLE = 'white';                  //  セレクト画面の色
const SELECT_SSTYLE = 'black';                  //  セレクト画面の枠の色
const TITLE = '音声認識RPG';                     // タイトル名
const TITLE_X = 262;                            //  タイトルのx座標
const TITLE_Y = 264;                            //  タイトルのy座標
const TITLE_P = 6;                              //  タイトルの移動量

const INPUT = document.getElementById('input'); //  inputの要素を取得
const gKey = new Uint8Array(0x100);             //  キー入力バッファ

let cursor = 0;                                 //  カーソルの位置
let count = 1                                   //  プレイヤー番号
let callbackId;                                 //  アニメーションの返却値
let imgTitle;                                   //  タイトル画像
let msg = [];                                   //  メッセージ
let phase = 0;                                  //  フェーズの状態
let slc_dy = 40;                                //  セレクトメッセージの間隔
let mode;                                       //  モード状態 0:OIT, 1:ムゲン
let playerNum;                                  //  プレイヤー人数 1~4
let text = '';                                  //  INPUTの中身を確保
let recognition;                                //  WebAPIに格納する変数
let check = false;                              //  音声認識正誤
let name = '';                                  //
let next_audio;                                 //
let err_audio;                                  //

//  音声入力と比較する文字列
let checkText = [
    ['スタート'],
    ['oit', '無限'],
    ['一人', '二人', '三人', '四人', '1人', '2人', '3人', '4人'],
    ['.'],
    ['はい', 'いいえ', '家', 'いえ'],
    ['OK', 'Ok', 'ok']
];

// プレイヤー情報
let players = [
    { name: '', hp: 0, attack: 0 },
    { name: '', hp: 0, attack: 0 },
    { name: '', hp: 0, attack: 0 },
    { name: '', hp: 0, attack: 0 }
];


//  カーソルの描画
function DrawCursor() {
    ctx.fillText('>', 395, 590 + 40 * cursor);  //  カーソルの位置によって'>'を移動させる
}

//  選択画面の描画
function DrawSelect() {
    //  モード、人数選択、プレイヤー名決定、登録共通ウィンドウ
    ctx.fillStyle = SELECT_FSTYLE;
    ctx.fillRect(SELECT_X, SELECT_Y, SELECT_WH, SELECT_WH);
    ctx.strokeStyle = SELECT_SSTYLE;
    ctx.lineWidth = 5;
    ctx.strokeRect(SELECT_X, SELECT_Y, SELECT_WH, SELECT_WH);

    //  表示させる文字の設定
    ctx.font = FONT;
    ctx.fillStyle = FONT_STYLE;

    //  phaseごとに表示させる文字を格納
    if (phase <= 2 || phase == 4) {
        DrawCursor();
        if (phase == 1) {
            msg = ['あそぶモードを', '教えてね', '', 'OITモード', 'ムゲンモード'];
        } else if (phase == 2) {
            msg = ['あそぶ人数を', '教えてね', '', '１人', '２人', '３人', '４人'];
        } else {
            msg = [name, 'でいいのかな？', '', 'はい', 'いいえ'];
        }
        callbackId = requestAnimationFrame(DrawSelect);     //カーソル更新
    } else if (phase == 3) {
        msg = ['プレイヤー' + count + 'の', '名前を教えてね', ''];
        INPUT.style.visibility = 'visible';                 //  INPUT表示
        callbackId = requestAnimationFrame(DrawSelect);     //カーソル更新
    } else {
        SetPlayerStatus();
        msg = [players[count - 1].name, '', 'HP:' + players[count - 1].hp, 'ATTACK :' + players[count - 1].attack, 'に決定だ！'];
    }

    //  格納した文字を上から順に表示
    for (let i = 0; i < msg.length; i++) {
        ctx.fillText(msg[i], 420, 470 + slc_dy * i);
    }
}

//  タイトルの描画
function DrawTitle() {
    //  タイトルの文字の設定、描画
    ctx.font = FONT_TITLE;
    ctx.fillStyle = '#bbb';
    ctx.fillText(TITLE, TITLE_X, TITLE_Y);
    ctx.fillStyle = 'orange';
    ctx.fillText(TITLE, TITLE_X - TITLE_P, TITLE_Y + TITLE_P);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = FONT_W;
    ctx.strokeText(TITLE, TITLE_X - TITLE_P, TITLE_Y + TITLE_P);

    // STARTの描画
    ctx.font = FONT_START;
    ctx.fillStyle = 'orange';
    ctx.fillText('START', 420, 576);
};

//  2つの整数値の間からランダムの整数値を決める
function getRandomInt() {
    min = Math.ceil(100);
    max = Math.floor(200);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

//  画像の読み込み
function LoadImage() {
    imgTitle = new Image(); imgTitle.src = './image/title.jpg';  //タイトル画像読み込み
    next_audio = new Audio("./sound/button60.mp3");
    err_audio = new Audio("./sound/button62.mp3");
}

//  プレイヤーステータスの決定
function SetPlayerStatus() {
    players[count - 1].name = name;                                         //  名前
    players[count - 1].hp = getRandomInt();                                 //  体力
    players[count - 1].attack = (1 / players[count - 1].hp * 10000 | 0);    //  攻撃力
}

//  音声入力
function SpeechRec() {
    SpeechRecognition = webkitSpeechRecognition || SpeechRecognition;   //  ChromeとFirefoxで音声デバイス許可しますか？のヤツ
    recognition = new SpeechRecognition();                              //  WebAPIが使えるようになるよ
    recognition.lang = 'ja';                                            //  認識言語設定
    recognition.continuous = true;                                      //  録音を続ける
    recognition.interimResults = true;                                  //  中間結果の表示オン

    //  音声入力した結果
    recognition.onresult = function (e) {
        if (e.results[e.resultIndex].isFinal) {                         //  音声入力が終わった時
            text = e.results[e.resultIndex][0].transcript;              //  結果を文字列に格納
            text = text.trim();
            console.log(text);
            TextCheck();
        } else {
            INPUT.value = e.results[e.resultIndex][0].transcript;
        }
    };

    //  音声認識が終了した
    recognition.onend = function () {
        recognition.start();
    }

    recognition.start();                                                //  音声認識開始
}

//  音声入力した文字列の比較
function TextCheck() {
    let ctext = "";
    let reg;
    let i = 0;

    //  各フェーズの文字列と比較
    for (i; i < checkText[phase].length; i++) {
        ctext = checkText[phase][i];
        reg = new RegExp(ctext);                                        //  格納している文字列を正規表現に変える
        check = reg.test(text);
        console.log(checkText[phase][i]);
        if (check) break;
    }

    if (check) {
        switch (phase) {
            case 0:                                                     //  タイトル画面時
                phase = 1;
                DrawSelect();
                break;

            case 1:                                                     //  モード選択時
                mode = i;
                phase = 2;
                break;

            case 2:                                                     //  人数選択時
                if (i >= 4) i -= 4;
                playerNum = i + 1;
                phase = 3;
                break;

            case 3:                                                     //  プレイヤー名入力時
                INPUT.style.visibility = 'hidden';
                name = text.substr(0, 6);                              //  入力した文字列を６文字にする
                phase = 4;
                break;

            case 4:                                                     //  プレイヤー名確認時
                if (i == 0) {
                    phase = 5;
                } else if (i != 0) {
                    phase = 3;
                }
                break;

            case 5:
                if (count < playerNum) {
                    count += 1;
                    phase = 3;
                    cancelAnimationFrame(callbackId);
                    DrawSelect();
                } else {
                    phase = 6
                }
                break;

            default:
                check = false;
                break;
        }
        next_audio.play();
        cursor = 0;
    }else{
        err_audio.play();
    }

    INPUT.value = '';
    text = '';
}

//  キーダウンのイベント
window.onkeydown = function (e) {
    let k = e.keyCode;                          //  キーコード格納

    if (gKey[k] != 0) {                         //  バッファある場合、返す
        return;
    }
    gKey[k] = 1;

    if (phase == 0 && k == 13) {                //  タイトル画面時
        phase = 1;
        DrawSelect();
        return;
    }

    if (phase == 1) {                           //  モード選択時
        if (k == 13) {
            mode = cursor;
            phase = 2;
        } else if (k == 38 && cursor > 0) {
            cursor -= 1;
        } else if (k == 40 && cursor < 1) {
            cursor += 1;
        }
        return;
    }

    if (phase == 2) {                           //  人数選択時
        if (k == 13) {
            phase = 3;
            playerNum = cursor + 1;
        } else if (k == 38 && cursor > 0) {
            cursor -= 1;
        } else if (k == 40 && cursor < 3) {
            cursor += 1;
        }
        return;
    }

    if (phase == 3) {                           //  プレイヤー名登録時
        if (k == 13) {
            INPUT.style.visibility = 'hidden';  //  INPUT非表示
            text = INPUT.value;
            cursor = 0;
            phase = 4;
        }
        return;
    }

    if (phase == 4) {                           //  プレイヤー名確認時
        if (k == 13) {
            if (cursor == 0) {
                phase = 5;
            } else {
                INPUT.value = '';
                text = '';
                phase = 3;
            }
        } else if (k == 38 && cursor > 0) {
            cursor -= 1;
        } else if (k == 40 && cursor < 1) {
            cursor += 1;
        }
        return;
    }

    if (phase == 5) {                           //  プレイヤーステータス決定時
        if (k == 13) {
            if (count < playerNum) {
                count += 1;
                INPUT.value = '';
                text = '';
                phase = 3;
                cancelAnimationFrame(callbackId);
                DrawSelect();
            } else {
                phase = 6
            }
        }
        return;
    }
}

//  キーアップのイベント
window.onkeyup = function (e) {
    gKey[e.keyCode] = 0;
}

//  ブラウザ起動のイベント
window.onload = function () {
    LoadImage();

    //  タイトル画像を読み込み終わった場合
    imgTitle.addEventListener('load', function () {
        ctx.drawImage(imgTitle, 0, 0, SCREEN_W, SCREEN_H);
        SpeechRec();
        DrawTitle();
    }, false);
}
