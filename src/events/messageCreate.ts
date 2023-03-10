/*
 * Copyright 2021-2023 mtripg6666tdr
 * 
 * This file is part of mtripg6666tdr/Discord-SimpleMusicBot. 
 * (npm package name: 'discord-music-bot' / repository url: <https://github.com/mtripg6666tdr/Discord-SimpleMusicBot> )
 * 
 * mtripg6666tdr/Discord-SimpleMusicBot is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by the Free Software Foundation, 
 * either version 3 of the License, or (at your option) any later version.
 *
 * mtripg6666tdr/Discord-SimpleMusicBot is distributed in the hope that it will be useful, 
 * but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with mtripg6666tdr/Discord-SimpleMusicBot. 
 * If not, see <https://www.gnu.org/licenses/>.
 */

import type { MusicBot } from "../bot";

import * as discord from "oceanic.js";

import { CommandManager } from "../Component/CommandManager";
import { CommandMessage } from "../Component/CommandMessage";
import { GuildDataContainerWithBgm } from "../Structure/GuildDataContainerWithBgm";
import { discordUtil, normalizeText } from "../Util";
import { useConfig } from "../config";
import { NotSendableMessage } from "../definition";

const config = useConfig();

export async function onMessageCreate(this: MusicBot, message: discord.Message){
  if(this.maintenance){
    if(!config.isBotAdmin(message.author.id)) return;
  }
  // botのメッセやdm、およびnewsは無視
  if(!this["_isReadyFinished"] || message.author.bot || !(message.channel instanceof discord.TextChannel)) return;
  if(this._rateLimitController.isRateLimited(message.member.id)) return;
  // データ初期化
  const server = this.initData(message.guildID, message.channel.id);
  // プレフィックスの更新
  server.updatePrefix(message as discord.Message<discord.TextChannel>);
  if(message.content === `<@${this._client.user.id}>`){
    // メンションならば
    await message.channel.createMessage({
      content: `コマンドの一覧は、\`/command\`で確認できます。\r\nメッセージでコマンドを送信する場合のプレフィックスは\`${server.prefix}\`です。`,
    })
      .catch(this.logger.error);
    return;
  }
  const prefix = server.prefix;
  const messageContent = normalizeText(message.content);
  if(messageContent.startsWith(prefix) && messageContent.length > prefix.length){
    // コマンドメッセージを作成
    const commandMessage = CommandMessage.createFromMessage(message as discord.Message<discord.TextChannel>, prefix.length);
    // コマンドを解決
    const command = CommandManager.instance.resolve(commandMessage.command);
    if(!command) return;
    if(
      // BGM構成が存在するサーバー
      server instanceof GuildDataContainerWithBgm
      && (
      // いまBGM再生中
        server.queue.isBGM
          && (
            // キューの編集を許可していない、またはBGM優先モード
            !server.bgmConfig.allowEditQueue || server.bgmConfig.mode === "prior"
          )
        // BGMが再生していなければ、BGMオンリーモードであれば
        || server.bgmConfig.mode === "only"
      )
      // かつBGM構成で制限があるときに実行できないコマンドならば
      && command.category !== "utility" && command.category !== "bot" && command.name !== "ボリューム"
    ){
      // 無視して返却
      return;
    }
    // 送信可能か確認
    if(!discordUtil.channels.checkSendable(message.channel, this._client.user.id)){
      try{
        await message.channel.createMessage({
          messageReference: {
            messageID: message.id,
          },
          content: NotSendableMessage,
          allowedMentions: {
            repliedUser: false,
          },
        });
      }
      catch{ /* empty */ }
      return;
    }
    // コマンドの処理
    await command.checkAndRun(commandMessage, this["createCommandRunnerArgs"](commandMessage.guild.id, commandMessage.options, commandMessage.rawOptions));
  }else if(server.searchPanel.has(message.member.id)){
    // searchコマンドのキャンセルを捕捉
    const panel = server.searchPanel.get(message.member.id);
    const content = normalizeText(message.content);
    if(message.content === "キャンセル" || message.content === "cancel"){
      panel.destroy();
    }
    // searchコマンドの選択を捕捉
    else if(content.match(/^([0-9]\s?)+$/)){
      // メッセージ送信者が検索者と一致するかを確認
      const nums = content.split(" ");
      await server.playFromSearchPanelOptions(nums, panel);
    }
  }else if(message.content === "キャンセル" || message.content === "cancel"){
    const result = server.cancelAll();
    if(!result) return;
    await message.channel.createMessage({
      messageReference: {
        messageID: message.id,
      },
      content: "処理中の処理をすべてキャンセルしています....",
    })
      .catch(this.logger.error);
  }
}