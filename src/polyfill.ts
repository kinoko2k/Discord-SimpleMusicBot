/*
 * Copyright 2021-2024 mtripg6666tdr
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

import { getLogger } from "./logger";

const logger = getLogger("Polyfill");

if(typeof global.fetch === "undefined"){
  logger.warn("Native fetch function is not defined.");
  logger.warn("Installing a fetch polyfill.");
  logger.warn("We strongly recommend you upgrading Node.js to v18 or higher.");

  global.fetch = require("undici").fetch;
}

if(typeof global.structuredClone === "undefined"){
  logger.warn("Native structuredClone function is not defined.");
  logger.warn("Installing a structuredClone polyfill.");
  logger.warn("We strongly recommend you upgrading Node.js to v18 or higher.");

  global.structuredClone = function structuredClone<T>(value: T){
    return JSON.parse(JSON.stringify(value));
  };
}
