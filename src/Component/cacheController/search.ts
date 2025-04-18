/*
 * Copyright 2021-2025 mtripg6666tdr
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

import type dYtsr from "@distube/ytsr";
import type ytsr from "ytsr";

import { BaseController } from "./baseController";

export class SearchCacheController extends BaseController {
  override get cacheIdPrefix() {
    return "search";
  }

  add(keyword: string, result: ytsr.Video[] | dYtsr.Video[]) {
    if (this.parent.enablePersistent) {
      this.utils.addPersistentCache(this.createCacheId(keyword.toLowerCase()), result).catch(this.logger.error);
    }
  }

  has(keyword: string) {
    const id = this.createCacheId(keyword);
    const result = this.utils.existPersistentCache(id);
    this.logger.info(`Requested persistent cache ${result ? "" : "not "}found (id: ${id})`);
    return result;
  }

  get(keyword: string) {
    return this.utils.getPersistentCache(this.createCacheId(keyword)) as Promise<ytsr.Video[]>;
  }
}
