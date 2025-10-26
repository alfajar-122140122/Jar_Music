import { SlashCommandBuilder } from 'discord.js';
import { handleQueue } from '../../core/player.js';
import { createEmbed, createQueueEmbed } from '../../utils/embed.js';

export default {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Show the current queue'),
  
  async execute(interaction) {
    const result = handleQueue(interaction.guildId);
    
    if (!result.success) {
      const embed = createEmbed('error', '❌ Error', result.message);
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    
    const embed = createQueueEmbed(result.queue, interaction.guild.name);
    await interaction.reply({ embeds: [embed] });
  },
};
