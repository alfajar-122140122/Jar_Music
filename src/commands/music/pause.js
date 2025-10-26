import { SlashCommandBuilder } from 'discord.js';
import { handlePause } from '../../core/player.js';
import { createEmbed } from '../../utils/embed.js';

export default {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pause the current song'),
  
  async execute(interaction) {
    // Check if user is in a voice channel
    const voiceChannel = interaction.member.voice.channel;
    
    if (!voiceChannel) {
      const embed = createEmbed('error', '❌ Error', 'You need to be in a voice channel!');
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    
    // Check if bot is in the same voice channel
    const botChannel = interaction.guild.members.me.voice.channel;
    
    if (!botChannel) {
      const embed = createEmbed('error', '❌ Error', 'I am not in a voice channel!');
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    
    if (voiceChannel.id !== botChannel.id) {
      const embed = createEmbed('error', '❌ Error', 'You need to be in the same voice channel!');
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    
    const result = handlePause(interaction.guildId);
    
    if (!result.success) {
      const embed = createEmbed('error', '❌ Error', result.message);
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    
    const embed = createEmbed('success', '⏸️ Paused', result.message);
    await interaction.reply({ embeds: [embed] });
  },
};
