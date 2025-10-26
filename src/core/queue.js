export class MusicQueue {
  constructor(guildId) {
    this.guildId = guildId;
    this.songs = [];
    this.player = null;
    this.connection = null;
    this.playing = false;
    this.paused = false;
    this.volume = 1;
  }

  addSong(song) {
    this.songs.push(song);
  }

  removeSong(index) {
    if (index >= 0 && index < this.songs.length) {
      return this.songs.splice(index, 1)[0];
    }
    return null;
  }

  clear() {
    this.songs = [];
    this.playing = false;
    this.paused = false;
  }

  getCurrentSong() {
    return this.songs[0];
  }

  getNextSong() {
    return this.songs[1];
  }

  skip() {
    this.songs.shift();
    return this.getCurrentSong();
  }

  isEmpty() {
    return this.songs.length === 0;
  }

  size() {
    return this.songs.length;
  }
}

// Store queues for all guilds
const queues = new Map();

export function getQueue(guildId) {
  if (!queues.has(guildId)) {
    queues.set(guildId, new MusicQueue(guildId));
  }
  return queues.get(guildId);
}

export function deleteQueue(guildId) {
  return queues.delete(guildId);
}

export function hasQueue(guildId) {
  return queues.has(guildId);
}
