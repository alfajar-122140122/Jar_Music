# 🔐 Bot Permissions Required

## ⚠️ PENTING: Bot Permissions

Bot **JarMusic** membutuhkan permissions berikut untuk berfungsi dengan baik:

### 📋 Required Permissions:

#### Text Permissions:
- ✅ **View Channels** - Melihat channel
- ✅ **Send Messages** - Mengirim pesan
- ✅ **Embed Links** - Mengirim embed
- ✅ **Read Message History** - Membaca history

#### Voice Permissions:
- ✅ **Connect** - Join voice channel (WAJIB)
- ✅ **Speak** - Memutar audio (WAJIB)
- ✅ **Use Voice Activity** - Voice activity

#### Application Commands:
- ✅ **Use Application Commands** - Slash commands

---

## 🔗 Bot Invite Link dengan Permissions

Gunakan link ini untuk invite bot dengan permissions yang benar:

```
https://discord.com/api/oauth2/authorize?client_id=1431923448418009170&permissions=36700160&scope=bot%20applications.commands
```

Atau buat manual:
1. Buka [Discord Developer Portal](https://discord.com/developers/applications)
2. Pilih aplikasi bot Anda
3. Ke **OAuth2** → **URL Generator**
4. Checklist:
   - **Scopes**: `bot` dan `applications.commands`
   - **Permissions**: Pilih permissions di atas
5. Copy generated URL

---

## 🔧 Check Bot Permissions

Jika bot error saat join voice channel:

1. **Klik kanan pada bot** di server member list
2. Pilih **"Server Permissions"** atau buka **Server Settings** → **Roles**
3. Cari role bot dan pastikan permissions di atas aktif
4. Pastikan **channel permissions** juga memberi akses ke bot

---

## 🎯 Troubleshooting Voice Errors

### Error: "Failed to join voice channel"

**Kemungkinan penyebab:**
1. ❌ Bot tidak punya permission **Connect** di voice channel
2. ❌ Bot tidak punya permission **Speak** di voice channel
3. ❌ Voice channel penuh (limit reached)
4. ❌ Bot sudah di voice channel lain

**Solusi:**
1. ✅ Check bot role permissions
2. ✅ Check channel-specific permissions
3. ✅ Use `/leave` dulu jika bot stuck di channel lain
4. ✅ Re-invite bot dengan link di atas

### Error: "AbortError: The operation was aborted"

**Penyebab:**
- Network timeout saat connecting ke voice
- Discord voice server lambat

**Solusi:**
- Coba lagi beberapa saat
- Pastikan voice region server tidak bermasalah
- Ubah voice region server ke yang lebih dekat

---

## 📞 Need Help?

Jika masih error:
1. Check logs di hosting platform
2. Pastikan bot online
3. Coba `/ping` dulu untuk test connection
4. Re-deploy slash commands: `npm run deploy`

---

**Bot sudah siap digunakan!** 🎉
