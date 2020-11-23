const cvs = document.getElementById('cv');              //  キャンバスのID取得
const ctx = cvs.getContext('2d');                       //  2Dコンテキストの取得
const INPUT = document.getElementById('input');         //  名前入力用インプットのID取得
const INPUT2 = document.getElementById('input2');       //  コマンド入力用インプットのID取得
const script = document.createElement('script');        //  花火描画するjavascript用のスクリプト生成
const IMG = document.getElementById('image');
const REC = document.getElementById('rec');
const SCREEN_X = 1440;                                  //  キャンバスの幅
const SCREEN_Y = 900;                                   //  キャンバスの高さ
const TITLE = '音声認識RPG';                             //  タイトル名
const gKey = new Uint8Array(0x100);
//  キーバッファ

var text = '';                                          //  名前確保用のメッセージ
var name;
var msg_buff = '';                                      //  メッセージバッファ
script.src = "https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.1.9/p5.min.js";

//矢印の位置
var arrow_point = 0;
//矢印を表示座標
var arrow_x = 610;
var arrow_y = 610;
var arrow_py = 40;
var Font_X1 = 610;
var Font_X2 = 640;
var monster_posPX = 300;

var mode;                                               //  0:OITモード 1:無限モード
var playerNum = 0;                                      //  プレイヤー人数

//requestAnimationFrameで動作しているメソッドの管理
var callbackId;
var count;                                          //  プレイヤーナンバー
var setIV;
var scount;                                         //  ステージ数
var ecount;                                         //  エネミーナンバー
var s_num;
var miss;
var phase;
var dead_enemy;
var dead_player;
var judge;                                          // 0:勝利,1:敗北
var flag;                                           // 1:コマンドがある
let recognition;
let check = false;
var pal;
var palc;

let checkText = [
    ['スタート', '佐藤', '佐渡'],
    ['oit', '無限', 'ホワイティ', 'モード'],
    ['一人', '二人', '三人', '四人', '1人', '2人', '3人', '4人'],
    ['.'],
    ['はい', 'いいえ', '家', 'いえ', 'NO', 'no', 'No'],
    ['OK', 'Ok', 'ok'],
    [],
    ['はい', 'いいえ', '家', 'いえ', 'NO', 'no', 'No']
];

//  背景画像の場所を格納
var img = new Array("./image/battle.png", "./image/bg001.jpg", "./image/bg002.jpg",
    "./image/bg003.jpg", "./image/bg004.jpg", "./image/bg005.jpg", "./image/bg006.jpg");

//  表示する背景画像を格納
var bgimg = new Array();

//  キャラ画像の場所を格納
var charimg = new Array("./image/enemy001.png", "./image/enemy002.png", "./image/enemy003.png",
    "./image/enemy004.png", "./image/enemy005.png", "./image/enemy006.png", "./image/enemy007.png", "./image/enemy008.png",
    "./image/enemy009.png", "./image/enemy010.png", "./image/enemy011.png", "./image/enemy012.png", "./image/enemy013.png");

//  表示するキャラ画像を格納
var enemyimg = new Array();

//  プレイヤー情報
var player = [];

//  モンスター情報
var enemy = [
    { name: "", hp: 0, attack: 0 },
    { name: "サタン", hp: 666, attack: 50, effect: '23' },
    { name: "ワンコロ", hp: 130, attack: 16, effect: '21' },
    { name: "ランバー", hp: 190, attack: 20, effect: '10' },
    { name: "スライム", hp: 100, attack: 15, effect: '8' },
    { name: "ゾンビ", hp: 150, attack: 17, effect: '10' },
    { name: "ゴブリン", hp: 120, attack: 15, effect: '10' },
    { name: "リザード", hp: 170, attack: 19, effect: '20' },
    { name: "ドラゴン", hp: 330, attack: 35, effect: '0' },
    { name: "ケルベロス", hp: 297, attack: 30, effect: '22' },
    { name: "シープ", hp: 200, attack: 12, effect: '15' },
    { name: "ゴーレム", hp: 350, attack: 24, effect: '14' },
    { name: "スケルトン", hp: 160, attack: 18, effect: '20' }
];

//  ステージ情報
var stage = [
    [2, 2, 4, 6],
    [3, 9, 11],
    [5, 1]
]

var bgm = new Array("./bgm/bgm01.mp3", "./bgm/bgm02.mp3", "./bgm/bgm03.mp3", "./bgm/bgm04.mp3", "./bgm/bgm05.mp3",
    "./bgm/bgm06.mp3", "./bgm/bgm07.mp3", "./bgm/bgm08.mp3");

var music = new Array();

var se = new Array("./SE/fire.mp3", "./SE/flash.mp3", "./SE/explode.mp3", "./SE/freeze.mp3",
    "./SE/wind.mp3", "./SE/thunder.mp3", "./SE/dark.mp3", "./SE/death.mp3", "./SE/aqua.mp3",
    "./SE/meteo.mp3", "./SE/attack.mp3", "./SE/gigaslash.mp3", "./SE/gigaslash.mp3", "./SE/attack.mp3",
    "./SE/quake.mp3", "./SE/grandcross.mp3", "./SE/bigbang.mp3", "./SE/jump.mp3", "./SE/ankoku.mp3",
    "./SE/heal.mp3", "./SE/eattack.mp3", "./SE/bite.mp3", "./SE/scratch.mp3", "./SE/beam.mp3",
    "./SE/window.mp3", "./SE/decide.mp3", "./SE/error.mp3");

