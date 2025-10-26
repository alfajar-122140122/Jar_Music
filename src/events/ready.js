import { Events, ActivityType } from 'discord.js';
import { logger } from '../utils/logger.js';

export default {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    logger.info(`✅ Logged in as ${client.user.tag}`);
    logger.info(`🎵 JarMusic is ready to play!`);
    logger.info(`📊 Serving ${client.guilds.cache.size} guild(s)`);
    
    // Set bot activity
    client.user.setActivity('music 🎵', { type: ActivityType.Playing });
  },
};
