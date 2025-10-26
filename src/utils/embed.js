import { EmbedBuilder } from 'discord.js';
import { config } from './config.js';

export function createEmbed(type = 'info', title, description) {
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(config.colors[type])
    .setTimestamp();
  
  return embed;
}

export function createMusicEmbed(song, user) {
  const embed = new EmbedBuilder()
    .setTitle('🎵 Now Playing')
    .setDescription(`**[${song.title}](${song.url})**`)
    .addFields(
      { name: '⏱️ Duration', value: song.duration || 'Live', inline: true },
      { name: '👤 Requested by', value: user.tag, inline: true }
    )
    .setThumbnail(song.thumbnail)
    .setColor(config.colors.primary)
    .setTimestamp();
  
  return embed;
}

export function createQueueEmbed(queue, guildName) {
  const current = queue.songs[0];
  const upcoming = queue.songs.slice(1, 11);
  
  let description = `**Now Playing:**\n🎵 [${current.title}](${current.url})\n\n`;
  
  if (upcoming.length > 0) {
    description += '**Up Next:**\n';
    upcoming.forEach((song, index) => {
      description += `${index + 1}. [${song.title}](${song.url})\n`;
    });
    
    if (queue.songs.length > 11) {
      description += `\n*...and ${queue.songs.length - 11} more*`;
    }
  }
  
  const embed = new EmbedBuilder()
    .setTitle(`📋 Queue for ${guildName}`)
    .setDescription(description)
    .addFields(
      { name: '📊 Total Songs', value: `${queue.songs.length}`, inline: true }
    )
    .setColor(config.colors.info)
    .setTimestamp();
  
  return embed;
}