var sound = new Array();

var effect = new Array("./effect/fire.gif", "./effect/flash.gif", "./effect/explode.gif", "./effect/freeze.gif",
    "./effect/wind.gif", "./effect/thunder.gif", "./effect/dark.gif", "./effect/death.gif", "./effect/aqua.gif",
    "./effect/meteo.gif", "./effect/attack.gif", "./effect/gigaslash.gif", "./effect/gigaslash.gif", "./effect/attack.gif",
    "./effect/quake.gif", "./effect/grandcross.gif", "./effect/bigbang.gif", "./effect/jump.gif", "./effect/ankoku.gif",
    "./effect/heal.gif", "./effect/eattack.gif", "./effect/Bite.gif", "./effect/crow.gif", "./effect/boss.gif");

var Effect = new Array();


var stage_name = ["はじまりの森", " 堅牢の迷宮 ", " 最後の戦場 "];

var senemy = new Array();

var command = [
    { name: "を灼熱の炎が焦がす！", magni: 2.1, kind: 'attack' },
    { name: "をまばゆい光が襲った！", magni: 1.9, kind: 'attack' },
    { name: "は爆発にまきこまれた！", magni: 2.5, kind: 'attack' },
    { name: "は凍り付いた！", magni: 2.0, kind: 'attack' },
    { name: "を旋風が切り裂いた！", magni: 1.9, kind: 'attack' },
    { name: "を雷が貫いた！", magni: 2.2, kind: 'attack' },
    { name: "を暗闇が包み込んだ！", magni: 2.0, kind: 'attack' },
    { name: "を死の世界へ引きずり込む！", magni: 0.5, kind: 'attack' },
    { name: "は水に飲み込まれた！", magni: 1.8, kind: 'attack' },
    { name: "に隕石が降ってきた！", magni: 2.6, kind: 'attack' },
    { name: "にこうげきを繰り出した！", magni: 1.0, kind: 'attack' },
    { name: "にまばゆい斬撃を放った！", magni: 2.7, kind: 'attack' },
    { name: "に素早い斬撃を放った！", magni: 1.8, kind: 'attack' },
    { name: "に鋭い打撃を叩き込んだ！", magni: 1.7, kind: 'attack' },
    { name: "を地割れが飲み込んだ！", magni: 2.3, kind: 'attack' },
    { name: "を聖なる十字が浄化する！", magni: 2.7, kind: 'attack' },
    { name: "を強大なエネルギーが襲う！", magni: 2.6, kind: 'attack' },
    { name: "に天からの衝撃が走った！", magni: 2.0, kind: 'attack' },
    { name: "を闇の斬撃で切り裂いた！", magni: 1.9, kind: 'attack' },
    { name: "味方全員に癒しの光が降り注いだ！", magni: 84, kind: 'heal' }
];

