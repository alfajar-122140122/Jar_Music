import { REST, Routes } from 'discord.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdirSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const commands = [];

// Load all commands
async function loadCommands() {
  const commandFolders = ['music', 'utils'];
  
  for (const folder of commandFolders) {
    const commandsPath = join(__dirname, 'src', 'commands', folder);
    const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
      const filePath = join(commandsPath, file);
      const command = await import(`file://${filePath}`);
      
      if (command.default && 'data' in command.default) {
        commands.push(command.default.data.toJSON());
        console.log(`✅ Loaded command: ${command.default.data.name}`);
      }
    }
  }
}

// Deploy commands
async function deployCommands() {
  try {
    await loadCommands();
    
    const rest = new REST().setToken(process.env.DISCORD_TOKEN);
    
    console.log(`🚀 Started refreshing ${commands.length} application (/) commands.`);
    
    // Deploy to guild (faster for development)
    const data = await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands },
    );
    
    console.log(`✅ Successfully reloaded ${data.length} application (/) commands.`);
    
    // Uncomment below to deploy globally (takes up to 1 hour)
    // const data = await rest.put(
    //   Routes.applicationCommands(process.env.CLIENT_ID),
    //   { body: commands },
    // );
    
  } catch (error) {
    console.error('❌ Error deploying commands:', error);
  }
}

deployCommands();
