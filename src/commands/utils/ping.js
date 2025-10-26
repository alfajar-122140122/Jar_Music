import { SlashCommandBuilder } from 'discord.js';
import { createEmbed } from '../../utils/embed.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check bot latency'),
  
  async execute(interaction) {
    const start = Date.now();
    await interaction.reply({ content: '🏓 Pinging...', ephemeral: false });
    
    const latency = Date.now() - start;
    const apiLatency = Math.round(interaction.client.ws.ping);
    
    const embed = createEmbed(
      'success',
      '🏓 Pong!',
      `**Bot Latency:** ${latency}ms\n**API Latency:** ${apiLatency}ms`
    );
    
    await interaction.editReply({ content: '', embeds: [embed] });
  },
};