var c_command = [
    ['ファイヤー', 'ファイアー', 'fire', 'メラ', '米良', 'ミラ', 'フレア', 'メラミ', 'メラゾーマ', 'メラガイアー', 'アギ', 'アギラオ', 'アギダイン', 'メルトン', 'ミルトン', 'ハイヤー', 'メラミン', 'あり', '秋', 'アニラオ', '南', '萩', 'FIRE BALL', 'ファイヤーショット', 'ファイアーショット', 'ファイアーエムブレム', 'スピットファイア', '火炎斬り', 'ひまほ', 'Fire Storm', 'パン屋'],
    ['フラッシュ', 'ギラ', '切ら', 'コウハ', '光波', 'ホーリー', '方位', 'ベギラマ', 'ベギラゴン', 'ギラグレイド', 'コウガ', 'コウガオン', '黄河', 'ラッシュ', 'ジゴフラッシュ', 'リラ', 'オーリー', 'えぎらごん', '甲賀', '効果音', 'キラ', '小顔', '光魔法'],
    ['イオ', 'イオラ', 'イオナズン', 'イオグランデ', 'いいよ', 'イオン', '伊予', 'エクスプロード', 'エクスプロージョン', 'メギド', 'メギドラ', 'メギドラオン', 'マダンテ', 'アルテマ', 'リオグランデ', 'メガンテ', '爆発魔法', '大爆発'],
    ['ヒャド', 'マヒャド', 'マヒャデドス', 'ヒャダイン', 'ヒャダルコ', 'CAD', 'フリーズ', 'ブリザド', 'ブリザード', 'アイス', 'ブフ', 'ルーフ', 'ブリザラ', 'ブリザガ', '絶対零度', '吹雪', '宿', 'キャノン', 'グフ', '夫婦', '絶対隷奴', 'マーシャドー', '流布', 'アイスボール', 'アイスショット', 'マヒャド斬り', '氷魔法', 'マハド', 'please'],
    ['バギ', 'バギマ', 'バギクロス', 'バギムーチョ', 'バギー', 'マギ', 'エアロ', 'エアロラ', 'エアロガ', 'ガル', 'ガルーラ', 'ガルダイン', 'トルネド', 'トルネード', 'ガール', 'gal', 'がる', 'バニー', 'やろうが', 'ウィンド', 'Window', '風邪魔法', 'ウィンドブラスト'],
    ['デイン', 'ライデイン', 'ギガデイン', 'ジゴデイン', 'ミナデイン', 'ジゴスパーク', 'サンダー', 'レイン', 'ディーン', 'ライディーン', 'ギガディーン', 'ジゴディーン', 'ミナディーン', 'ジオ', '塩', 'ジオダイン', 'ジオンガ', 'サンダガ', 'サンダラ', 'いなずま', 'ジオンが', 'サンドラ', 'さん平', 'イナズマ', 'でー', 'ジヨンが', 'サンダーボール', 'サンダーショット', 'サンダーストーム', 'トールハンマー', '雷魔法', 'サンダーボルト', 'D', 'イン', 'アンダー', 'アンバー'],
    ['ドルマ', 'ドクルマ', 'ドルマドン', 'ドルモーア', 'ダーク', 'バイオ', 'バイオガ', 'バイオラ', 'だるま', 'ど 車', 'バイオが', 'ヴァイオラ', 'ドルマン', 'ドラマ', '戸車', 'グラビデ', 'グラビラ', 'グラビガ', 'ベタン', 'メタン', 'ベタドロン', 'メタトロン', 'ベタロール', 'メタノール', '闇魔法', 'シャドウ', 'マーク', 'アーク', 'ワーク', 'ダークボール'],
    ['ザキ', 'ザラキ', 'ザラキーマ', 'デス', '滝', 'です', 'ムド', 'ムドオン', 'ハマ', 'ハマオン', 'ムード', 'ヌード', '浜', 'ニフラム', 'ジャッキ', 'うどん', 'Amazon', '雑記', '崎', 'ブドウ', 'ハマー', 'はなお', 'デジョン', 'テレポ', 'テレポート'],
    ['ウォーター', 'ウォタラ', 'ウォタガ', 'アクア', 'おたら', '小樽', 'お互い', 'ポタラ', '牡丹が', 'スコール', '水魔法', 'みずまほ'],
    ['コメット', 'メテオ', 'コメテオ', '天変地異', '止めてよ', 'を見てよ', 'コメント', '見てよ', '隕石', '隕石魔法'],
    ['攻撃', 'アタック', '戦う', '殴る', '蹴る', 'キック', 'パンチ', 'アイアンクロー', '平手打ち', 'ビンタ', '掌底'],
    ['ギガスラッシュ', 'ギガブレイク', '魔神斬り', 'ミラクルソード'],
    ['はやぶさ斬り', '五月雨斬り', '魔神剣', '虎牙破斬', 'メタル斬り', '居合切り'],
    ['正拳突き', 'とびひざげり', '爆裂拳', '回し蹴り'],
    ['クエイク', 'クイック', 'ジバリア', 'ジバリカ', 'ジバリーナ', 'ジバルンバ', 'quake', 'ウェイク', 'クリーク', '地震'],
    ['グランドクロス', 'クロスファイア'],
    ['ビッグバン', 'BIGBANG', 'アポカリプス', 'インディグネイション', 'メドローア', 'ブラックホール', 'supernova'],
    ['ジャンプ'],
    ['暗黒', 'バンコク'],
    ['回復', 'ホイミ', 'ベホイミ', 'ベホマラー', 'ベホイム', 'ベホマ', 'ベホマズン', 'ケアル', 'ケアルラ', 'ケアルガ', 'ディア', 'ディアラマ', 'ディアラハン', 'ヒール', 'リア', 'ラヒール', 'ハイヒール', 'キュア', 'ギャルが', 'ホイミン', 'シール', 'Dear', 'ビール', 'EU']
];


//  タイトル画面関連の処理
window.onload = () => {
    loadImage();
    loadBgm();
    initRPG();

    //  タイトル画像を読み込み完了した
    bgimg[bgimg.length - 1].addEventListener('load', function () {
        enemyimg[enemyimg.length - 1].addEventListener('load', function () {
            ctx.drawImage(bgimg[1], 0, 0, SCREEN_X, SCREEN_Y);
            drawTitle();
            drawSTART();

            music[0].play();
        });
    });

};

