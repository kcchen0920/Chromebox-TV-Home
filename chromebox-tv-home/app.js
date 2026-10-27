// Clean TV Home - Chromebox Navigation & Mascot Controller

// 預設 APP 清單
const DEFAULT_APPS = [
  {
    id: 'youtube',
    name: 'YouTube',
    desc: '串流影音、電視版大螢幕體驗',
    url: 'https://www.youtube.com/tv',
    color: '#FF0000',
    icon: `<svg viewBox="0 0 24 24" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`
  },
  {
    id: 'netflix',
    name: 'Netflix',
    desc: '電影、影集與熱門節目',
    url: 'https://www.netflix.com',
    color: '#E50914',
    icon: `<svg viewBox="0 0 24 24" fill="#E50914"><path d="M5.398 0v24L9.8 14.86 14.202 24V0H9.8v9.14L5.398 0z"/><path d="M14.202 0v24h4.4V0h-4.4z"/><path d="M5.398 0H1v24h4.398V0z"/></svg>`
  },
  {
    id: 'disney',
    name: 'Disney+',
    desc: '迪士尼、皮克斯、漫威與星戰',
    url: 'https://www.disneyplus.com',
    color: '#113CCF',
    icon: `<svg viewBox="0 0 24 24" fill="#38BDF8"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/></svg>`
  },
  {
    id: 'gamer',
    name: '巴哈姆特動畫瘋',
    desc: '正版最新日本動畫線上看',
    url: 'https://ani.gamer.com.tw',
    color: '#00B4D8',
    icon: `<svg viewBox="0 0 24 24" fill="#00B4D8"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12zm-11-2l6-4-6-4v8z"/></svg>`
  },
  {
    id: 'spotify',
    name: 'Spotify',
    desc: '百萬首流行音樂與 Podcast',
    url: 'https://open.spotify.com',
    color: '#1DB954',
    icon: `<svg viewBox="0 0 24 24" fill="#1DB954"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>`
  },
  {
    id: 'twitch',
    name: 'Twitch',
    desc: '遊戲實況與社群直播',
    url: 'https://www.twitch.tv',
    color: '#9146FF',
    icon: `<svg viewBox="0 0 24 24" fill="#9146FF"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/></svg>`
  }
];

class TVLauncher {
  constructor() {
    this.apps = this.loadApps();
    this.currentIndex = 0;
    this.settings = this.loadSettings();

    // DOM Elements
    this.grid = document.getElementById('appsGrid');
    this.focusAppName = document.getElementById('focusAppName');
    this.focusAppDesc = document.getElementById('focusAppDesc');
    this.ambientGlow = document.getElementById('ambientGlow');
    this.mascotCursor = document.getElementById('mascotCursor');
    this.mascotImg = document.getElementById('mascotImg');
    this.clockTime = document.getElementById('clockTime');
    this.clockDate = document.getElementById('clockDate');
    this.modal = document.getElementById('settingsModal');

    // Web Audio Synthesizer for UI sound
    this.audioCtx = null;

    this.init();
  }

  init() {
    this.applySettings();
    this.renderApps();
    this.initClock();
    this.bindEvents();

    // 等待 DOM 排版穩定後定位動圖游標
    window.requestAnimationFrame(() => {
      this.updateFocus(0, false);
    });
  }

  loadApps() {
    try {
      const saved = localStorage.getItem('tv_apps');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved apps', e);
    }
    return DEFAULT_APPS;
  }

  saveApps(apps) {
    this.apps = apps;
    localStorage.setItem('tv_apps', JSON.stringify(apps));
    this.renderApps();
    this.updateFocus(Math.min(this.currentIndex, this.apps.length - 1), false);
  }

  loadSettings() {
    const defaults = {
      mascotSize: 80,
      mascotOffset: 25,
      bounce: true,
      customMascotSrc: null
    };
    try {
      const saved = localStorage.getItem('tv_settings');
      if (saved) return { ...defaults, ...JSON.parse(saved) };
    } catch (e) {}
    return defaults;
  }

  saveSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    localStorage.setItem('tv_settings', JSON.stringify(this.settings));
    this.applySettings();
    this.updateMascotPosition(false);
  }

  applySettings() {
    document.documentElement.style.setProperty('--mascot-size', `${this.settings.mascotSize}px`);
    document.documentElement.style.setProperty('--mascot-offset', `${this.settings.mascotOffset}px`);

    if (this.settings.customMascotSrc) {
      this.mascotImg.src = this.settings.customMascotSrc;
    } else {
      this.mascotImg.src = 'assets/mascot_default.svg';
    }
  }

  renderApps() {
    this.grid.innerHTML = '';
    this.apps.forEach((app, idx) => {
      const card = document.createElement('div');
      card.className = `app-card ${idx === this.currentIndex ? 'focused' : ''}`;
      card.setAttribute('data-index', idx);
      card.setAttribute('tabindex', '0');

      card.innerHTML = `
        <div class="icon-wrapper" style="background: ${app.color}22">
          ${app.icon || '<span style="font-size:32px">📺</span>'}
        </div>
        <span class="app-label">${app.name}</span>
      `;

      card.addEventListener('click', () => {
        this.updateFocus(idx, true);
        this.launchApp(app);
      });

      card.addEventListener('mouseenter', () => {
        this.updateFocus(idx, true);
      });

      this.grid.appendChild(card);
    });
  }

  initClock() {
    const update = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      this.clockTime.textContent = `${hours}:${minutes}`;

      const options = { month: 'numeric', day: 'numeric', weekday: 'long' };
      this.clockDate.textContent = now.toLocaleDateString('zh-TW', options);
    };
    update();
    setInterval(update, 1000);
  }

  // 播放電視選單切換音效 (純 Web Audio 合成，不需外部音檔)
  playNavSound() {
    try {
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.08);
    } catch (e) {}
  }

  // 更新焦點卡片與兒子動圖游標位置
  updateFocus(index, playSound = true) {
    if (index < 0 || index >= this.apps.length) return;
    const prevIndex = this.currentIndex;
    this.currentIndex = index;

    const cards = this.grid.querySelectorAll('.app-card');
    cards.forEach((c, i) => {
      if (i === index) {
        c.classList.add('focused');
        c.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        c.classList.remove('focused');
      }
    });

    const activeApp = this.apps[index];
    if (activeApp) {
      this.focusAppName.textContent = activeApp.name;
      this.focusAppDesc.textContent = activeApp.desc || '';
      this.ambientGlow.style.background = `radial-gradient(circle, ${activeApp.color} 0%, transparent 70%)`;
      document.documentElement.style.setProperty('--focus-glow', `${activeApp.color}66`);
    }

    if (playSound && prevIndex !== index) {
      this.playNavSound();
    }

    this.updateMascotPosition(prevIndex !== index && this.settings.bounce);
  }

  // 精準計算將動圖放置在 APP 正上方
  updateMascotPosition(triggerJump = false) {
    const focusedCard = this.grid.querySelector('.app-card.focused');
    if (!focusedCard) return;

    const cardRect = focusedCard.getBoundingClientRect();
    const mascotSize = this.settings.mascotSize;
    const offset = this.settings.mascotOffset;

    // 水平置中於目標卡片
    const targetX = cardRect.left + (cardRect.width / 2) - (mascotSize / 2);
    // 垂直浮在目標卡片的正上方
    const targetY = cardRect.top - mascotSize - offset;

    this.mascotCursor.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;

    if (triggerJump) {
      this.mascotCursor.classList.remove('mascot-jumping');
      // 強制重繪以重啟 CSS 跳躍動畫
      void this.mascotCursor.offsetWidth;
      this.mascotCursor.classList.add('mascot-jumping');
    }
  }

  launchApp(app) {
    if (!app || !app.url) return;
    // 在全螢幕或新分頁開啟應用
    window.open(app.url, '_blank');
  }

  bindEvents() {
    // 遙控器與鍵盤方向鍵監聽
    window.addEventListener('keydown', (e) => {
      if (this.modal.classList.contains('open')) {
        if (e.key === 'Escape') this.closeSettings();
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          this.updateFocus(Math.max(0, this.currentIndex - 1));
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.updateFocus(Math.min(this.apps.length - 1, this.currentIndex + 1));
          break;
        case 'ArrowUp':
        case 'ArrowDown':
          e.preventDefault();
          // 單列佈局上下鍵跳動提示
          this.updateMascotPosition(true);
          break;
        case 'Enter':
          e.preventDefault();
          this.launchApp(this.apps[this.currentIndex]);
          break;
        case 's':
        case 'S':
          e.preventDefault();
          this.openSettings();
          break;
        case 'F11':
          // 允許原生切換全螢幕
          break;
      }
    });

    window.addEventListener('resize', () => {
      this.updateMascotPosition(false);
    });

    // 設定視窗開關
    document.getElementById('openSettingsBtn').addEventListener('click', () => this.openSettings());
    document.getElementById('closeSettingsBtn').addEventListener('click', () => this.closeSettings());
    document.getElementById('saveSettingsBtn').addEventListener('click', () => this.closeSettings());
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.closeSettings();
    });

    // 上傳兒子動圖
    const fileInput = document.getElementById('mascotFileInput');
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        const dataUrl = evt.target.result;
        this.saveSettings({ customMascotSrc: dataUrl });
        document.getElementById('mascotSettingPreview').src = dataUrl;
      };
      reader.readAsDataURL(file);
    });

    // 重設動圖
    document.getElementById('resetMascotBtn').addEventListener('click', () => {
      this.saveSettings({ customMascotSrc: null });
      document.getElementById('mascotSettingPreview').src = 'assets/mascot_default.svg';
    });

    // 動圖尺寸滑桿
    const sizeRange = document.getElementById('mascotSizeRange');
    const sizeVal = document.getElementById('mascotSizeVal');
    sizeRange.value = this.settings.mascotSize;
    sizeVal.textContent = `${this.settings.mascotSize}px`;
    sizeRange.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      sizeVal.textContent = `${val}px`;
      this.saveSettings({ mascotSize: val });
    });

    // 浮動高度滑桿
    const offsetRange = document.getElementById('mascotOffsetRange');
    const offsetVal = document.getElementById('mascotOffsetVal');
    offsetRange.value = this.settings.mascotOffset;
    offsetVal.textContent = `${this.settings.mascotOffset}px`;
    offsetRange.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      offsetVal.textContent = `${val}px`;
      this.saveSettings({ mascotOffset: val });
    });

    // 跳躍開關
    const bounceToggle = document.getElementById('bounceToggle');
    bounceToggle.checked = this.settings.bounce;
    bounceToggle.addEventListener('change', (e) => {
      this.saveSettings({ bounce: e.target.checked });
    });

    // 新增 APP 按鈕
    document.getElementById('addAppBtn').addEventListener('click', () => {
      const newApp = {
        id: 'app_' + Date.now(),
        name: '新捷徑',
        desc: '常用網站捷徑',
        url: 'https://',
        color: '#3B82F6',
        icon: '<span style="font-size:32px">🌐</span>'
      };
      this.saveApps([...this.apps, newApp]);
      this.renderAppEditorList();
    });
  }

  openSettings() {
    this.modal.classList.add('open');
    document.getElementById('mascotSettingPreview').src = this.settings.customMascotSrc || 'assets/mascot_default.svg';
    this.renderAppEditorList();
  }

  closeSettings() {
    this.modal.classList.remove('open');
    this.updateFocus(this.currentIndex, false);
  }

  renderAppEditorList() {
    const listContainer = document.getElementById('appListEditor');
    listContainer.innerHTML = '';
    this.apps.forEach((app, idx) => {
      const row = document.createElement('div');
      row.className = 'app-item-row';
      row.innerHTML = `
        <input type="text" class="app-name-input" value="${app.name}" placeholder="名稱">
        <input type="text" class="app-url-input" value="${app.url}" placeholder="網址 (https://...)">
        <button class="btn-danger" data-idx="${idx}">刪除</button>
      `;

      row.querySelector('.app-name-input').addEventListener('change', (e) => {
        this.apps[idx].name = e.target.value;
        this.saveApps(this.apps);
      });

      row.querySelector('.app-url-input').addEventListener('change', (e) => {
        this.apps[idx].url = e.target.value;
        this.saveApps(this.apps);
      });

      row.querySelector('.btn-danger').addEventListener('click', () => {
        if (this.apps.length <= 1) {
          alert('至少需保留一個應用卡片！');
          return;
        }
        const updated = this.apps.filter((_, i) => i !== idx);
        this.saveApps(updated);
        this.renderAppEditorList();
      });

      listContainer.appendChild(row);
    });
  }
}

// 啟動電視主頁
window.addEventListener('DOMContentLoaded', () => {
  window.tvLauncher = new TVLauncher();
});
