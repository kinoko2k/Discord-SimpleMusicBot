import type {
  DiscordGatewayAdapterCreator,
  DiscordGatewayAdapterImplementerMethods,
  DiscordGatewayAdapterLibraryMethods,
} from "@discordjs/voice";
import type { Guild as OceanicGuild } from "oceanic.js";

export function createOceanicVoiceAdapter(guild: OceanicGuild): DiscordGatewayAdapterCreator {
  return (methods: DiscordGatewayAdapterLibraryMethods): DiscordGatewayAdapterImplementerMethods => {
    const client = guild.client;
    const guildId = guild.id;

    const onPacket = (packet: any) => {
      if (packet.op !== 0) return;
      if (packet.t === "VOICE_SERVER_UPDATE" && packet.d?.guild_id === guildId) {
        methods.onVoiceServerUpdate(packet.d);
      } else if (packet.t === "VOICE_STATE_UPDATE" && packet.d?.guild_id === guildId && packet.d?.user_id === client.user.id) {
        methods.onVoiceStateUpdate(packet.d);
      }
    };

    client.on("packet", onPacket);

    return {
      sendPayload(payload: any): boolean {
        const shard = guild.shard;
        if (!shard) return false;
        shard.send(payload.op, payload.d);
        return true;
      },
      destroy(): void {
        client.off("packet", onPacket);
      },
    };
  };
}