function TextCheck() {
    let ctext = "";
    let reg;
    let i = 0;

    if (phase != 6) {
        for (i; i < checkText[phase].length; i++) {
            ctext = checkText[phase][i];
            reg = new RegExp(ctext);
            check = reg.test(text);
            if (check) break;
        }

        if (check) {
            switch (phase) {
                case 0:
                    phase = 1;
                    drawMode();
                    break;

                case 1:
                    phase = 2;
                    mode = arrow_point;
                    cancelAnimationFrame(callbackId);
                    drawNum();
                    arrow_point = 0;
                    break;

                case 2:
                    phase = 3;
                    if (i >= 4) i -= 4;
                    playerNum = i + 1;
                    INPUT.style.visibility = "visible";
                    player.splice(playerNum, player.length - playerNum);
                    cancelAnimationFrame(callbackId);
                    drawChara();
                    break;

                case 3:
                    phase = 4;
                    text = INPUT.value;
                    INPUT.style.visibility = "hidden";
                    arrow_point = 0;
                    name = text.substr(0, 6);
                    NameCheck();
                    break;

                case 4:
                    if (i == 0) {
                        drawStatus();
                        phase = 5;
                    } else if (i != 0) {
                        phase = 3;
                        INPUT.style.visibility = "visible";
                        drawChara();
                    }
                    cancelAnimationFrame(callbackId);
                    break;

                case 5:
                    if (count < playerNum) {
                        phase = 3;
                        count++;
                        INPUT.style.visibility = "visible";
                        drawChara();
                    } else {
                        phase = 6;
                        initStage();
                        music[0].pause();
                        music[1].play();
                        drawBattle();
                    }
                    break;
                case 7:
                    if (i == 0) {
                        Retry();
                        phase = 6;
                    }
                    else if (i >= 1) {
                        Reset();
                        phase = 0;

                    }
                    break;
                case 8:
                    Reset();
                    phase = 0;
                    break;
                default:
                    check = false;
                    break;
            }
            arrow_point = 0;
            sound[24].play();
        } else {
            sound[26].play();
        }

    } else {
        INPUT2.style.visibility = 'hidden';
        if (judge == -1) {
            checkCommand();
        } else if (judge == 0) {
            if (scount < 2) {
                music[scount + 1].pause();
                scount++;
                music[scount + 1].play();
                initStage();
                drawBattle();
            } else if (mode == 0 && scount >= 2) {
                music[scount + 1].pause();
                music[5].play();
                drawGameClear();
                phase = 8;
            }
        } else if (judge == 1) {
            phase = 7;
            music[scount + 1].pause();
            music[4].play();
            drawGameOver();
        }
    }

    INPUT.value = '';
    INPUT2.value = '';
    text = '';
}

//  キーが押されたときの処理
window.onkeydown = function (e) {
    let K = e.keyCode;

    if (gKey[K] != 0) {
        return;
    }
    gKey[K] = 1;
    if (K == 32) {
        SpeechRec();
        return;
    }
    if (phase == 0 && K == 13) { // タイトル
        phase = 1;
        drawMode();
        return;
    }
    if (phase == 1) { // モード選択
        if (K == 13) {
            phase = 2;
            mode = arrow_point; // 0:OIT 1:無限
            cancelAnimationFrame(callbackId);
            drawNum();
            arrow_point = 0;
        }
        /* else if (K == 38 && arrow_point > 0) {
            arrow_point -= 1;
        } else if (K == 40 && arrow_point < 1) {
            arrow_point += 1;
        }*/
        return;
    }
    if (phase == 2) { // 人数選択
        if (K == 13) {
            phase = 3;
            INPUT.style.visibility = "visible";
            playerNum = arrow_point + 1;
            player.splice(playerNum, player.length - playerNum);
            cancelAnimationFrame(callbackId);
            drawChara();
        } else if (K == 38 && arrow_point > 0) {
            arrow_point -= 1;
        } else if (K == 40 && arrow_point < 3) {
            arrow_point += 1;
        }
        return;
    }
    if (phase == 3) { // プレイヤー名入力
        if (K == 13) {
            phase = 4;
            text = INPUT.value;
            name = text.substr(0, 6);                              //  入力した文字列を６文字にする
            INPUT.style.visibility = "hidden";
            arrow_point = 0;
            NameCheck();
        }
        return;
    }
    if (phase == 4) { // 名前確認
        if (K == 13) {
            if (arrow_point == 0) {
                drawStatus();
                phase = 5;
            } else {
                INPUT.value = "";
                text = "";
                phase = 3;
                INPUT.style.visibility = "visible";
                drawChara();
            }
            cancelAnimationFrame(callbackId);
        } else if (K == 38 && arrow_point > 0) {
            arrow_point -= 1;
        } else if (K == 40 && arrow_point < 1) {
            arrow_point += 1;
        }
        return;
    }
    if (phase == 5) { // ステータス表示
        if (K == 13) {
            if (count < playerNum) {
                phase = 3;
                count++;
                INPUT.value = "";
                text = "";
                INPUT.style.visibility = "visible";
                drawChara();
            } else {
                phase = 6;
                initStage();
                music[0].pause();
                music[1].play();
                drawBattle();
            }
        }
        return;
    }
    if (phase == 6) { // バトル
        if (K == 13) {
            INPUT2.style.visibility = 'hidden';
            if (judge == -1 && flag == 0) {
                text = INPUT2.value;
                checkCommand();
            } else if (judge == 0) {
                if (scount < 2) {
                    music[scount + 1].pause();
                    scount++;
                    music[scount + 1].play();
                    initStage();
                    drawBattle();
                } else if (mode == 0 && scount >= 2) {
                    music[scount + 1].pause();
                    music[5].play();
                    drawGameClear();
                    phase = 8;
                }
            } else if (judge == 1) {
                phase = 7;
                music[scount + 1].pause();
                music[4].play();
                drawGameOver();
            }
            text = "";
            INPUT2.value = "";
        }
        return;
    }
    if (phase == 7) { //gameover
        if (K == 13) {
            if (INPUT2.value == "はい") {
                Retry();
                phase = 6;
            }
            else if (INPUT2.value == "いいえ") {
                Reset();
                phase = 0;

            }
        }
        return;
    }
    if (phase == 8) { //gameclear
        if (K == 13) {
            Reset();
            phase = 0;
        }
        return;
    }

};

