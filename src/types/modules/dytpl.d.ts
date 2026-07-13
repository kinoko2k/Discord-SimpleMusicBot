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

// This type declaration is just for building on Node.js v16.x
// @distube/ytpl has dropped its support for v16.x or lower.
// Building with Node.js v18+, the type definition packed in @distube/ytpl should take priority over below stub types.
// This file should be removed when dropping the Node.js v16 support.
declare module "@distube/ytpl" {
  namespace ytpl {
    interface result {
      id: string;
      url: string;
      title: string;
      visibility: "link only" | "everyone";
      description: string | null;
      total_items: number;
      views: string;
      last_updated: string;
      author: null | {
        id: string,
        name: string,
        avatar: string,
        user: string | null,
        channel_url: string,
        user_url: string | null,
      };
      items: {
        id: string,
        url: string,
        url_simple: string,
        title: string,
        thumbnail: string,
        duration: string | null,
        author: null | {
          name: string,
          ref: string,
        },
      }[];
    }
  }

  function ytpl(id: string, options?: any): Promise<ytpl.result>;

  export = ytpl;
}
