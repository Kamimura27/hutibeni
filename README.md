# 音声認識 RPG

## 概要

音声認識 RPG”は音声認識を用いて、声で操作するロールプレイングゲームです。  
このゲームを遊ぶためのマニュアルとなっております。

## 環境構築

### ○Visual Studio Codeの導入
以下のリンク（https://visualstudio.microsoft.com/ja/ )に移動し、Visual Studio Codeのダウンロードにカーソルを合わせると、Windows、MacOS、Linuxの各OS版のインストーラがあるので、OSに対応しているインストーラをダウンロードしてください。  
![image](https://user-images.githubusercontent.com/55973528/100975259-125bee00-3581-11eb-8cf3-1b7310b2d63e.png)

ダウンロード完了後、VSCodeUserSetup....exeを開いて、VSCodeをインストールしてください。  
![image](https://user-images.githubusercontent.com/55973528/100975403-5222d580-3581-11eb-9089-86de7bb7d9b3.png)

インストール完了後、Visual Studio Codeを開いて、黄色の枠に囲っている拡張機能をクリックし、赤色の枠に「live server」と入力し、検索結果で表示されたLive Serverをクリックして、緑色の枠にあるインストールをクリックしてください。  
![image](https://user-images.githubusercontent.com/55973528/100975457-6666d280-3581-11eb-9131-c2d1287abf5c.png)

Live Severが無事にインストールできたら、ファイル→ユーザー設定→設定の順にクリックし、設定内にある拡張機能→LiveServer Configの順にクリックし、Settings:Custom Browserの「null」から「Chrome」に変更できたら以上となります。  
![image](https://user-images.githubusercontent.com/55973528/100975517-7ed6ed00-3581-11eb-91c3-bc65db2f8f6e.png)


### ○Google Chromeのインストール
このゲームに搭載している音声認識はChromeに対応しているため、Chromeをインストールする必要があります。(IE、Edge、FireFox等には未対応)以下のリンク(https://www.google.com/chrome/ )に移動し、”Chromeをダウンロード”をクリックしてください。  
![image](https://user-images.githubusercontent.com/55973528/100975566-944c1700-3581-11eb-862b-11a6a3710c4a.png)

ダウンロード後、ChromeSetup.exeを開き、インストールを行ってください。  
![image](https://user-images.githubusercontent.com/55973528/100975605-a3cb6000-3581-11eb-9ca0-785fb1973f9e.png)


無事にインストールをできたら、Chromeのインストールは終了となります。

##### ○音声認識RPGのダウンロード

以下のリンク（https://github.com/igakilab/hutibeni-OnseiRPG ）に移動し、緑色のCodeをクリックして、Download ZIPをクリックし、ダウンロードしてください。  
![image](https://user-images.githubusercontent.com/55973528/100975648-b80f5d00-3581-11eb-83f5-f955c80c295c.png)

ダウンロードしたZIPを展開（解凍）できたら、環境構築は終了となります。


#### 遊び方

Visual Studio Codeを開き、ファイルをクリックし、フォルダーを開く...をクリックし、先ほど展開したフォルダーを選択する。  
![image](https://user-images.githubusercontent.com/55973528/100975712-ca899680-3581-11eb-9e9f-344db2abf72b.png)

VSCodeの右下にあるGo Liveをクリックするとゲームが始まります。  
![image](https://user-images.githubusercontent.com/55973528/100975749-d9704900-3581-11eb-82f2-d867d2860e26.png)

Chromeが開き、音声認識RPGが始まったら、スペースキーを押すことで音声入力ができるようになります。
最初の音声入力はChromeからマイクの使用の確認が問われるので、許可を押すことで、今後の音声認識から確認が出なくなるようになります。  
![image](https://user-images.githubusercontent.com/55973528/100975794-e856fb80-3581-11eb-930e-bab4c821b55b.png)


左上に●RECと表示されている時が音声入力または認識中となっています。
表示が消え、もう一度音声認識を始める時はスペースキーを押してください。音声認識の結果を確認したい場合は、右クリックし、検証を選択し、Consoleをクリックすることで確認できます。 

![image](https://user-images.githubusercontent.com/55973528/100975828-f86edb00-3581-11eb-972c-4ca5bef7262a.png)


もし、音声認識できない状況になった場合には、↑、↓キー、Enterキーでゲームを進行しても大丈夫です。

### 〇音声認識できなくなったときの解決方法
・ブラウザがChrome以外の場合はChromeにしてください。

・検証を開いた後にできなくなった場合はゲーム画面をクリックしてください。

・Chromeの上のアドレスバーの横にあるiをクリックし、マイクが許可なっているかを確認してください。

### 〇複数人で遊ぶ場合

複数人で遊ぶ場合には、ZoomやDiscodeなどの画面共有可能なボイスチャットアプリを用いて遊んでください。遊ぶ際での事前設定として、サウンドの設定を開いて、「サウンドデバイスを管理する」をクリックする。
そして、入力デバイスにあるステレオミキサーを選択し、「有効にする」をクリックし、サウンドの設定に戻り、入力デバイスをステレオミキサーにすることで、友達の音声が入力できるようになります。
次のページに画像貼っているので、それらを確認しながら進めてください。  

![image](https://user-images.githubusercontent.com/55973528/100975888-0f153200-3582-11eb-9a3d-ccf006d32696.png)  
![image](https://user-images.githubusercontent.com/55973528/100975951-26541f80-3582-11eb-9579-683fc7eb9da1.png)

画面共有する際、画面全体ではなく、音声認識 RPGを開いている
ブラウザを共有してください。もし、Zoomで共有する方は「コンピュータ－の音声を共有」をチェックしてから画面の共有をしてください。

## ゲーム説明
・このゲームは、その名の通りプレイヤーの皆さんがキーワードを喋ることで操作を行う RPGです。タイトル画面から戦闘に至るまでいずれの場面でも音声認識による操作を用います。

・どういった言葉を喋らなければならないのかについては各場面で指示を用意しているので、RPG 未経験者でも気軽に楽しんでいただけます。

## 操作方法  
![image](https://user-images.githubusercontent.com/55973528/100975984-353ad200-3582-11eb-8417-298421d479ab.png)

## ゲームの流れ  
![image](https://user-images.githubusercontent.com/55973528/100976124-6c10e800-3582-11eb-90e2-a98bb4a40e14.png)

・左上の赤丸が表示されたら、音声入力受付の合図！

・戦闘は全部で３戦、最後のボスを倒すとゲームクリア！

・味方全員倒れたら、ゲームオーバー

・コンテニューで、再び挑戦だ！

・君たちの言葉で、魔法攻撃などでモンスターを倒そう！

・回復魔法で仲間に支援をしよう！

・３回連続で入力を失敗すると１回休み！

#### 誤認識してもめげずに挑戦しよう！