//  キーを離したときの処理
window.onkeyup = function (e) {
    gKey[e.keyCode] = 0;

}

function initRPG() {
    count = 1;
    scount = 0;
    ecount = 0;
    miss = 0;
    phase = 0;
    dead_enemy = 0;
    dead_player = 0;
    judge = -1;
    flag = 0;

    INPUT.value = "";
    INPUT2.value = "";
    text = "";

    player = [
        { name: "", MAXhp: 0, hp: 0, attack: 0, color: "white" },
        { name: "", MAXhp: 0, hp: 0, attack: 0, color: "white" },
        { name: "", MAXhp: 0, hp: 0, attack: 0, color: "white" },
        { name: "", MAXhp: 0, hp: 0, attack: 0, color: "white" }
    ];

    stage = [
        [2, 2, 4, 6],
        [3, 9, 11],
        [5, 1]
    ];
}

//  ~選択用ウィンドウの描画
function drawFrame() {
    ctx.fillStyle = "white";
    ctx.fillRect(580, 450, 300, 300);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;
    ctx.strokeRect(580, 450, 300, 300);
    ctx.font = 'bold 24pt PixelMplus12';
    ctx.fillStyle = 'black';
}

//タイトルの描画
function drawTitle() {
    ctx.font = 'bold 80pt PixelMplus12';
    ctx.fillStyle = '#bbb';
    ctx.fillText(TITLE, 406, 324);
    ctx.fillStyle = 'orange';
    ctx.fillText(TITLE, 400, 330);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.strokeText(TITLE, 400, 330);

};

//STARTの描画
function drawSTART() {
    ctx.font = 'bold 60pt PixelMplus12';
    ctx.fillStyle = 'orange';
    ctx.fillText('START', 590, 620);
}

//モード選択のウィンドウの描画
function drawMode() {
    drawFrame();
    ctx.font = 'bold 24pt PixelMplus12';
    ctx.fillStyle = 'black';
    ctx.fillText('あそぶモードを', Font_X1, 510);
    ctx.fillText('教えてね', Font_X1, 550);
    ctx.fillText('OITモード', Font_X2, 610);
    //ctx.fillText('ムゲンモード', Font_X2, 650);
    drawArrow();
    callbackId = requestAnimationFrame(drawMode);
}

//矢印の描画と操作
function drawArrow() {
    var a_y = arrow_y + arrow_py * arrow_point;
    ctx.font = 'bold 24pt PixelMplus12';
    ctx.fillStyle = 'black';
    ctx.fillText('>', arrow_x, a_y)
}

//人数選択のウィンドウの描画
function drawNum() {
    drawFrame();
    ctx.fillText('あそぶ人数を', Font_X1, 510);
    ctx.fillText('教えてね', Font_X1, 550);
    ctx.fillText('１人', Font_X2, 610);
    ctx.fillText('２人', Font_X2, 650);
    ctx.fillText('３人', Font_X2, 690);
    ctx.fillText('４人', Font_X2, 730);
    drawArrow();
    callbackId = requestAnimationFrame(drawNum);
}

//  キャラクター入力の描画
function drawChara() {
    drawFrame();
    ctx.fillText('プレイヤー' + count + 'の', Font_X1, 510);
    ctx.fillText('名前を教えてね', Font_X1, 550);
}

//  キャラクター決定の描画
function NameCheck() {
    drawFrame();
    ctx.fillText(name, Font_X1, 510);
    ctx.fillText('でいいのかな？', Font_X1, 550);
    ctx.fillText('はい', Font_X2, 610);
    ctx.fillText('いいえ', Font_X2, 650);
    drawArrow();
    callbackId = requestAnimationFrame(NameCheck);

}

//  ステータス決定（乱数）
function rand_Status() {
    player[count - 1].name = name;
    player[count - 1].hp = (Math.floor(Math.random() * 101) + 100 | 0);
    player[count - 1].MAXhp = player[count - 1].hp;
    player[count - 1].attack = (1 / player[count - 1].hp * 10000 | 0);
}

//  ステータス初期表示の描画
function drawStatus() {
    rand_Status();
    drawFrame();
    ctx.fillText(name + 'さん', Font_X1, 510);
    ctx.fillText('のステータスは', Font_X1, 550)
    ctx.fillText('HP:' + player[count - 1].hp, Font_X2, 590);
    ctx.fillText('攻撃力:' + player[count - 1].attack, Font_X2, 630);
    ctx.fillText('確認したら', Font_X1, 670);
    ctx.fillText('OKって言ってね', Font_X1, 710);
}

//  メッセージバッファの管理
function message(msg) {
    if (msg_buff == '') {
        msg_buff += msg + "\n";
        message_char();
    } else {
        msg_buff += msg + "\n";
    }
}

//  メッセージの表示処理
function message_char() {
    if (msg_buff == '') {
        //メッセージバッファに文字がなければ何の処理もしない
        return;
    }
    //メッセージバッファの先頭１文字を取得
    let c = msg_buff.slice(0, 1);
    if (c == "\n") {
        c = '<br>'; //改行の場合はタグへ変換
        var obj = document.getElementById('message_window');
        obj.scrollTop = obj.scrollHeight;
    }
    document.getElementById('message_window').innerHTML += c;
    //メッセージバッファから先頭１文字を削除
    msg_buff = msg_buff.slice(1);
    setTimeout('message_char()', 30);
}

