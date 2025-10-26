# 🎵 JarMusic - Discord Music Bot

JarMusic adalah Discord Music Bot yang sederhana, modular, dan mudah dikembangkan. Dibangun menggunakan Node.js, discord.js v14, dan play-dl untuk streaming musik dari YouTube.

## ✨ Fitur

- 🎵 Memutar musik dari YouTube (URL atau search query)
- 📋 Sistem queue per server
- ⏯️ Kontrol playback lengkap (play, pause, resume, skip, stop)
- 📊 Menampilkan queue dengan embed yang rapi
- 🎯 Slash commands (bukan prefix)
- 🔄 Auto-skip ketika lagu selesai
- 🌐 Multi-server support
- 📦 Struktur modular dan scalable

## 🛠️ Teknologi

- **discord.js v14** - Library Discord API
- **@discordjs/voice** - Voice connection handler
- **play-dl** - YouTube audio streaming
- **Node.js** - Runtime environment
- **dotenv** - Environment variable management

## 📋 Requirements

- Node.js v16.9.0 atau lebih tinggi
- Discord Bot Token
- FFmpeg (untuk audio streaming)

## 🚀 Instalasi

### 1. Clone atau Download Project

```bash
cd JarMusic
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Buat file `.env` di root folder dan isi dengan:

```env
DISCORD_TOKEN=your_discord_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_guild_id_here
```

**Cara mendapatkan token dan ID:**
- Buat bot di [Discord Developer Portal](https://discord.com/developers/applications)
- Copy **Bot Token** dari halaman Bot
- Copy **Application ID** sebagai `CLIENT_ID`
- Copy **Server ID** Discord Anda sebagai `GUILD_ID` (klik kanan server > Copy Server ID)

### 4. Install FFmpeg

**Windows:**
- Download dari [ffmpeg.org](https://ffmpeg.org/download.html)
- Extract dan tambahkan ke PATH

**Linux:**
```bash
sudo apt install ffmpeg
```

**macOS:**
```bash
brew install ffmpeg
```

### 5. Deploy Slash Commands

```bash
npm run deploy
```

### 6. Jalankan Bot

```bash
npm start
```

## ☁️ Deploy ke Hosting Gratis

Jika bot tidak berfungsi di PC lokal (clock sync issues), deploy ke cloud hosting:

### **Replit (RECOMMENDED - Paling Mudah)**
1. Buka [Replit.com](https://replit.com)
2. Create New Repl → Upload folder project
3. Tambahkan Secrets (Environment Variables)
4. Run `npm install` → `npm run deploy` → `npm start`
5. Bot online 24/7!

### **Railway.app**
1. Push project ke GitHub
2. Deploy dari [Railway.app](https://railway.app)
3. Tambahkan environment variables
4. Auto-deploy!

### **Render.com**
1. Push project ke GitHub
2. Deploy dari [Render.com](https://render.com)
3. Tambahkan environment variables
4. Deploy!

📖 **[Lihat Panduan Lengkap Deploy](DEPLOY.md)**

---

## 🎮 Commands

| Command | Deskripsi |
|---------|-----------|
| `/join` | Bot join ke voice channel Anda |
| `/leave` | Bot keluar dari voice channel |
| `/play <query>` | Memutar lagu dari YouTube (URL atau nama lagu) |
| `/pause` | Pause lagu yang sedang diputar |
| `/resume` | Resume lagu yang di-pause |
| `/skip` | Skip ke lagu berikutnya |
| `/stop` | Stop playback dan clear queue |
| `/queue` | Tampilkan daftar lagu dalam queue |
| `/ping` | Cek latency bot |

## 📁 Struktur Project

```
JarMusic/
│
├── .env                      # Environment variables
├── package.json              # Dependencies
├── deploy-commands.js        # Deploy slash commands
├── index.js                  # Entry point
│
├── src/
│   ├── commands/            # Slash commands
│   │   ├── music/           # Music commands
│   │   │   ├── join.js
│   │   │   ├── leave.js
│   │   │   ├── play.js
│   │   │   ├── pause.js
│   │   │   ├── resume.js
│   │   │   ├── skip.js
│   │   │   ├── queue.js
│   │   │   └── stop.js
│   │   └── utils/           # Utility commands
│   │       └── ping.js
│   │
│   ├── core/                # Core functionality
│   │   ├── queue.js         # Queue management
│   │   ├── player.js        # Audio player
│   │   └── connection.js    # Voice connection
│   │
│   ├── events/              # Discord events
│   │   ├── ready.js
│   │   └── interactionCreate.js
│   │
│   └── utils/               # Utilities
│       ├── config.js        # Configuration
│       ├── embed.js         # Embed helpers
│       └── logger.js        # Logging
│
└── README.md
```

## 🔧 Konfigurasi Bot Permissions

Bot memerlukan permissions berikut:
- ✅ Send Messages
- ✅ Embed Links
- ✅ Connect
- ✅ Speak
- ✅ Use Voice Activity

**Bot Invite URL:**
```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=36700160&scope=bot%20applications.commands
```

Ganti `YOUR_CLIENT_ID` dengan Client ID bot Anda.

## 📝 Cara Menambahkan Command Baru

1. Buat file baru di `src/commands/music/` atau `src/commands/utils/`
2. Export default object dengan struktur:

```javascript
import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('commandname')
    .setDescription('Command description'),
  
  async execute(interaction) {
    // Command logic here
  },
};
```

3. Deploy ulang commands dengan `npm run deploy`
4. Restart bot

## 🐛 Troubleshooting

### Bot tidak merespons slash commands
- Pastikan sudah menjalankan `npm run deploy`
- Restart bot dan refresh Discord
- Periksa bot permissions

### Audio tidak terputar
- Pastikan FFmpeg sudah terinstall
- Cek bot permissions (Connect & Speak)
- Periksa logs untuk error details

### "Cannot find module" error
- Jalankan `npm install` untuk install semua dependencies
- Pastikan menggunakan Node.js v16.9.0+

### Voice connection timeout di hosting (Railway/Render/Replit)

**Masalah:** Bot timeout saat join voice channel

**Penyebab:**
- Missing system dependencies (ffmpeg, libsodium, opus)
- Docker/container tidak punya audio libraries

**Solusi:**

#### Untuk Railway:
1. Gunakan `nixpacks.toml` yang sudah disediakan
2. Atau tambahkan di **Settings** → **Environment**:
   ```
   NIXPACKS_PKGS=nodejs-20_x ffmpeg libsodium opus
   ```

#### Untuk Render:
1. Gunakan `Dockerfile` yang sudah disediakan
2. Atau tambahkan di **Build Command**:
   ```
   apt-get update && apt-get install -y ffmpeg libsodium-dev libopus-dev && npm install
   ```

#### Untuk Replit:
1. Buat file `.replit` dengan config yang benar (sudah disediakan)
2. Install dependencies:
   ```bash
   npm install
   ```
3. Replit sudah include ffmpeg by default

#### Untuk Docker:
```bash
docker build -t jarmusic .
docker run -d --env-file .env jarmusic
```

**Masih error?**
- Pastikan bot punya permission **Connect** dan **Speak**
- Coba ubah voice region Discord server
- Check logs: Bot akan log detail error
- Re-invite bot dengan permissions yang benar

## 📚 Resources

- [Discord.js Guide](https://discordjs.guide/)
- [Discord.js Documentation](https://discord.js.org/)
- [Discord Developer Portal](https://discord.com/developers/applications)

## 📄 License

MIT License - Silakan digunakan dan dikembangkan sesuai kebutuhan.

## 🤝 Contributing

Pull requests welcome! Untuk perubahan besar, silakan buka issue terlebih dahulu.

## 💡 Support

Jika ada pertanyaan atau masalah, silakan buat issue di repository ini.

---

**Dibuat dengan ❤️ menggunakan Discord.js v14**
