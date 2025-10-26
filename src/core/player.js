import {
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  entersState,
} from '@discordjs/voice';
import play from 'play-dl';
import { getQueue, deleteQueue } from './queue.js';
import { getConnection } from './connection.js';
import { logger } from '../utils/logger.js';
import { createMusicEmbed } from '../utils/embed.js';

const players = new Map();

export function getPlayer(guildId) {
  if (!players.has(guildId)) {
    const player = createAudioPlayer();
    players.set(guildId, player);
    
    // Handle player events
    player.on(AudioPlayerStatus.Idle, () => {
      handleIdle(guildId);
    });
    
    player.on('error', (error) => {
      logger.error(`Audio player error in guild ${guildId}:`, error);
      handleIdle(guildId);
    });
  }
  
  return players.get(guildId);
}

export function deletePlayer(guildId) {
  const player = players.get(guildId);
  if (player) {
    player.stop();
    players.delete(guildId);
  }
}

async function handleIdle(guildId) {
  const queue = getQueue(guildId);
  
  if (!queue) return;
  
  // Remove finished song
  queue.skip();
  
  // Play next song if available
  if (!queue.isEmpty()) {
    await handlePlay(guildId);
  } else {
    // Queue is empty, reset state
    queue.playing = false;
    logger.info(`Queue finished for guild: ${guildId}`);
  }
}

export async function handlePlay(guildId, interaction = null) {
  const queue = getQueue(guildId);
  const connection = getConnection(guildId);
  
  if (!queue || queue.isEmpty()) {
    if (interaction) {
      await interaction.followUp({ content: '❌ No songs in queue!', ephemeral: true });
    }
    return;
  }
  
  if (!connection) {
    if (interaction) {
      await interaction.followUp({ content: '❌ Bot is not in a voice channel!', ephemeral: true });
    }
    return;
  }
  
  const song = queue.getCurrentSong();
  const player = getPlayer(guildId);
  
  try {
    // Make sure connection is ready
    await entersState(connection, VoiceConnectionStatus.Ready, 20_000);
    
    // Get audio stream
    const stream = await play.stream(song.url);
    const resource = createAudioResource(stream.stream, {
      inputType: stream.type,
    });
    
    // Play the audio
    player.play(resource);
    connection.subscribe(player);
    
    queue.playing = true;
    queue.paused = false;
    queue.player = player;
    queue.connection = connection;
    
    logger.info(`Now playing: ${song.title} in guild: ${guildId}`);
    
    // Send now playing embed
    if (interaction) {
      const embed = createMusicEmbed(song, song.requestedBy);
      await interaction.followUp({ embeds: [embed] });
    } else if (song.channel) {
      const embed = createMusicEmbed(song, song.requestedBy);
      await song.channel.send({ embeds: [embed] });
    }
    
  } catch (error) {
    logger.error(`Error playing song in guild ${guildId}:`, error);
    
    if (interaction) {
      await interaction.followUp({ content: '❌ Failed to play song. Skipping...', ephemeral: true });
    }
    
    // Skip to next song on error
    handleIdle(guildId);
  }
}

export async function handleSkip(guildId) {
  const queue = getQueue(guildId);
  const player = getPlayer(guildId);
  
  if (!queue || !queue.playing) {
    return { success: false, message: 'Nothing is playing!' };
  }
  
  const skippedSong = queue.getCurrentSong();
  
  // Stop current song (this will trigger handleIdle)
  player.stop();
  
  return { 
    success: true, 
    message: `Skipped: **${skippedSong.title}**`,
    hasNext: !queue.isEmpty()
  };
}

export function handleQueue(guildId) {
  const queue = getQueue(guildId);
  
  if (!queue || queue.isEmpty()) {
    return { success: false, message: 'Queue is empty!' };
  }
  
  return { success: true, queue };
}

export function handleStop(guildId) {
  const queue = getQueue(guildId);
  const player = getPlayer(guildId);
  
  if (!queue || !queue.playing) {
    return { success: false, message: 'Nothing is playing!' };
  }
  
  player.stop();
  queue.clear();
  deletePlayer(guildId);
  
  logger.info(`Stopped playback in guild: ${guildId}`);
  
  return { success: true, message: 'Stopped playback and cleared queue.' };
}

export function handlePause(guildId) {
  const queue = getQueue(guildId);
  const player = getPlayer(guildId);
  
  if (!queue || !queue.playing) {
    return { success: false, message: 'Nothing is playing!' };
  }
  
  if (queue.paused) {
    return { success: false, message: 'Already paused!' };
  }
  
  player.pause();
  queue.paused = true;
  
  logger.info(`Paused playback in guild: ${guildId}`);
  
  return { success: true, message: `Paused: **${queue.getCurrentSong().title}**` };
}

export function handleResume(guildId) {
  const queue = getQueue(guildId);
  const player = getPlayer(guildId);
  
  if (!queue || !queue.playing) {
    return { success: false, message: 'Nothing is playing!' };
  }
  
  if (!queue.paused) {
    return { success: false, message: 'Not paused!' };
  }
  
  player.unpause();
  queue.paused = false;
  
  logger.info(`Resumed playback in guild: ${guildId}`);
  
  return { success: true, message: `Resumed: **${queue.getCurrentSong().title}**` };
}
