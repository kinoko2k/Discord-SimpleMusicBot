---
sidebar_position: 2
---
# 動作環境
本ボットの安定した動作に必要な環境については以下の表を参考にしてください。

なお、以下の表はあくまで開発者の経験からの目安であり、推奨環境を満たしていなくても、ボットが正常に動作する可能性は十分にあります。ご自分の環境でも使えるかを確認したい場合には、実際にホストして試すことをお勧めします。

||最低動作確認環境|最小推奨環境|推奨環境|
|:----:|:----:|:----:|:----:|
|CPU|1コアのCPU|2コアのCPU|3コア以上の高速なCPU|
|物理メモリ|1GB|1GB|4GB以上|
|ディスク|-|1GB以上|8GB以上|
|ネットワーク|-|-|上り/下りともに約30Mbps以上|

* ボット自体が2スレッドで動作し、また、FFmpegなどの外部ソフトを使用することがあることを考え、3コア以上を推奨しています。
* メモリが少ない環境では、仮想メモリ(swap memory)を多めに設定することをお勧めします。
* ディスクは読み込み/書き込み権限ともに必要です。
* クローンしてご使用で、ディスクの容量を節約したい場合は、`docs`フォルダーを削除していただき、トランスパイルの後に、以下のコマンドを実行することで、実行に不必要な依存関係を削除することができます。(削除しても、更新時には再インストールが必要となります。)
  ```sh
  npm prune --omit=dev
  ```
* ボットがホストされている地域によって音飛びが発生することがあります。その場合、ボイスチャンネルの地域設定を見直していただくと改善することがあります。
