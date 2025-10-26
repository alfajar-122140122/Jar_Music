import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// Delete all guild commands
async function clearCommands() {
  try {
    console.log('🗑️  Clearing guild commands...');
    
    if (process.env.GUILD_ID) {
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: [] }
      );
      console.log('✅ Successfully cleared guild commands.');
    }
    
    console.log('🗑️  Clearing global commands...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: [] }
    );
    console.log('✅ Successfully cleared global commands.');
    
    console.log('✨ All commands cleared! Now run: npm run deploy');
  } catch (error) {
    console.error('❌ Error clearing commands:', error);
  }
}

clearCommands();
