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

import type { MusicBot } from "../bot";
import type { AutocompleteInteraction } from "oceanic.js";

import { CommandManager } from "../Component/commandManager";

export async function handleAutoCompleteInteraction(
  this: MusicBot,
  interaction: AutocompleteInteraction,
) {
  const option = interaction.data.options.getFocused();
  if (!option) {
    return;
  }

  const targetCommand = CommandManager.instance.resolve(interaction.data.name);
  const possibleOptions = targetCommand?.handleAutoComplete(
    option.name,
    option.value,
    interaction.data.options.raw
      .filter(opt => opt.name !== option.name && "value" in opt) as { name: string, value: string | number }[],
  ).slice(0, 25);

  if (!possibleOptions) {
    return;
  }

  await interaction.result(
    possibleOptions.map(name => ({
      name: name.toString(),
      value: name.toString(),
    })),
  ).catch(this.logger.error);
}
