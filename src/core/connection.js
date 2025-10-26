import {
  joinVoiceChannel,
  getVoiceConnection,
  VoiceConnectionStatus,
  entersState,
} from '@discordjs/voice';
import { logger } from '../utils/logger.js';

export async function joinChannel(voiceChannel) {
  try {
    // Check if already connected
    const existingConnection = getVoiceConnection(voiceChannel.guild.id);
    if (existingConnection) {
      logger.info('Already connected, reusing connection');
      return existingConnection;
    }

    logger.info(`Attempting to join voice channel: ${voiceChannel.name}`);
    
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      selfDeaf: true,
      selfMute: false,
    });

    // Set up connection error handlers before waiting
    connection.on(VoiceConnectionStatus.Disconnected, async () => {
      logger.warn('Voice connection disconnected, attempting to reconnect...');
      try {
        await Promise.race([
          entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
          entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
        ]);
        logger.info('Reconnection successful');
      } catch (error) {
        logger.error('Reconnection failed, destroying connection');
        connection.destroy();
      }
    });

    connection.on(VoiceConnectionStatus.Destroyed, () => {
      logger.warn('Voice connection destroyed');
    });

    connection.on('error', (error) => {
      logger.error('Voice connection error:', error);
    });

    // Wait for connection with extended timeout
    logger.info('Waiting for voice connection to be ready...');
    
    try {
      await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
      logger.info(`Successfully joined voice channel: ${voiceChannel.name}`);
      return connection;
    } catch (error) {
      logger.error('Timeout waiting for ready state:', error);
      
      // Check current state
      logger.info(`Current connection state: ${connection.state.status}`);
      
      // If we're in Signalling or Connecting, give it more time
      if (connection.state.status === VoiceConnectionStatus.Signalling || 
          connection.state.status === VoiceConnectionStatus.Connecting) {
        logger.info('Still connecting, waiting additional time...');
        try {
          await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
          logger.info(`Successfully joined after extended wait: ${voiceChannel.name}`);
          return connection;
        } catch (extendedError) {
          connection.destroy();
          throw new Error('Failed to establish voice connection - timeout after extended wait');
        }
      }
      
      connection.destroy();
      throw new Error('Failed to establish voice connection - initial timeout');
    }
    
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
