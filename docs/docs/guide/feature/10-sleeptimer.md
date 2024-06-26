# スリープタイマー機能
(v4.3.0で追加)

事前に設定しておくことで、一定時間経過した後、自動的にボットをボイスチャンネルから退出させることができます。

時間設定は、秒単位で直接指定できるほか、現在再生中の曲が終了した時点に設定することもできます。

## 使用方法
### スリープタイマーを設定する
[`スリープタイマー`コマンド](../commands/sleeptimer.md)を使用して、設定することができます。

* 1分23秒後に終了するよう設定する場合、以下のようにコマンドを送信します。
  ```
  スリープタイマー 1:23
  ```
* 1時間23分45秒後に終了するように設定する場合、以下のようにコマンドを送信します。
  ```
  スリープタイマー 1:23:45
  ```
* 現在再生中の曲が終了した際に設定する場合、以下のようにコマンドを送信します。
  ```
  スリープタイマー $
  ```

指定された時点になると、ボットは自動的にボイスチャンネルから切断します。この際、キュー内のアイテムは保持されたままになります。

### スリープタイマーを解除する
スリープタイマーを解除するには、何も引数を付与せずに、スリープタイマーコマンドを送信してください。