//ステージの設定(背景と敵)
function initStage() {
    if (scount == 2) {
        for (let i = 0; i < playerNum; i++) {
            player[i].hp = player[i].MAXhp;
            player[i].color = "white";
        }
    }
    stage = [
        [2, 2, 4, 6],
        [3, 9, 11],
        [5, 1]
    ];

    enemy = [
        { name: "", hp: 0, attack: 0, good: 0, bad: 0 },
        { name: "サタン", hp: 666, attack: 50, effect: '23', good: 7, bad: 15 },
        { name: "ワンコロ", hp: 130, attack: 16, effect: '21', good: 2, bad: 11 },
        { name: "ランバー", hp: 190, attack: 20, effect: '10', good: 0, bad: 8 },
        { name: "スライム", hp: 100, attack: 15, effect: '8', good: 5, bad: 8 },
        { name: "ゾンビ", hp: 150, attack: 17, effect: '10', good: 15, bad: 6 },
        { name: "ゴブリン", hp: 120, attack: 15, effect: '10', good: 10, bad: 14 },
        { name: "リザード", hp: 170, attack: 19, effect: '20', good: 3, bad: 0 },
        { name: "ドラゴン", hp: 330, attack: 35, effect: '0', good: 9, bad: 4 },
        { name: "ケルベロス", hp: 297, attack: 30, effect: '22', good: 17, bad: 10 },
        { name: "シープ", hp: 200, attack: 12, effect: '15', good: 19, bad: 19 },
        { name: "ゴーレム", hp: 350, attack: 24, effect: '14', good: 8, bad: 14 },
        { name: "スケルトン", hp: 160, attack: 18, effect: '20', good: 15, bad: 6 }
    ];

    count = 0;
    ecount = 0;
    judge = -1;
    flag = 0;
    dead_enemy = 0;
    miss = 0;
    senemy.splice(0, 3);
    INPUT2.style.visibility = 'visible';
    for (let i = 1; i < stage[scount].length; i++) {
        senemy[i - 1] = enemy[stage[scount][i]];
    }
    drawMessage();
}

//  バトルの描画
function drawBattle() {
    ctx.drawImage(bgimg[0], 0, 0, SCREEN_X, SCREEN_Y);
    ctx.drawImage(bgimg[stage[scount][0]], 30, 24, 1025, 573);
    for (let i = 1; i < stage[scount].length; i++) {
        if (stage[scount][i]) {
            ctx.drawImage(enemyimg[stage[scount][i]], monster_posPX * (i - 1) + 150, 230, enemyimg[stage[scount][i]].width * 1.2, enemyimg[stage[scount][i]].height * 1.2);
        }
    }
    drawPlayer();
    drawStageName();
    if (dead_enemy == senemy.length) {
        message('戦いに勝利した!!!');
        judge = 0;
    }
    if (dead_player == player.length) {
        message("目の前がまっくらになった");
        judge = 1;
    }
}

//  ステージ名の描画
function drawStageName() {
    ctx.font = 'bold 30pt PixelMplus12';
    ctx.fillStyle = 'white';
    ctx.fillText(stage_name[scount], 1130, 140);
}

//  バトル用メッセージ
function drawMessage() {
    for (let j = 1; j < stage[scount].length; j++) {
        message(enemy[stage[scount][j]].name);
    }
    message('があらわれた！');
    message(player[count].name + "のターン");
}

//  プレイヤー情報の表示
function drawPlayer() {
    for (let i = 0; i < playerNum; i++) {
        let Font_X3 = 1100;
        let Font_X4 = 1140;
        let Font_Y = 320;
        let Font_py = 120;
        ctx.font = 'bold 24pt PixelMplus12';
        ctx.fillStyle = player[i].color;
        ctx.fillText(player[i].name, Font_X3, Font_Y + Font_py * i);
        ctx.fillText('HP      :  ' + player[i].hp, Font_X4, Font_Y + (Font_py * i) + 40);
        ctx.fillText('攻撃力:  ' + player[i].attack, Font_X4, Font_Y + (Font_py * i) + 80);
        if (i == 0) Font_py += 10;
    }
}

