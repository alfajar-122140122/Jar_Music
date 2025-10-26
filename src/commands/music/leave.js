import { SlashCommandBuilder } from 'discord.js';
import { leaveChannel, isConnected } from '../../core/connection.js';
import { deleteQueue } from '../../core/queue.js';
import { deletePlayer } from '../../core/player.js';
import { createEmbed } from '../../utils/embed.js';

export default {
  data: new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Leave the voice channel'),
  
  async execute(interaction) {
    // Check if bot is in a voice channel
    if (!isConnected(interaction.guildId)) {
      const embed = createEmbed('error', '❌ Error', 'I am not in a voice channel!');
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    
    // Clean up
    deletePlayer(interaction.guildId);
    deleteQueue(interaction.guildId);
    leaveChannel(interaction.guildId);
    
    const embed = createEmbed('success', '👋 Left', 'Disconnected from voice channel.');
    await interaction.reply({ embeds: [embed] });
  },
};
