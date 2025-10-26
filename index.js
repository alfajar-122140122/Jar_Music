import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdirSync } from 'fs';
import dotenv from 'dotenv';
import { logger } from './src/utils/logger.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
  ],
  rest: { timeout: 60000 },
});

// Initialize commands collection
client.commands = new Collection();

// Load commands
async function loadCommands() {
  const commandFolders = ['music', 'utils'];
  
  for (const folder of commandFolders) {
    const commandsPath = join(__dirname, 'src', 'commands', folder);
    const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
      const filePath = join(commandsPath, file);
      const command = await import(`file://${filePath}`);
      
      if (command.default && 'data' in command.default && 'execute' in command.default) {
        client.commands.set(command.default.data.name, command.default);
        logger.info(`✅ Loaded command: ${command.default.data.name}`);
      } else {
        logger.warn(`⚠️ Command at ${filePath} is missing required "data" or "execute" property.`);
      }
    }
  }
}

// Load events
async function loadEvents() {
  const eventsPath = join(__dirname, 'src', 'events');
  const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.js'));
  
  for (const file of eventFiles) {
    const filePath = join(eventsPath, file);
    const event = await import(`file://${filePath}`);
    
    if (event.default && event.default.name) {
      if (event.default.once) {
        client.once(event.default.name, (...args) => event.default.execute(...args));
      } else {
        client.on(event.default.name, (...args) => event.default.execute(...args));
      }
      logger.info(`✅ Loaded event: ${event.default.name}`);
    }
  }
}

// Initialize bot
async function init() {
  try {
    await loadCommands();
    await loadEvents();
    await client.login(process.env.DISCORD_TOKEN);
  } catch (error) {
    logger.error('Failed to initialize bot:', error);
    process.exit(1);
  }
}

init();