function checkCommand() {
    let ctext;

    //  コマンド比較
    for (let i in c_command) {
        for (let j in c_command[i]) {
            if (text == c_command[i][j]) {                   //  コマンド成功
                ctext = command[i];
                if (ctext.kind == 'attack') {
                    playerAttack(ctext, i);
                } else if (ctext.kind == 'heal') {
                    playerHeal(ctext, i);
                }
                flag = 1;
                miss = 0;
            }
        }
    }

    if (!flag) {                                    //  コマンド失敗

        message(player[count].name + 'は' + text + 'をはなった！');
        pal = (text.length + (Math.floor(Math.random() * 11) | 0)) % 8;
        if (text == 'パルプンテ') pal = 0;
        if (pal == 0) {
            miss = 0;
            flag = 1;
            palc = (Math.floor(Math.random() * 101) | 0) % 19;
            playerAttack(command[palc].name);
        } else {
            message('しかし何も起こらなかった！');
            miss++;
            if (miss >= 3) {
                message(player[count].name + "は疲れて動けなくなった！")
                miss = 0;
                flag = 1;
            } else {
                INPUT2.style.visibility = 'visible';
                return;
            }
        }
    }


    setTimeout(() => {
        if (judge < 0) {
            //  攻撃するプレイヤーの生死の確認
            for (count = count + 1; count < playerNum; count++) {
                if (player[count].color == 'white') break;
            }

            if (count >= playerNum && judge < 0) {
                for (ecount = 0; ecount < senemy.length; ecount++) {
                    if (senemy[ecount]) break;
                }
                flag = 2;
                setiv = setInterval(enemyAttack, 1500);
            }

            if (flag == 1) {
                INPUT2.style.visibility = "visible";
                message(player[count].name + "のターン");
                flag = 0;
            }
        }
    }, 1400);


}

function enemyAttack() {
    let num;
    INPUT2.style.visibility = "hidden";

    do {
        if (dead_player >= playerNum) break;
        num = (Math.floor(Math.random() * player.length) | 0);
    } while (player[num].hp <= 0);

    IMG.style.top = 70 + "px";
    IMG.style.left = 300 + "px";
    IMG.style.height = 500 + "px";
    IMG.src = effect[senemy[ecount].effect];
    let time = 500;
    if (scount == 2) {
        time = 2500;
        IMG.style.left = 200 + "px";
    }
    setTimeout(() => {
        IMG.src = '';
    }, time);

    if (senemy[ecount]) {
        player[num].hp -= senemy[ecount].attack;
        message(senemy[ecount].name + 'のこうげき');
        sound[senemy[ecount].effect].play();
        message(player[num].name + 'に' + senemy[ecount].attack + 'のダメージを与えた!');
        ctx.font = 'bold 24pt PixelMplus12';
        ctx.fillStyle = 'red';
        ctx.fillText(senemy[ecount].attack, 1335, 320 + (120 * num));
    }

    if (player[num].hp <= 0) {
        player[num].hp = 0;
        player[num].color = "red";
        dead_player++;
    }

    setTimeout(drawBattle, time + 300);
    for (ecount = ecount + 1; ecount < senemy.length; ecount++) {
        if (senemy[ecount]) break;
    }

    if (ecount >= senemy.length || dead_player >= playerNum) {
        clearInterval(setiv);
        INPUT2.style.visibility = "visible";
        for (count = 0; count < playerNum; count++) {
            if (player[count].color == 'white') {
                message(player[count].name + "のターン");
                break;
            }
        }
        flag = 0;
        return;
    }

}

//  エンター押下、チェックコマンド成功着火
function playerAttack(ctext, i) {
    let num;
    let critical = 0;
    ctx.font = 'bold 36pt PixelMplus12';
    ctx.fillStyle = 'red';
    let cnum = ((Math.floor(Math.random() * 61) | 0) - 30) / 100;
    let rnum = (Math.floor(Math.random() * 101) | 0);
    if (rnum % 10 == 0) {
        critical = 0.3;
        ctx.fillStyle = 'yellow';
    }
    //  プレイヤーの攻撃処理
    //  乱数でモンスターのタゲを決定する
    do {
        num = Math.floor(Math.random() * senemy.length) | 0;
    } while (!senemy[num]);

    let ex = 0;
    if (scount == 2) {
        ex += 0.8;
    }
    if (i == 16) {
        ex -= 1;
    }

    if (pal == 0) { i = palc; }
    if (senemy[num].good == i) cnum += 0.3;
    else if (senemy[num].bad == i) cnum -= 0.3;

    sound[i].play();
    IMG.style.top = 300 + "px";
    IMG.style.left = monster_posPX * (num + ex) + 150 + "px";
    IMG.style.height = 300 + "px";
    IMG.src = effect[i];

    setTimeout(() => {
        IMG.src = '';
        //  タゲったモンスターに攻撃
        if (pal == 0) {
            pal = 1;
            message('不思議な力がはたらいた!');
            senemy[num].hp -= (player[count].attack * (command[palc].magni + cnum + critical) | 0);
            message(senemy[num].name + command[palc].name);
            if (critical > 0) {
                message('クリティカルヒット！！！');
            }
            message(senemy[num].name + 'に' + (player[count].attack * (command[palc].magni + cnum + critical) | 0) + 'のダメージを与えた!');
            ctx.fillText((player[count].attack * (command[palc].magni + cnum + critical) | 0), monster_posPX * (num + 1), 230 + enemyimg[stage[scount][num + 1]].height / 3);
        } else {
            senemy[num].hp -= (player[count].attack * (ctext.magni + cnum + critical) | 0);
            message(senemy[num].name + ctext.name);
            if (critical > 0) {
                message('クリティカルヒット！！！');
            }
            message(senemy[num].name + 'に' + (player[count].attack * (ctext.magni + cnum + critical) | 0) + 'のダメージを与えた!');
            ctx.fillText((player[count].attack * (ctext.magni + cnum + critical) | 0), monster_posPX * (num + ex + 1), 230 + enemyimg[stage[scount][num + 1]].height / 3);
        }
        //  タゲったモンスターを倒した場合
        if (senemy[num].hp <= 0) {
            //  モンスター関連の配列の要素を削除
            delete senemy[num];
            delete stage[scount][num + 1];
            dead_enemy++;
        }

        //  バトル画面更新
        setTimeout(drawBattle, 300);
    }, 1000);
}

