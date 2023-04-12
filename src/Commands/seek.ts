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

import type { CommandArgs } from ".";
import type { CommandMessage } from "../Component/commandResolver/CommandMessage";
import type { i18n } from "i18next";

import { BaseCommand } from ".";

export default class Seek extends BaseCommand {
  constructor(){
    super({
      alias: ["seek"],
      unlist: false,
      category: "player",
      argument: [{
        type: "string",
        name: "keyword",
        required: true,
      }],
      requiredPermissionsOr: ["admin", "dj", "onlyListener"],
      shouldDefer: false,
      examples: true,
      usage: true,
    });
  }

  async run(message: CommandMessage, context: CommandArgs, t: i18n["t"]){
    context.server.updateBoundChannel(message);
    const server = context.server;

    // そもそも再生状態ではない場合
    if(!server.player.isPlaying || server.player.preparing){
      await message.reply(t("notPlaying")).catch(this.logger.error);
      return;
    }else if(server.player.currentAudioInfo.lengthSeconds === 0 || server.player.currentAudioInfo.isUnseekable()){
      await message.reply(`:warning:${t("commands:seek.unseekable")}`).catch(this.logger.error);
      return;
    }

    // 引数から時間を算出
    const time = (function(rawTime){
      if(rawTime.match(/^(\d+:)*\d+$/)){
        return rawTime.split(":").map(d => Number(d))
          .reduce((prev, current) => prev * 60 + current);
      }else{
        return NaN;
      }
    }(context.rawArgs));

    if(time > server.player.currentAudioInfo.lengthSeconds || isNaN(time)){
      await message.reply(`:warning:${t("commands:seek.invalidTime")}`).catch(this.logger.error);
      return;
    }

    try{
      const response = await message.reply(`:rocket:${t("commands:seek.seeking")}...`);
      await server.player.stop({ wait: true });
      await server.player.play(time);
      await response.edit(`:white_check_mark:${t("commands:seek.success")}`).catch(this.logger.error);
    }
    catch(e){
      this.logger.error(e);
      await message.channel.createMessage({
        content: `:astonished:${t("commands:seek.failed")}`,
      }).catch(this.logger.error);
    }
  }
}
