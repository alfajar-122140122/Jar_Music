# 🚀 Deploy JarMusic ke Hosting Gratis

## 📦 Option 1: Replit (RECOMMENDED - Paling Mudah)

### Langkah-langkah:

1. **Buka [Replit.com](https://replit.com)**
   - Sign up/login (bisa pakai Google/GitHub)

2. **Create New Repl**
   - Klik "+ Create Repl"
   - Pilih "Import from GitHub" ATAU "Upload folder"

3. **Upload Project**
   - Jika pakai upload: Zip folder JarMusic ini, lalu upload
   - Jika pakai GitHub: Connect repo Anda

4. **Setup Environment Variables**
   - Klik icon 🔒 "Secrets" (Tools → Secrets)
   - Tambahkan:
     - `DISCORD_TOKEN` = your_bot_token
     - `CLIENT_ID` = your_client_id
     - `GUILD_ID` = your_guild_id

5. **Install Dependencies**
   - Di terminal Replit, jalankan:
   ```bash
   npm install
   ```

6. **Deploy Commands**
   ```bash
   npm run deploy
   ```

7. **Run Bot**
   - Klik tombol "Run" hijau di atas
   - Bot akan online 24/7!

### Keep Bot Always Online:
- Gunakan [UptimeRobot](https://uptimerobot.com) untuk ping repl setiap 5 menit
- Atau upgrade ke Replit Cycles (opsional)

---

## 📦 Option 2: Railway.app

### Langkah-langkah:

1. **Push ke GitHub**
   ```bash
   cd D:\Project\Jar_Music
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy di Railway**
   - Buka [Railway.app](https://railway.app)
   - Login dengan GitHub
   - "New Project" → "Deploy from GitHub repo"
   - Pilih repo JarMusic

3. **Add Environment Variables**
   - Klik project → Variables
   - Tambahkan:
     - `DISCORD_TOKEN`
     - `CLIENT_ID`
     - `GUILD_ID`

4. **Deploy Commands**
   - Railway akan auto-install dependencies
   - Buka terminal Railway dan run:
   ```bash
   npm run deploy
   ```

5. **Bot Online!**
   - Railway akan auto-restart jika crash

---

## 📦 Option 3: Render.com

### Langkah-langkah:

1. **Push ke GitHub** (sama seperti Railway)

2. **Deploy di Render**
   - Buka [Render.com](https://render.com)
   - Sign up gratis
   - "New +" → "Web Service"
   - Connect GitHub repo

3. **Configure Service**
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Add Environment Variables**
   - Tambahkan `DISCORD_TOKEN`, `CLIENT_ID`, `GUILD_ID`

5. **Deploy Commands**
   - Setelah deploy, buka Shell dan run:
   ```bash
   npm run deploy
   ```

6. **Bot Online!**

⚠️ **Note**: Render free tier akan sleep setelah 15 menit idle.

---

## 🎯 Comparison

| Platform | Gratis? | Uptime | Setup | Credit Card? |
|----------|---------|--------|-------|--------------|
| **Replit** | ✅ Ya | 24/7* | Mudah | ❌ Tidak |
| **Railway** | ✅ $5/month | 24/7 | Mudah | ⚠️ Ya (tidak dicharge) |
| **Render** | ✅ Ya | Sleep 15 min | Medium | ❌ Tidak |
| **Glitch** | ✅ Ya | Restart 12 jam | Mudah | ❌ Tidak |

*Dengan UptimeRobot

---

## 💡 Rekomendasi

1. **Untuk pemula**: Gunakan **Replit** (paling mudah, no credit card)
2. **Untuk production**: Gunakan **Railway** (lebih stabil, $5 credit cukup)
3. **Untuk testing**: Gunakan **Render** (gratis tapi sleep)

---

## 🔧 Troubleshooting

### Bot masih error di hosting?
1. Pastikan semua dependencies terinstall
2. Cek environment variables sudah benar
3. Run `npm run deploy` dulu sebelum start bot
4. Cek logs untuk error

### Bot offline terus di Replit?
1. Gunakan UptimeRobot untuk ping
2. Atau buat simple HTTP server (opsional)

---

## 📞 Support

Jika ada masalah saat deploy, cek:
1. Logs di platform hosting
2. Discord bot status di Developer Portal
3. Pastikan bot sudah di-invite ke server

**Selamat mencoba!** 🎉
