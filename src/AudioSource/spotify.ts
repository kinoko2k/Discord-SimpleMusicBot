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

import type { StreamInfo } from "./audiosource";
import type { exportableCustom } from "./custom";
import type { EmbedField } from "oceanic.js";
import type { Track } from "spotify-url-info";
import type ytsr from "ytsr";

import candyget from "candyget";

import { AudioSource } from "./audiosource";
import { searchYouTube } from "./youtube/spawner";
import { attemptFetchForStrategies } from "./youtube/strategies";
import { DefaultAudioThumbnailURL } from "../definition";

const spotifyUrlInfo = (() => {
  try{
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    return require("spotify-url-info") as typeof import("spotify-url-info");
  }
  catch{
    return null;
  }
})();

const client = spotifyUrlInfo?.((url, opts) => candyget(url, "string", opts).then(res => ({ text: () => res.body })));

export class Spotify extends AudioSource<string> {
  protected artist = "";
  protected referenceUrl: string = null;

  constructor(){
    super("spotify");
  }

  override async init(url: string, prefetched: exportableSpotify): Promise<Spotify>{
    if(!Spotify.validateTrackUrl(url)) throw new Error("Invalid url");
    if(prefetched){
      this.url = prefetched.url;
      this.lengthSeconds = prefetched.length;
      this.title = prefetched.title;
      this.artist = prefetched.artist;
      this.referenceUrl = prefetched.referenceUrl;
      this.thumbnail = prefetched.thumbnail || this.thumbnail;
    }else{
      this.url = url;
      const track = await client.getData(url) as Track;
      this.lengthSeconds = Math.floor(track.duration / 1000);
      this.title = track.name;
      this.artist = track.artists.map(artist => artist.name).join(", ");
      this.thumbnail = track.coverArt.sources[0]?.url || DefaultAudioThumbnailURL;
    }
    return this;
  }

  override async fetch(forceUrl?: boolean): Promise<StreamInfo>{
    if(!this.referenceUrl){
      // construct search keyword
      // eslint-disable-next-line newline-per-chained-call
      const keyword = `${this.title} ${this.artist.split(",").map(artist => artist.trim()).join(" ")}`;

      // search youtube
      this.logger.debug(`Searching the keyword: ${`${this.title} ${this.artist.split(",").map(artist => artist.trim())}`}`);
      const searchResult = await searchYouTube(keyword);

      // extract videos that seem to be ok
      this.logger.debug("Extracting the valid item...");
      const items = searchResult.items.filter(({ type }) => type === "video") as ytsr.Video[];
      const target = this.extractBestItem(items);

      if(!target) throw new Error("Not Found");

      // store the result
      this.referenceUrl = target.url;
    }

    // fetch the video
    const { result } = await attemptFetchForStrategies(this.referenceUrl, forceUrl);

    this.title = result.info.title;
    this.lengthSeconds = result.info.length;
    this.thumbnail = result.info.thumbnail;
    return result.stream;
  }

  protected extractBestItem(items: ytsr.Video[]){
    this.logger.debug("result", items);
    const normalize = (text: string) => {
      return text.toLowerCase()
        .replace(/’/g, "'")
        .replace(/\(.+?\)/g, "")
        .replace(/（.+?）/g, "")
        .replace(/【.+?】/g, "")
        // eslint-disable-next-line no-irregular-whitespace
        .replace(/　/g, " ")
        .replace(/-/g, "")
        .trim();
    };
    const includes = (text1: string, text2: string) => {
      text1 = normalize(text1);
      return normalize(text2)
        .split(" ")
        .every(p => text1.includes(p))
      ;
    };
    const validate = (item: ytsr.Video) => {
      return (
        // 関連のないタイトルを除外
        includes(item.title, this.title.replace(/feat\.\s?.+?(\s|$)/, "").toLowerCase())
        || includes(this.title.replace(/feat\.\s?.+?(\s|$)/, "").toLowerCase(), item.title.toLowerCase())
      )
      // カバー曲を除外
      && !includes(item.title.toLowerCase(), "cover")
      && !includes(item.title, "カバー")
      && !includes(item.title, "歌ってみた")
      && !includes(item.title, "弾いてみた")
      && !includes(item.title.toLowerCase(), "#shorts")
      && (this.title.toLowerCase().includes("remix") || !includes(item.title.toLowerCase(), "remix"));
    };
    const validItems = items.filter(validate);
    this.logger.debug("valid", validItems);
    if(validItems.length === 0) return items[0];
    // official channel
    let filtered = validItems.filter(item => item.author.ownerBadges.length > 0 || item.author.verified || item.author.name.endsWith("Topic") || item.author.name.endsWith("トピック"));
    this.logger.debug("official ch", filtered);
    if(filtered[0]) return filtered[0];
    // official item
    filtered = validItems.filter(item => includes(item.title, "official") || includes(item.title, "公式"));
    this.logger.debug("official item", filtered);
    if(filtered[0]) return filtered[0];
    // pv /mv
    filtered = validItems.filter(item => includes(item.title, "pv") || includes(item.title, "mv"));
    this.logger.debug("PV/MV", filtered);
    if(filtered[0]) return filtered[0];
    // no live
    filtered = validItems.filter(item => !includes(item.title, "live") && !includes(item.title, "ライブ"));
    this.logger.debug("no live", filtered);
    if(filtered[0]) return filtered[0];
    // other
    if(validItems[0]) return validItems[0];
    return items[0];
  }

  override exportData(): exportableSpotify{
    return {
      url: this.url,
      title: this.title,
      length: this.lengthSeconds,
      artist: this.artist,
      thumbnail: this.thumbnail,
      referenceUrl: this.referenceUrl,
    };
  }

  override npAdditional(): string{
    return "";
  }

  override toField(): EmbedField[]{
    return [];
  }

  override disableCache() {
    this.referenceUrl = null;
  }

  static validateTrackUrl(url: string){
    return !!url.match(/^https?:\/\/open\.spotify\.com\/track\/([a-zA-Z0-9]+)(\?.*)?$/);
  }

  static validatePlaylistUrl(url: string){
    return !!url.match(/^https?:\/\/open\.spotify\.com\/(playlist|album)\/([a-zA-Z0-9]+)(\?.*)?$/);
  }

  static getTrackUrl(uri: string){
    return `https://open.spotify.com/track/${uri.replace(/spotify:track:/, "")}`;
  }

  static getPlaylistUrl(uri: string, type: "playlist"|"album"){
    return `https://open.spotify.com/${type}/${uri.replace(/spotify:(playlist|album):/, "")}`;
  }

  static get client(){
    return client;
  }

  static get available(){
    return !!client;
  }
}

export type exportableSpotify = exportableCustom & {
  artist: string,
  referenceUrl: string,
  thumbnail: string,
};