function playerHeal(ctext) {

    IMG.style.top = 30 + "px";
    IMG.style.left = 300 + "px";
    IMG.style.height = 500 + "px";
    IMG.src = effect[19];
    sound[19].play();
    setTimeout(() => {
        IMG.src = '';
        for (let i = 0; i < playerNum; i++) {
            if (player[i].hp <= 0) {
                player[i].color = 'white';
                dead_player--;
            }
            player[i].hp += ctext.magni / playerNum;
            if(player[i].hp > player[i].MAXhp) player[i].hp = player[i].MAXhp;
            ctx.font = 'bold 24pt PixelMplus12';
            ctx.fillStyle = 'green';
            ctx.fillText((ctext.magni / playerNum), 1335, 320 + (120 * i));
        }
        message(ctext.name);
        message('プレイヤー全員のHPが' + (ctext.magni / playerNum) + ' 回復した!')

        setTimeout(drawBattle, 300);
    }, 1000);

}

function clearMessage(params) {
    for (let i = 0; i < 8; i++) {
        message("");
    }
}

function drawGameOver() {
    INPUT2.style.visibility = 'visible';
    clearMessage();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, SCREEN_X, SCREEN_Y);
    ctx.font = 'bold 200pt PixelMplus12';
    ctx.fillStyle = 'red';
    ctx.fillText("GAME OVER", 130, 300);
    message("コンティニューしますか？");
    message(" はい");
    message(" いいえ");
    message("を入力して下さい");

}

function drawGameClear() {
    clearMessage();
    ctx.clearRect(0, 0, SCREEN_X, SCREEN_Y);
    ctx.font = 'bold 200pt PixelMplus12';
    ctx.fillStyle = 'Blue';
    ctx.fillText("Clear!!", 300, 300);
    ctx.font = 'bold 60pt PixelMplus12';
    ctx.fillStyle = 'White';
    ctx.fillText("Congratulations!!", 420, 650);
    document.body.appendChild(script);
}

function Retry() {
    INPUT2.value = "";
    clearMessage();
    for (let i = 0; i < playerNum; i++) {
        player[i].hp = player[i].MAXhp;
        player[i].color = "white";
    }
    dead_player = 0;
    music[4].pause();
    music[scount + 1].play();
    initStage();
    drawBattle();
}

function Reset() {
    INPUT2.value = "";
    clearMessage();
    ctx.drawImage(bgimg[1], 0, 0, SCREEN_X, SCREEN_Y);
    INPUT2.style.visibility = "hidden";
    initRPG();
    music[4].pause();
    music[5].pause();
    music[0].play();
    drawTitle();
    drawSTART();
}

var ngword = ["んこ", "ェラ", "睾丸"]

function SpeechRec() {
    let c = 0;
    SpeechRecognition = webkitSpeechRecognition || SpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'ja';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = function (e) {
        let ng = false;
        for (let i = 0; i < ngword.length; i++) {
            let reg = new RegExp(ngword[i]);
            ng = reg.test(e.results[e.resultIndex][0].transcript);
            if (ng) break;
        }

        if (!ng) {
            if (e.results[e.resultIndex].isFinal) {
                text = e.results[e.resultIndex][0].transcript;
                text = text.trim();
                console.log(`音声最終決定: ${text}`);
                if (text.length <= 10) {
                    TextCheck();
                }

            } else {
                if (phase <= 5) {
                    INPUT.value = e.results[e.resultIndex][0].transcript;
                } else {
                    INPUT2.value = e.results[e.resultIndex][0].transcript;
                }
                console.log(`途中結果: ${e.results[e.resultIndex][0].transcript}`);
            }
        }
    };
    recognition.onstart = function () {
        if (scount == 2) REC.style.color = '#0090A8';
        else REC.style.color = 'red';
        REC.style.visibility = 'visible';
    }
    recognition.onend = function () {
        REC.style.visibility = 'hidden';
    }


    recognition.start();
}

//  表示する画像を格納する処理
function loadImage() {
    for (let i = 0; i < img.length; i++) {
        bgimg[i] = new Image();     //  この変数は画像関連の処理に取り扱う
        bgimg[i].src = img[i];      //  画像を読み込ませる
    }
    for (let j = 0; j < charimg.length; j++) {
        enemyimg[j] = new Image();     //  この変数は画像関連の処理に取り扱う
        enemyimg[j].src = charimg[j];      //  画像を読み込ませる
    }
    for (let k = 0; k < effect.length; k++) {
        Effect[k] = new Image();
        Effect[k].src = effect[k];
    }
}

function loadBgm() {
    for (let i = 0; i < bgm.length; i++) {
        music[i] = new Audio();
        music[i].src = bgm[i];
        music[i].volume = 0.1;
        music[i].loop = true;
    }
    for (let j = 0; j < se.length; j++) {
        sound[j] = new Audio();
        sound[j].src = se[j];
        sound[j].volume = 0.5;
    }
}