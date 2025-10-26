import { SlashCommandBuilder } from 'discord.js';
import { joinChannel, isConnected } from '../../core/connection.js';
import { createEmbed } from '../../utils/embed.js';

export default {
  data: new SlashCommandBuilder()
    .setName('join')
    .setDescription('Join your voice channel'),
  
  async execute(interaction) {
    // Check if user is in a voice channel
    const voiceChannel = interaction.member.voice.channel;
    
    if (!voiceChannel) {
      const embed = createEmbed('error', '❌ Error', 'You need to be in a voice channel!');
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    
    // Check if bot is already connected
    if (isConnected(interaction.guildId)) {
      const embed = createEmbed('warning', '⚠️ Warning', 'I am already in a voice channel!');
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    
    await interaction.reply({ content: '🔌 Connecting...', ephemeral: false });
    
    try {
      await joinChannel(voiceChannel);
      
      const embed = createEmbed(
        'success',
        '✅ Joined',
        `Connected to **${voiceChannel.name}**`
      );
      
      await interaction.editReply({ content: '', embeds: [embed] });
    } catch (error) {
      const embed = createEmbed('error', '❌ Error', 'Failed to join voice channel!');
      await interaction.editReply({ content: '', embeds: [embed] });
    }
  },
};
