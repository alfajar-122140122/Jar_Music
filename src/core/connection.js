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
    });

    // Wait for connection to be ready
    await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
    
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
