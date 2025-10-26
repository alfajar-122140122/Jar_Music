import { SlashCommandBuilder } from 'discord.js';
import play from 'play-dl';
import { joinChannel, isConnected } from '../../core/connection.js';
import { getQueue } from '../../core/queue.js';
import { handlePlay } from '../../core/player.js';
import { createEmbed } from '../../utils/embed.js';
import { logger } from '../../utils/logger.js';

export default {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song from YouTube')
    .addStringOption(option =>
      option
        .setName('query')
        .setDescription('Song name or YouTube URL')
        .setRequired(true)
    ),
  
  async execute(interaction) {
    try {
      // Check if user is in a voice channel
      const voiceChannel = interaction.member.voice.channel;
      
      if (!voiceChannel) {
        const embed = createEmbed('error', '❌ Error', 'You need to be in a voice channel!');
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }
      
      // Reply immediately to prevent timeout
      await interaction.reply({ content: '🔍 Searching...', ephemeral: false });
      
      logger.info(`Processing play command for: ${interaction.options.getString('query')}`);
      
      // Join voice channel if not connected
      if (!isConnected(interaction.guildId)) {
        logger.info(`Joining voice channel: ${voiceChannel.name}`);
        await joinChannel(voiceChannel);
      }
      
      const query = interaction.options.getString('query');
      
      // Search for song
      let songInfo;
      
      logger.info(`Searching for: ${query}`);
      
      if (play.yt_validate(query) === 'video') {
        // Direct YouTube URL
        logger.info('Detected YouTube URL');
        songInfo = await play.video_info(query);
      } else {
        // Search by query
        logger.info('Searching YouTube by query');
        const searchResults = await play.search(query, { limit: 1 });
        
        if (searchResults.length === 0) {
          const embed = createEmbed('error', '❌ Error', 'No results found!');
          return interaction.editReply({ embeds: [embed] });
        }
        
        songInfo = searchResults[0];
      }
      
      // Create song object
      const song = {
        title: songInfo.title,
        url: songInfo.url,
        duration: formatDuration(songInfo.durationInSec),
        thumbnail: songInfo.thumbnails[0]?.url || null,
        requestedBy: interaction.user,
        channel: interaction.channel,
      };
      
      // Add to queue
      const queue = getQueue(interaction.guildId);
      queue.addSong(song);
      
      // If not playing, start playback
      if (!queue.playing) {
        await handlePlay(interaction.guildId, interaction);
      } else {
        // Send added to queue message
        const embed = createEmbed(
          'success',
          '✅ Added to Queue',
          `**[${song.title}](${song.url})**\n\nPosition in queue: **${queue.size()}**`
        );
        embed.setThumbnail(song.thumbnail);
        
        await interaction.editReply({ embeds: [embed] });
      }
      
    } catch (error) {
      logger.error('Play command error:', error);
      const embed = createEmbed('error', '❌ Error', `Failed to play song: ${error.message}`);
      
      try {
        if (interaction.replied) {
          await interaction.editReply({ content: '', embeds: [embed] });
        } else {
          await interaction.reply({ embeds: [embed], ephemeral: true });
        }
      } catch (replyError) {
        logger.error('Failed to send error message:', replyError);
      }
    }
  },
};

function formatDuration(seconds) {
  if (!seconds || seconds === 0) return 'Live';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}
