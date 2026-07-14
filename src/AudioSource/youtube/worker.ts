/*
 * Copyright 2021-2026 mtripg6666tdr
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

import type { WithId, SpawnerGetInfoMessage, SpawnerJobMessage, SpawnerSearchMessage, WorkerMessage, SpawnerUpdateConfigMessage } from "./spawner";

import "../../polyfill";

import { parentPort } from "worker_threads";

import ytsr from "ytsr";

import { YouTube } from ".";
import { updateStrategyConfiguration } from "./strategies";
import { requireIfAny, stringifyObject } from "../../Util";
import { getConfig } from "../../config";
import { getTrustedSession } from "./session";

const dYtsr = requireIfAny("@distube/ytsr") as typeof import("@distube/ytsr");

if (!parentPort) {
  throw new Error("This file should be run in worker thread.");
}

const config = getConfig();
const searchOptions = {
  limit: 12,
  gl: config.country,
  hl: config.defaultLanguage,
};

parentPort.unref();
parentPort.on("message", onMessage);

function postMessage(message: WorkerMessage | WithId<WorkerMessage>) {
  parentPort!.postMessage(message);
}

function getInfo({ id, url, prefetched, forceCache }: WithId<SpawnerGetInfoMessage>) {
  const youtube = new YouTube();
  youtube.init(url, prefetched, forceCache)
    .then(() => {
      const data = Object.assign({}, youtube);
      // @ts-expect-error
      delete data["logger"];
      if (data["cache"]?.data.type === "youtubei") {
        data["cache"] = null;
      }
      postMessage({
        type: "initOk",
        data,
        id,
      });
    })
    .catch(er => {
      postMessage({
        type: "error",
        data: stringifyObject(er),
        id,
      });
    });
}

let innertubeClient: InstanceType<typeof import("youtubei.js", { with: { "resolution-mode": "import" } }).Innertube> | null = null;

async function getInnertubeClient() {
  if (innertubeClient) return innertubeClient;
  const mod = await import("youtubei.js");
  const trustedSession = await getTrustedSession();
  innertubeClient = await mod.Innertube.create({
    lang: config.defaultLanguage,
    location: config.country || config.defaultLanguage,
    visitor_data: trustedSession.visitor_data,
    po_token: trustedSession.potoken,
  });
  return innertubeClient;
}

async function searchWithYoutubei(keyword: string) {
  const innertube = await getInnertubeClient();
  const searchResult = await innertube.search(keyword, { type: "video" });
  const videos = (searchResult.videos || []).slice(0, searchOptions.limit).map((video: any) => {
    const title = video.title?.toString() || video.title?.text || "";
    const id = video.id || video.video_id || "";
    if (!id) return null;

    const url = `https://www.youtube.com/watch?v=${id}`;
    let duration = "0:00";
    if (typeof video.duration === "object" && video.duration && "text" in video.duration) {
      duration = video.duration.text || duration;
    } else if (typeof video.duration === "string") {
      duration = video.duration;
    } else if (video.duration) {
      duration = video.duration.toString() || duration;
    }

    const thumbnails: { url: string, width: number, height: number }[] = [];
    if (Array.isArray(video.thumbnails)) {
      for (const t of video.thumbnails) {
        if (t?.url) thumbnails.push({ url: t.url, width: t.width || 0, height: t.height || 0 });
      }
    }
    const bestThumbnail = video.best_thumbnail ? {
      url: video.best_thumbnail.url,
      width: video.best_thumbnail.width || 0,
      height: video.best_thumbnail.height || 0,
    } : (thumbnails[0] || { url: "", width: 0, height: 0 });

    if (!thumbnails.length && bestThumbnail.url) {
      thumbnails.push(bestThumbnail);
    }

    const authorName = video.author?.name?.toString() || video.author?.name || "";
    const authorId = video.author?.id || "";
    const authorUrl = video.author?.url || (authorId ? `https://www.youtube.com/channel/${authorId}` : "");
    const authorAvatar = video.author?.best_thumbnail ? {
      url: video.author.best_thumbnail.url,
      width: video.author.best_thumbnail.width || 0,
      height: video.author.best_thumbnail.height || 0,
    } : null;

    const ownerBadges: string[] = [];
    if (Array.isArray(video.badges)) {
      for (const b of video.badges) {
        ownerBadges.push(b?.toString() || "");
      }
    }

    let views = 0;
    if (typeof video.views === "number") {
      views = video.views;
    } else if (video.view_count) {
      const vStr = video.view_count.toString().replace(/[^0-9]/g, "");
      views = Number(vStr) || 0;
    } else if (video.views) {
      const vStr = video.views.toString().replace(/[^0-9]/g, "");
      views = Number(vStr) || 0;
    }

    return {
      type: "video" as const,
      title,
      name: title,
      id,
      url,
      bestThumbnail,
      thumbnails,
      thumbnail: bestThumbnail.url,
      isUpcoming: Boolean(video.is_upcoming),
      isLive: Boolean(video.is_live),
      author: {
        name: authorName,
        channelID: authorId,
        url: authorUrl,
        bestAvatar: authorAvatar,
        avatars: authorAvatar ? [authorAvatar] : [],
        ownerBadges,
        verified: Boolean(video.author?.is_verified),
      },
      views,
      duration,
      description: video.description?.toString() || null,
    };
  }).filter(Boolean);

  return {
    items: videos,
    results: videos.length,
  };
}

function search({ id, keyword }: WithId<SpawnerSearchMessage>) {
  searchWithYoutubei(keyword)
    // @ts-ignore
    .then(result => {
      postMessage({
        type: "searchOk",
        data: result as any,
        id,
      });
    })
    .catch(err => {
      console.error("[youtubei search failed, fallbacking to dYtsr/ytsr]", err);

      if (dYtsr) {
        dYtsr(keyword, searchOptions)
          // @ts-ignore
          .then(result => {
            postMessage({
              type: "searchOk",
              data: result,
              id,
            });
          })
          // @ts-ignore
          .catch(err2 => {
            console.error(err2);

            return ytsr(keyword, searchOptions);
          })
          // @ts-ignore
          .catch(err2 => {
            postMessage({
              type: "error",
              data: stringifyObject(err2),
              id,
            });
          });

        return;
      }

      ytsr(keyword, searchOptions)
        .then(result => {
          postMessage({
            type: "searchOk",
            data: result,
            id,
          });
        })
        .catch(err2 => {
          postMessage({
            type: "error",
            data: stringifyObject(err2),
            id,
          });
        });
    });
}

function updateConfig({ config: newConfig }: WithId<SpawnerUpdateConfigMessage>) {
  updateStrategyConfiguration(newConfig);
}

function onMessage(message: WithId<SpawnerJobMessage>) {
  if (!message) {
    return;
  }

  switch (message.type) {
    case "init":
      getInfo(message);
      break;
    case "search":
      search(message);
      break;
    case "updateConfig":
      updateConfig(message);
      break;
  }
}
