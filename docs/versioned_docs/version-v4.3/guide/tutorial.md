---
sidebar_position: 2
---
# チュートリアル
このチュートリアルでは、`Discord-SimpleMusicBot`をベースにした音楽ボットをサーバーに追加し、ボットで音楽を再生することを一通り行います。

:::note
`Discord-SimpleMusicBot`をベースにしていない音楽ボットに関しては、ここで紹介しているコマンドの多くが違う可能性があります。
:::

## 1. ボットをサーバーに追加する
まずは、音楽ボットをサーバーに追加しましょう。
追加するには、サーバーの管理権が必要です。自分のサーバーではない場合は、ボットの権限の付与を簡単にするためにも、サーバーの管理者の方に招待してもらうのがよいでしょう。
招待リンクにアクセスし、サーバーに追加します。

<img src="https://static-objects.usamyon.moe/dsmb/docs-assets/tutorial_step_1.png" alt="ボットの招待画面" width="50%" />

`サーバーにを選択`から、追加先のサーバーを選択し、[はい]をクリック/タップします。

:::note

上の画像は一例です。ボットの種類によって画面は異なります。

:::

<img src="https://static-objects.usamyon.moe/dsmb/docs-assets/tutorial_step_1_2.png" alt="ボットの権限画面" width="50%" />

「以下の権限を与えることを確認してください。」と表示されたら、なにもせずに[はい]を選択して、表示された操作を済ませます。

:::note

上の画像に表示されている権限が、本ボットに必要な権限です。それ以外の権限は必要ありません。

上の画像に表示されている権限のうち、表示されていないものがある場合は、ボットの管理者にお問い合わせの上、正しい招待リンクを発行してもらってください。

:::

Discordのサーバーで、メンバーの一覧に、追加したボットが表示されていればOKです。

## 2. 操作方法と使い方
### i. ボットの呼び出し方
まず、音楽を再生するには、まずユーザーがボイスチャンネルに参加します。  
ボイスチャンネルがない場合は新しく作成するか、権限がない場合は管理者の方に作成してもらいましょう。  
音楽を流したいボイスチャンネルが用意できたら、そこに参加します。そして、テキストチャットで`/join`と打ちます。

<img src="https://static-objects.usamyon.moe/dsmb/docs-assets/tutorial_step_2.png" width="50%" />

このようになればOKです。

### ii. 好きな音楽を再生してみる
それでは、さっそく好きな音楽を再生してみましょう。  
テキストチャットで、`/play`と入力して、そのあとに聴きたい曲名や歌手名などを入力します。  
そして、そのまま送信します。

![](https://static-objects.usamyon.moe/dsmb/docs-assets/tutorial_step_2_2.png)

すると再生が開始されます。

<img src="https://static-objects.usamyon.moe/dsmb/docs-assets/tutorial_step_2_3.png" width="70%" />

再生できましたか？  
このように、ボットの操作は基本的にテキストチャットで、コマンドを打って行います！

:::note
実は、`/join`コマンドを入力せずにいきなり`/play`コマンドを使用しても、ボットは自動的にボイスチャンネルに参加するので、
普段はいきなり`/play`を使って再生してもいいでしょう。
:::

### iii. 検索してから再生してみる
キーワードから一発で再生することもできますが、キーワードから検索して、その中から再生したいものを選んで再生することができます。
検索するには、テキストチャットで、`/search`と入力して送信します。

![](https://static-objects.usamyon.moe/dsmb/docs-assets/tutorial_step_2_4.png)

すると、検索結果が表示されます。

<img src="https://static-objects.usamyon.moe/dsmb/docs-assets/tutorial_step_2_5.png" width="50%" />

検索候補から、再生したいものを選び、下の選択欄から選択しましょう。

<p>
  <img src="https://static-objects.usamyon.moe/dsmb/docs-assets/tutorial_step_2_6.png" width="40%" />
  <span>&nbsp;</span>
  <img src="https://static-objects.usamyon.moe/dsmb/docs-assets/tutorial_step_2_7.png" width="40%" />
</p>

右側の画像のように、複数選択することもできます。

### iv. 検索してサムネイルを見ながら音楽を決める

ここで、検索結果が文章だけだと紛らわしくて、サムネイルを見たい、ということがあると思います。
そういう時には便利機能であるサムネイルコマンドを使用しましょう！
たとえば、`4.`の候補のサムネイルを見たければ、`/thumbnail`と入力して、番号をそのあとに入力します。

![](https://static-objects.usamyon.moe/dsmb/docs-assets/tutorial_step_2_8.png)

すると、次のようにサムネイルが表示されます。

<img src="https://static-objects.usamyon.moe/dsmb/docs-assets/tutorial_step_2_9.png" width="60%" />  

## 3. よく使うコマンド一覧
ボットを使う上で便利なコマンドをまとめておきます。これらは利用できるコマンドの一部ですので、完全な一覧はこのセクションのコマンド一覧をご覧になるか、`/command`コマンドを参照してください。

|コマンド名|せつめい|
|----|----|
|/join|ボイスチャンネルに参加する|
|/play|音楽を再生する。または、一時停止を解除する。|
|/pause|一時停止する|
|/disconnect|ボットを切断する|
|/skip|曲をスキップする|
|/loop|曲をループする|
|/looponce|今再生している曲が終わったら一度だけループする|
|/nowplaying|今再生している楽曲の情報を表示する|
|/volume|音量を5~200の間で調節する(通常100)|

## 4. 注意点

* 同じサーバー内の複数のボイスチャンネルで、同じ音楽ボットを同時に使うことはできません。ほかの音楽ボットを併用するなどして対処してください。
* 複数の人が同じボイスチャンネルに参加していると、その中のひとが勝手にスキップなどの操作をすることができないようになっています。
  * どうしてもコマンドが使えないときは、サーバーの管理者の方にお願いしてやってもらうか、`DJ`という名前のロールがついた人にお願いしましょう。
  * スキップ機能の場合、スキップ投票が開始されます。スキップに賛成する人は、賛成ボタンを押すことで賛同してください。この場合、ボイスチャンネルに参加している人の過半数が賛成すると、自動的にスキップされます。

:::info
長時間イヤホンを使用して音楽を聞き続けると、聴覚に障害が起きることがあります。

音楽ボットの使用時に限ったことではありませんが、
イヤホンを使用しているかどうかに関わらず、
健康に注意し、適度に休憩をとりながら、楽しんでいただければ幸いです。
:::

## 5. 最後に
ボットのチュートリアルは以上となります。  
万が一、基本的な使い方に不明な点があれば、お気軽にサポートまでお問い合わせください。

そして次のセクションからは、ここで書くことができなかった細かい機能やコマンドを一つ一つ説明していきます。珍しい機能や、便利な機能もありますので、興味があれば見てみてください。基本的な操作がまだ慣れていない方は、操作に慣れてきたら、もう一度ここに戻って見ていただければ幸いです。
