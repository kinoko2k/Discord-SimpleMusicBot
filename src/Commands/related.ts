import * as discord from "discord.js";
import { CommandArgs, CommandInterface } from ".";
import { getColor } from "../Util/colorUtil";
import { log } from "../Util/util";

export default class Related implements CommandInterface {
  name = "related";
  alias = ["関連動画", "関連曲", "おすすめ", "オススメ", "related", "relatedsong", "r", "recommend"];
  description = "YouTubeから楽曲を再生終了時に、関連曲をキューに自動で追加する機能です";
  unlist = false;
  category = "playlist";
  async run(message:discord.Message, options:CommandArgs){
    options.updateBoundChannel(message);
    if(options.data[message.guild.id].AddRelative){
      options.data[message.guild.id].AddRelative = false;
      message.channel.send("❌関連曲自動再生をオフにしました").catch(e => log(e, "error"));
    }else{
      options.data[message.guild.id].AddRelative = true;
      const embed = new discord.MessageEmbed()
        .setTitle("⭕関連曲自動再生をオンにしました")
        .setDescription("YouTubeからの楽曲再生終了時に、関連曲をキューの末尾に自動追加する機能です。\r\n※YouTube以外のソースからの再生時、ループ有効時には追加されません")
        .setColor(getColor("RELATIVE_SETUP"))
      message.channel.send("", embed);
    }
  }
}