import {
  joinVoiceChannel,
  getVoiceConnection,
  VoiceConnectionStatus,
  entersState,
} from '@discordjs/voice';
import { logger } from '../utils/logger.js';

export async function joinChannel(voiceChannel) {
  try {
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      selfDeaf: true,
      selfMute: false,
    });

    // Set up connection error handlers
    connection.on(VoiceConnectionStatus.Disconnected, async () => {
      try {
        await Promise.race([
          entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
          entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
        ]);
      } catch (error) {
        connection.destroy();
      }
    });

    // Wait for connection to be ready with longer timeout for cloud hosting
    try {
      await entersState(connection, VoiceConnectionStatus.Ready, 60_000);
    } catch (error) {
      connection.destroy();
      throw new Error('Failed to establish voice connection within 60 seconds');
    }
    
    logger.info(`Joined voice channel: ${voiceChannel.name} in guild: ${voiceChannel.guild.name}`);
    
    return connection;
  } catch (error) {
    logger.error('Failed to join voice channel:', error);
    throw error;
  }
}

export function leaveChannel(guildId) {
  const connection = getVoiceConnection(guildId);
  
  if (connection) {
    connection.destroy();
    logger.info(`Left voice channel in guild: ${guildId}`);
    return true;
  }
  
  return false;
}

export function getConnection(guildId) {
  return getVoiceConnection(guildId);
}

export function isConnected(guildId) {
  const connection = getVoiceConnection(guildId);
  return connection !== undefined;
}
