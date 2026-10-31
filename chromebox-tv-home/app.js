// Clean TV Home - Chromebox Navigation & Mascot Controller
// Enhanced with Plan A (Taiwan Live Weather & Moods) and Plan D (Category Tabs & Custom App Management)

// 台灣主要縣市座標對應
const TAIWAN_CITIES = {
  Taipei: { name: '台北市', lat: 25.0330, lon: 121.5654 },
  NewTaipei: { name: '新北市', lat: 25.0169, lon: 121.4627 },
  Taoyuan: { name: '桃園市', lat: 24.9936, lon: 121.3009 },
  Taichung: { name: '台中市', lat: 24.1477, lon: 120.6736 },
  Tainan: { name: '台南市', lat: 22.9997, lon: 120.2270 },
  Kaohsiung: { name: '高雄市', lat: 22.6273, lon: 120.3014 },
  Hsinchu: { name: '新竹市', lat: 24.8138, lon: 120.9675 },
  Yilan: { name: '宜蘭縣', lat: 24.7021, lon: 121.7377 },
  Hualien: { name: '花蓮縣', lat: 23.9871, lon: 121.6015 },
  Taitung: { name: '台東縣', lat: 22.7583, lon: 121.1444 }
};

// 氣象 WMO 代碼對照與生活提示
function getWeatherInfo(code, isDay = 1) {
  if (code === 0) {
    return isDay ? { text: '晴朗舒適', icon: '☀️', mood: '陽光正好，適合出門運動跑跳！' }
                 : { text: '夜間晴朗', icon: '🌙', mood: '夜色寧靜，記得早點休息唷～' };
  } else if (code === 1) {
    return isDay ? { text: '晴時多雲', icon: '🌤️', mood: '天氣不錯，心情愉悅！' }
                 : { text: '晴朗月夜', icon: '🌙', mood: '晚風舒適～' };
  } else if (code === 2) {
    return { text: '多雲涼爽', icon: '⛅', mood: '溫度適中，客廳看電視最舒服！' };
  } else if (code === 3) {
    return { text: '陰天多雲', icon: '☁️', mood: '外出請留意天氣變化～' };
  } else if (code === 45 || code === 48) {
    return { text: '清晨霧氣', icon: '🌫️', mood: '視線朦朧，注意保暖！' };
  } else if (code >= 51 && code <= 55) {
    return { text: '毛毛細雨', icon: '🌦️', mood: '出門記得帶把折疊傘！' };
  } else if (code >= 61 && code <= 65) {
    return { text: '陣雨天氣', icon: '🌧️', mood: '外頭下雨中，兒子準備雨傘囉！' };
  } else if (code >= 71 && code <= 77) {
    return { text: '高山飄雪', icon: '❄️', mood: '天氣寒冷，多加件外套！' };
  } else if (code >= 80 && code <= 82) {
    return { text: '強陣短暫雨', icon: '🌧️', mood: '外出請帶傘、注意路面濕滑！' };
  } else if (code >= 95) {
    return { text: '雷陣雨來襲', icon: '⛈️', mood: '戶外有雷陣雨，待在客廳最安全！' };
  }
  return { text: '多雲', icon: '⛅', mood: '今天也是元氣滿滿的一天！' };
}

// 📱 Plan D: 分類分頁定義
const CATEGORIES = [
  { id: 'all', name: '全部', icon: '📺' },
  { id: 'streaming', name: '影音串流', icon: '🎬' },
  { id: 'music', name: '音樂廣播', icon: '🎵' },
  { id: 'kids', name: '兒童專屬', icon: '👶' },
  { id: 'tools', name: '實用工具', icon: '🛠️' }
];

// 預設 APP 清單（配有專屬兒子動作動圖與分類標籤）
const DEFAULT_APPS = [
  {
    id: 'youtube',
    category: 'streaming',
    name: 'YouTube',
    desc: '串流影音、電視版大螢幕體驗',
    url: 'https://www.youtube.com/tv',
    color: '#FF0000',
    mascotSrc: 'assets/actions/pose_youtube.webp',
    actionTag: '🎉 興奮歡呼躍動',
    icon: `<svg viewBox="0 0 24 24" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`
  },
  {
    id: 'netflix',
    category: 'streaming',
    name: 'Netflix',
    desc: '電影、影集與熱門節目',
    url: 'https://www.netflix.com',
    color: '#E50914',
    mascotSrc: 'assets/actions/pose_netflix.webp',
    actionTag: '🍿 舒適放鬆觀影',
    icon: `<svg viewBox="0 0 24 24" fill="#E50914"><path d="M5.398 0v24L9.8 14.86 14.202 24V0H9.8v9.14L5.398 0z"/><path d="M14.202 0v24h4.4V0h-4.4z"/><path d="M5.398 0H1v24h4.398V0z"/></svg>`
  },
  {
    id: 'disney',
    category: 'streaming',
    name: 'Disney+',
    desc: '迪士尼、皮克斯、漫威與星戰',
    url: 'https://www.disneyplus.com',
    color: '#113CCF',
    mascotSrc: 'assets/actions/pose_disney.webp',
    actionTag: '✨ 迪士尼魔幻懸浮',
    icon: `<svg viewBox="0 0 24 24" fill="#38BDF8"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/></svg>`
  },
  {
    id: 'gamer',
    category: 'streaming',
    name: '巴哈姆特動畫瘋',
    desc: '正版最新日本動畫線上看',
    url: 'https://ani.gamer.com.tw',
    color: '#00B4D8',
    mascotSrc: 'assets/actions/pose_gamer.webp',
    actionTag: '⚡ 動漫熱血小跳步',
    icon: `<svg viewBox="0 0 24 24" fill="#00B4D8"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12zm-11-2l6-4-6-4v8z"/></svg>`
  },
  {
    id: 'spotify',
    category: 'music',
    name: 'Spotify',
    desc: '百萬首流行音樂與 Podcast',
    url: 'https://open.spotify.com',
    color: '#1DB954',
    mascotSrc: 'assets/actions/pose_spotify.webp',
    actionTag: '🎵 音樂節奏律動搖擺',
    icon: `<svg viewBox="0 0 24 24" fill="#1DB954"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>`
  },
  {
    id: 'twitch',
    category: 'streaming',
    name: 'Twitch',
    desc: '遊戲實況與社群直播',
    url: 'https://www.twitch.tv',
    color: '#9146FF',
    mascotSrc: 'assets/actions/pose_twitch.webp',
    actionTag: '🎮 玩家實況慶祝跳躍',
    icon: `<svg viewBox="0 0 24 24" fill="#9146FF"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/></svg>`
  },
  {
    id: 'ytkids',
    category: 'kids',
    name: 'YouTube Kids',
    desc: '兒童專屬安全影音與卡通頻道',
    url: 'https://www.youtubekids.com',
    color: '#FF4336',
    mascotSrc: 'assets/son_mascot_jump.webp',
    actionTag: '🎈 歡樂看卡通',
    icon: `<span style="font-size:32px">👶</span>`
  },
  {
    id: 'ptskids',
    category: 'kids',
    name: '公視兒少 PTS Kids',
    desc: '台灣本土優質兒童啟蒙節目',
    url: 'https://kids.pts.org.tw',
    color: '#FF9800',
    mascotSrc: 'assets/son_mascot_idle.webp',
    actionTag: '🦉 聰明啟發探索',
    icon: `<span style="font-size:32px">📚</span>`
  },
  {
    id: 'linetv',
    category: 'streaming',
    name: 'LINE TV',
    desc: '熱門台劇、韓劇、動漫大螢幕看',
    url: 'https://www.linetv.tw',
    color: '#00C300',
    mascotSrc: 'assets/actions/pose_netflix.webp',
    actionTag: '🍿 沙發追劇放鬆',
    icon: `<span style="font-size:32px">📺</span>`
  },
  {
    id: 'ytmusic',
    category: 'music',
    name: 'YouTube Music',
    desc: '熱門流行樂與主題電台',
    url: 'https://music.youtube.com',
    color: '#FF0000',
    mascotSrc: 'assets/actions/pose_spotify.webp',
    actionTag: '🎧 客廳環繞音樂',
    icon: `<span style="font-size:32px">🎶</span>`
  }
];

// 預設熱門電視平台庫（供一鍵快速新增）
const PRESET_APP_LIBRARY = [
  {
    id: 'linetv',
    name: 'LINE TV',
    category: 'streaming',
    desc: '熱門台劇、韓劇與綜藝',
    url: 'https://www.linetv.tw',
    color: '#00C300',
    mascotSrc: 'assets/actions/pose_netflix.webp',
    actionTag: '🍿 沙發追劇放鬆',
    icon: '<span style="font-size:32px">📺</span>'
  },
  {
    id: 'ytkids',
    name: 'YouTube Kids',
    category: 'kids',
    desc: '兒童專屬安全影音',
    url: 'https://www.youtubekids.com',
    color: '#FF4336',
    mascotSrc: 'assets/son_mascot_jump.webp',
    actionTag: '🎈 歡樂看卡通',
    icon: '<span style="font-size:32px">👶</span>'
  },
  {
    id: 'kkbox',
    name: 'KKBOX',
    category: 'music',
    desc: '台灣最大線上串流音樂',
    url: 'https://www.kkbox.com',
    color: '#00A0E9',
    mascotSrc: 'assets/actions/pose_spotify.webp',
    actionTag: '🎵 流行樂點播',
    icon: '<span style="font-size:32px">🎧</span>'
  },
  {
    id: 'iqiyi',
    name: '愛奇藝 iQIYI',
    category: 'streaming',
    desc: '熱門陸劇與自製綜藝',
    url: 'https://www.iq.com',
    color: '#00BE06',
    mascotSrc: 'assets/actions/pose_youtube.webp',
    actionTag: '🎬 大螢幕影院',
    icon: '<span style="font-size:32px">🍿</span>'
  },
  {
    id: 'ptskids',
    name: '公視兒少台',
    category: 'kids',
    desc: '優質兒童探索教育',
    url: 'https://kids.pts.org.tw',
    color: '#FF9800',
    mascotSrc: 'assets/son_mascot_idle.webp',
    actionTag: '🦉 聰明啟發探索',
    icon: '<span style="font-size:32px">📚</span>'
  },
  {
    id: 'gnews',
    name: 'Google 新聞',
    category: 'tools',
    desc: '今日頭條時事與熱搜',
    url: 'https://news.google.com',
    color: '#4285F4',
    mascotSrc: 'assets/actions/pose_youtube.webp',
    actionTag: '📰 掌握即時時事',
    icon: '<span style="font-size:32px">🌐</span>'
  }
];

// 兒子照片與動圖庫（供設定面板預覽與選擇）
const MASCOT_PRESETS = [
  { name: 'YouTube 興奮跳躍', src: 'assets/actions/pose_youtube.webp' },
  { name: 'Netflix 放鬆觀影', src: 'assets/actions/pose_netflix.webp' },
  { name: 'Disney+ 魔幻懸浮', src: 'assets/actions/pose_disney.webp' },
  { name: '動畫瘋 熱血跳步', src: 'assets/actions/pose_gamer.webp' },
  { name: 'Spotify 音樂律動', src: 'assets/actions/pose_spotify.webp' },
  { name: 'Twitch 玩家慶祝', src: 'assets/actions/pose_twitch.webp' },
  { name: '全身待機呼吸動態', src: 'assets/son_mascot_idle.webp' },
  { name: '全身活潑跳躍動態', src: 'assets/son_mascot_jump.webp' },
  { name: '去背原圖 1 (微笑寫真)', src: 'assets/son_cutouts/1791980875662_cutout.png' },
  { name: '去背原圖 2 (生活抓拍)', src: 'assets/son_cutouts/MVIMG_20261025_172630_cutout.png' },
  { name: '去背原圖 3 (活潑全身)', src: 'assets/son_cutouts/IMG_20251026_110414_cutout.png' }
];

class TVLauncher {
  constructor() {
    this.apps = this.loadApps();
    this.settings = this.loadSettings();

    // 分類與焦點控制
    this.currentCategory = 'all';
    this.currentIndex = 0;          // 在當前篩選後的 APP 清單中的索引
    this.activeTabIdx = 0;           // 在分類標籤列中的索引
    this.focusArea = 'apps';         // 'apps' 或 'tabs'
    this.weatherData = null;

    // DOM 元素
    this.grid = document.getElementById('appsGrid');
    this.categoryTabs = document.getElementById('categoryTabs');
    this.focusAppName = document.getElementById('focusAppName');
    this.focusAppDesc = document.getElementById('focusAppDesc');
    this.actionBadge = document.getElementById('actionBadge');
    this.ambientGlow = document.getElementById('ambientGlow');
    this.mascotCursor = document.getElementById('mascotCursor');
    this.mascotImg = document.getElementById('mascotImg');
    this.clockTime = document.getElementById('clockTime');
    this.clockDate = document.getElementById('clockDate');
    this.modal = document.getElementById('settingsModal');

    // 天氣 DOM
    this.weatherWidget = document.getElementById('weatherWidget');
    this.weatherIcon = document.getElementById('weatherIcon');
    this.weatherTemp = document.getElementById('weatherTemp');
    this.weatherCondition = document.getElementById('weatherCondition');
    this.weatherCityTag = document.getElementById('weatherCityTag');
    this.weatherRainProb = document.getElementById('weatherRainProb');

    // Web Audio Synthesizer
    this.audioCtx = null;

    this.init();
  }

  init() {
    this.applySettings();
    this.renderCategoryTabs();
    this.renderApps();
    this.initClock();
    this.initWeather();
    this.initCarEtaListener();
    this.bindEvents();

    // 介面穩定後定位游標
    window.requestAnimationFrame(() => {
      this.updateFocus(0, false);
    });
  }

  loadApps() {
    try {
      const saved = localStorage.getItem('tv_apps_v2');
      if (saved) {
        return JSON.parse(saved);
      }
      // 舊版向後相容
      const oldSaved = localStorage.getItem('tv_apps');
      if (oldSaved) {
        const parsed = JSON.parse(oldSaved);
        return parsed.map((a, idx) => ({
          ...DEFAULT_APPS[idx] || DEFAULT_APPS[0],
          ...a,
          category: a.category || (DEFAULT_APPS[idx] ? DEFAULT_APPS[idx].category : 'streaming')
        }));
      }
    } catch (e) {
      console.warn('Failed to parse saved apps', e);
    }
    return DEFAULT_APPS;
  }

  saveApps(apps) {
    this.apps = apps;
    localStorage.setItem('tv_apps_v2', JSON.stringify(apps));
    this.renderApps();
    const filtered = this.getFilteredApps();
    this.updateFocus(Math.min(this.currentIndex, Math.max(0, filtered.length - 1)), false);
  }

  loadSettings() {
    const defaults = {
      mascotSize: 85,
      mascotOffset: 25,
      bounce: true,
      dynamicPerAppActions: true,
      customMascotSrc: 'assets/son_mascot_idle.webp',
      weatherCity: 'Taipei',
      weatherAutoRefresh: true,
      carEtaEnabled: true,
      carEtaChannel: 'kcchen-family-livingroom'
    };
    try {
      const saved = localStorage.getItem('tv_settings_v2');
      if (saved) return { ...defaults, ...JSON.parse(saved) };
    } catch (e) {}
    return defaults;
  }

  saveSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    localStorage.setItem('tv_settings_v2', JSON.stringify(this.settings));
    this.applySettings();
    this.updateMascotPosition(false);
  }

  applySettings() {
    document.documentElement.style.setProperty('--mascot-size', `${this.settings.mascotSize}px`);
    document.documentElement.style.setProperty('--mascot-offset', `${this.settings.mascotOffset}px`);

    const filtered = this.getFilteredApps();
    const currentApp = filtered[this.currentIndex] || filtered[0] || this.apps[0];
    const targetSrc = (this.settings.dynamicPerAppActions && currentApp && currentApp.mascotSrc)
      ? currentApp.mascotSrc
      : (this.settings.customMascotSrc || 'assets/son_mascot_idle.webp');

    this.mascotImg.src = targetSrc;
  }

  // 取得當前分類下的應用列表
  getFilteredApps() {
    if (this.currentCategory === 'all') {
      return this.apps;
    }
    return this.apps.filter(app => app.category === this.currentCategory);
  }

  // 渲染頂部分類標籤列
  renderCategoryTabs() {
    if (!this.categoryTabs) return;
    this.categoryTabs.innerHTML = '';
    CATEGORIES.forEach((cat, idx) => {
      const btn = document.createElement('button');
      btn.className = `cat-tab ${cat.id === this.currentCategory ? 'active' : ''}`;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('data-id', cat.id);
      btn.innerHTML = `<span>${cat.icon}</span> <span>${cat.name}</span>`;

      btn.addEventListener('click', () => {
        this.switchCategory(cat.id);
      });

      this.categoryTabs.appendChild(btn);
    });
  }

  // 切換分類
  switchCategory(catId) {
    if (this.currentCategory === catId) return;
    this.currentCategory = catId;
    this.currentIndex = 0;
    this.playChimeSound();

    // 更新標籤樣式
    const tabs = this.categoryTabs.querySelectorAll('.cat-tab');
    tabs.forEach(tab => {
      if (tab.getAttribute('data-id') === catId) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    this.renderApps();
    this.updateFocus(0, true);
  }

  // 渲染應用卡片網格
  renderApps() {
    this.grid.innerHTML = '';
    const filtered = this.getFilteredApps();

    if (filtered.length === 0) {
      const emptyNotice = document.createElement('div');
      emptyNotice.style.cssText = 'color:rgba(255,255,255,0.4); font-size:16px; padding:30px; text-align:center; width:100%;';
      emptyNotice.textContent = '此分類尚無應用，請按 [S] 設定新增應用卡片';
      this.grid.appendChild(emptyNotice);
      return;
    }

    filtered.forEach((app, idx) => {
      const card = document.createElement('div');
      card.className = `app-card ${idx === this.currentIndex && this.focusArea === 'apps' ? 'focused' : ''}`;
      card.setAttribute('data-index', idx);
      card.setAttribute('tabindex', '0');

      card.innerHTML = `
        <div class="icon-wrapper" style="background: ${app.color}22">
          ${app.icon || '<span style="font-size:32px">📺</span>'}
        </div>
        <span class="app-label">${app.name}</span>
      `;

      card.addEventListener('click', () => {
        this.focusArea = 'apps';
        this.updateFocus(idx, true);
        this.launchApp(app);
      });

      card.addEventListener('mouseenter', () => {
        this.focusArea = 'apps';
        this.updateFocus(idx, true);
      });

      this.grid.appendChild(card);
    });
  }

  // 時鐘運算
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

  // 🌤️ Plan A: 台灣即時天氣擷取與定時更新
  initWeather() {
    const cached = localStorage.getItem('tv_weather_cache');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        this.updateWeatherUI(parsed);
      } catch (e) {}
    }

    this.fetchWeather();

    if (this.settings.weatherAutoRefresh) {
      setInterval(() => this.fetchWeather(), 30 * 60 * 1000); // 30 分鐘自動同步
    }

    // 點擊小工具立即重刷
    if (this.weatherWidget) {
      this.weatherWidget.addEventListener('click', () => {
        this.fetchWeather(true);
      });
    }
  }

  async fetchWeather(manualTrigger = false) {
    const cityKey = this.settings.weatherCity || 'Taipei';
    const city = TAIWAN_CITIES[cityKey] || TAIWAN_CITIES.Taipei;

    if (manualTrigger) {
      this.weatherCondition.textContent = '更新中...';
      this.playChimeSound();
      this.updateMascotPosition(true, 'right');
    }

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code&hourly=precipitation_probability&timezone=Asia%2FTaipei`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Weather API error');
      const data = await res.json();

      const current = data.current || {};
      const hourly = data.hourly || {};
      const rainProbs = hourly.precipitation_probability || [];
      const currentHour = new Date().getHours();
      const rainProb = rainProbs[currentHour] !== undefined ? rainProbs[currentHour] : (rainProbs[0] || 0);

      const info = {
        cityName: city.name,
        temp: Math.round(current.temperature_2m || 24),
        apparentTemp: Math.round(current.apparent_temperature || current.temperature_2m || 24),
        weatherCode: current.weather_code || 0,
        isDay: current.is_day !== undefined ? current.is_day : 1,
        rainProb: rainProb,
        updatedAt: Date.now()
      };

      this.weatherData = info;
      localStorage.setItem('tv_weather_cache', JSON.stringify(info));
      this.updateWeatherUI(info);

      if (manualTrigger) {
        this.actionBadge.textContent = `🌤️ ${city.name}天氣更新完成！${info.temp}°C`;
      }
    } catch (e) {
      console.warn('Weather fetch failed, falling back', e);
      if (manualTrigger) {
        this.weatherCondition.textContent = '暫時離線';
      }
    }
  }

  updateWeatherUI(info) {
    if (!info) return;
    const weather = getWeatherInfo(info.weatherCode, info.isDay);

    if (this.weatherIcon) this.weatherIcon.textContent = weather.icon;
    if (this.weatherTemp) this.weatherTemp.textContent = `${info.temp}°C`;
    if (this.weatherCondition) this.weatherCondition.textContent = weather.text;
    if (this.weatherCityTag) this.weatherCityTag.textContent = `📍 ${info.cityName}`;
    if (this.weatherRainProb) this.weatherRainProb.textContent = `💧 降雨 ${info.rainProb}%`;

    // 檢查夜晚或下雨情境
    const hour = new Date().getHours();
    if (hour >= 21 || hour < 6) {
      this.currentWeatherMood = '🌙 夜深了，兒子打瞌睡中～';
    } else if (info.rainProb >= 50 || info.weatherCode >= 51) {
      this.currentWeatherMood = '🌧️ 外頭正在下雨，兒子準備小雨傘！';
    } else {
      this.currentWeatherMood = null;
    }
  }

  // Web Audio 電視切換微滴音效
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
      osc.frequency.setValueAtTime(520, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.08);
    } catch (e) {}
  }

  // 雙音階和弦（切換分類或天氣重整音）
  playChimeSound() {
    try {
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const now = this.audioCtx.currentTime;
      [660, 880].forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.15, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.12);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.12);
      });
    } catch (e) {}
  }

  // 更新焦點卡片與兒子動圖游標位置
  updateFocus(index, playSound = true) {
    const filtered = this.getFilteredApps();
    if (filtered.length === 0) return;

    if (index < 0) index = 0;
    if (index >= filtered.length) index = filtered.length - 1;

    const prevIndex = this.currentIndex;
    const direction = index >= prevIndex ? 'right' : 'left';
    this.currentIndex = index;

    const cards = this.grid.querySelectorAll('.app-card');
    cards.forEach((c, i) => {
      if (i === index && this.focusArea === 'apps') {
        c.classList.add('focused');
        c.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        c.classList.remove('focused');
      }
    });

    const activeApp = filtered[index];
    if (activeApp) {
      this.focusAppName.textContent = activeApp.name;
      this.focusAppDesc.textContent = activeApp.desc || '';
      if (this.actionBadge) {
        // 如果有天氣情境（下雨或深夜）則輪流或融入提示
        this.actionBadge.textContent = this.currentWeatherMood || activeApp.actionTag || '👦 活力跳選';
      }
      this.ambientGlow.style.background = `radial-gradient(circle, ${activeApp.color} 0%, transparent 70%)`;
      document.documentElement.style.setProperty('--focus-glow', `${activeApp.color}66`);

      // 切換為當前選單專屬動作
      const targetSrc = (this.settings.dynamicPerAppActions && activeApp.mascotSrc)
        ? activeApp.mascotSrc
        : (this.settings.customMascotSrc || 'assets/son_mascot_idle.webp');

      if (!this.mascotImg.src.endsWith(targetSrc)) {
        this.mascotImg.src = targetSrc;
      }
    }

    if (playSound && prevIndex !== index) {
      this.playNavSound();
    }

    this.updateMascotPosition(prevIndex !== index && this.settings.bounce, direction);
  }

  // 精準定位動圖游標於 APP 上方
  updateMascotPosition(triggerJump = false, direction = 'right') {
    const focusedCard = this.grid.querySelector('.app-card.focused');
    if (!focusedCard) {
      // 若聚焦在分類標籤列，動圖浮於當前標籤上方
      const activeTab = this.categoryTabs.querySelector('.cat-tab.tab-focused') || this.categoryTabs.querySelector('.cat-tab.active');
      if (activeTab) {
        const tabRect = activeTab.getBoundingClientRect();
        const mascotSize = this.settings.mascotSize;
        const targetX = tabRect.left + (tabRect.width / 2) - (mascotSize / 2);
        const targetY = tabRect.top - mascotSize - 12;
        this.mascotCursor.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      }
      return;
    }

    const cardRect = focusedCard.getBoundingClientRect();
    const mascotSize = this.settings.mascotSize;
    const offset = this.settings.mascotOffset;

    const targetX = cardRect.left + (cardRect.width / 2) - (mascotSize / 2);
    const targetY = cardRect.top - mascotSize - offset;

    this.mascotCursor.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;

    if (triggerJump) {
      this.mascotCursor.classList.remove('mascot-jumping', 'jump-right', 'jump-left');
      void this.mascotCursor.offsetWidth;
      this.mascotCursor.classList.add(direction === 'right' ? 'jump-right' : 'jump-left');
    }
  }

  launchApp(app) {
    if (!app || !app.url) return;
    window.open(app.url, '_blank');
  }

  // 遙控器與鍵盤導航
  bindEvents() {
    window.addEventListener('keydown', (e) => {
      if (this.modal.classList.contains('open')) {
        if (e.key === 'Escape') this.closeSettings();
        return;
      }

      const filtered = this.getFilteredApps();

      // 電視遙控器 Menu 鍵或按鍵碼 82 / 93
      if (e.key === 'ContextMenu' || e.key === 'Menu' || e.key === 'Settings' || e.keyCode === 82 || e.keyCode === 93) {
        e.preventDefault();
        this.openSettings();
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          if (this.focusArea === 'apps') {
            this.updateFocus(Math.max(0, this.currentIndex - 1));
          } else if (this.focusArea === 'tabs') {
            this.activeTabIdx = Math.max(0, this.activeTabIdx - 1);
            this.highlightCategoryTab(this.activeTabIdx);
          } else if (this.focusArea === 'header') {
            this.highlightHeaderItem('weather');
          }
          break;

        case 'ArrowRight':
          e.preventDefault();
          if (this.focusArea === 'apps') {
            this.updateFocus(Math.min(filtered.length - 1, this.currentIndex + 1));
          } else if (this.focusArea === 'tabs') {
            this.activeTabIdx = Math.min(CATEGORIES.length - 1, this.activeTabIdx + 1);
            this.highlightCategoryTab(this.activeTabIdx);
          } else if (this.focusArea === 'header') {
            this.highlightHeaderItem('settings');
          }
          break;

        case 'ArrowUp':
          e.preventDefault();
          if (this.focusArea === 'apps') {
            // 從應用卡片往上移動到分類分頁標籤
            this.focusArea = 'tabs';
            const curCatIdx = CATEGORIES.findIndex(c => c.id === this.currentCategory);
            this.activeTabIdx = curCatIdx >= 0 ? curCatIdx : 0;
            this.highlightCategoryTab(this.activeTabIdx);
            // 移除卡片 focus 框
            this.grid.querySelectorAll('.app-card').forEach(c => c.classList.remove('focused'));
            this.updateMascotPosition(true, 'right');
          } else if (this.focusArea === 'tabs') {
            // 從分類分頁再往上移動到頂部列 (齒輪設定與天氣小工具)
            this.focusArea = 'header';
            this.unhighlightCategoryTabs();
            this.highlightHeaderItem('settings');
          }
          break;

        case 'ArrowDown':
          e.preventDefault();
          if (this.focusArea === 'header') {
            // 從頂部列往下回到分類分頁
            this.focusArea = 'tabs';
            this.unhighlightHeaderItems();
            this.highlightCategoryTab(this.activeTabIdx);
          } else if (this.focusArea === 'tabs') {
            // 從分類分頁往下回到應用卡片
            this.focusArea = 'apps';
            this.unhighlightCategoryTabs();
            this.updateFocus(this.currentIndex, true);
          } else {
            this.updateMascotPosition(true, 'right');
          }
          break;

        case 'Enter':
          e.preventDefault();
          if (this.focusArea === 'apps') {
            this.launchApp(filtered[this.currentIndex]);
          } else if (this.focusArea === 'tabs') {
            const selectedCat = CATEGORIES[this.activeTabIdx];
            if (selectedCat) {
              this.switchCategory(selectedCat.id);
              this.focusArea = 'apps';
              this.unhighlightCategoryTabs();
              this.updateFocus(0, true);
            }
          } else if (this.focusArea === 'header') {
            if (this.headerFocusItem === 'settings') {
              this.openSettings();
            } else if (this.headerFocusItem === 'weather') {
              this.fetchWeather(true);
            }
          }
          break;

        case 's':
        case 'S':
          e.preventDefault();
          this.openSettings();
          break;

        case 'F11':
          break;
      }
    });

    // 遙控器長按 OK / Enter 鍵偵測 (長按 750ms 自動進入設定視窗)
    let enterHoldTimer = null;
    let didTriggerHold = false;
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !enterHoldTimer && !this.modal.classList.contains('open')) {
        didTriggerHold = false;
        enterHoldTimer = setTimeout(() => {
          didTriggerHold = true;
          this.openSettings();
        }, 750);
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        if (enterHoldTimer) {
          clearTimeout(enterHoldTimer);
          enterHoldTimer = null;
        }
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

    // 🌤️ Plan A: 城市選擇更換
    const citySelect = document.getElementById('weatherCitySelect');
    if (citySelect) {
      citySelect.value = this.settings.weatherCity || 'Taipei';
      citySelect.addEventListener('change', (e) => {
        this.saveSettings({ weatherCity: e.target.value });
        this.fetchWeather(true);
      });
    }

    // 自動更新天氣切換
    const weatherAutoToggle = document.getElementById('weatherAutoRefreshToggle');
    if (weatherAutoToggle) {
      weatherAutoToggle.checked = this.settings.weatherAutoRefresh;
      weatherAutoToggle.addEventListener('change', (e) => {
        this.saveSettings({ weatherAutoRefresh: e.target.checked });
      });
    }

    // 🚗 Plan 6.1: 車載返家到站連動設定事件
    const carEtaToggle = document.getElementById('carEtaEnabledToggle');
    if (carEtaToggle) {
      carEtaToggle.checked = this.settings.carEtaEnabled !== false;
      carEtaToggle.addEventListener('change', (e) => {
        this.saveSettings({ carEtaEnabled: e.target.checked });
        this.initCarEtaListener();
      });
    }

    const carEtaChannelInput = document.getElementById('carEtaChannelInput');
    if (carEtaChannelInput) {
      carEtaChannelInput.value = this.settings.carEtaChannel || 'kcchen-family-livingroom';
      carEtaChannelInput.addEventListener('change', (e) => {
        const val = e.target.value.trim() || 'kcchen-family-livingroom';
        this.saveSettings({ carEtaChannel: val });
        this.initCarEtaListener();
      });
    }

    const testCarEtaBtn = document.getElementById('testCarEtaBtn');
    if (testCarEtaBtn) {
      testCarEtaBtn.addEventListener('click', () => {
        this.showCarEtaToast({
          title: '🚗 爸爸正在回家路上',
          badge: '預計 10 分鐘抵達',
          message: '目前車輛距離住家約 8.5 km，正在平穩行駛中。',
          progress: 50,
          isArrived: false
        });
      });
    }

    const etaCloseBtn = document.getElementById('etaCloseBtn');
    if (etaCloseBtn) {
      etaCloseBtn.addEventListener('click', () => {
        const toast = document.getElementById('carEtaToast');
        if (toast) toast.classList.remove('visible');
      });
    }

    // 上傳兒子動圖
    const fileInput = document.getElementById('mascotFileInput');
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        const dataUrl = evt.target.result;
        this.saveSettings({ customMascotSrc: dataUrl, dynamicPerAppActions: false });
        document.getElementById('mascotSettingPreview').src = dataUrl;
        document.getElementById('dynamicActionsToggle').checked = false;
      };
      reader.readAsDataURL(file);
    });

    // 重設動圖
    document.getElementById('resetMascotBtn').addEventListener('click', () => {
      this.saveSettings({ customMascotSrc: 'assets/son_mascot_idle.webp', dynamicPerAppActions: true });
      document.getElementById('mascotSettingPreview').src = 'assets/son_mascot_idle.webp';
      document.getElementById('dynamicActionsToggle').checked = true;
      this.renderMascotPresets();
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

    // 各選單專屬動作切換開關
    const dynamicActionsToggle = document.getElementById('dynamicActionsToggle');
    if (dynamicActionsToggle) {
      dynamicActionsToggle.checked = this.settings.dynamicPerAppActions;
      dynamicActionsToggle.addEventListener('change', (e) => {
        this.saveSettings({ dynamicPerAppActions: e.target.checked });
        this.updateFocus(this.currentIndex, false);
      });
    }

    // 手動新增自訂 APP 按鈕
    document.getElementById('addAppBtn').addEventListener('click', () => {
      const newApp = {
        id: 'app_' + Date.now(),
        category: this.currentCategory === 'all' ? 'streaming' : this.currentCategory,
        name: '自訂捷徑',
        desc: '常用客廳網站',
        url: 'https://',
        color: '#3B82F6',
        mascotSrc: 'assets/son_mascot_idle.webp',
        actionTag: '🌟 探索新應用',
        icon: '<span style="font-size:32px">🌐</span>'
      };
      this.saveApps([...this.apps, newApp]);
      this.renderAppEditorList();
      this.renderQuickAddGrid();
    });
  }

  highlightCategoryTab(tabIdx) {
    const tabs = this.categoryTabs.querySelectorAll('.cat-tab');
    tabs.forEach((tab, i) => {
      if (i === tabIdx) {
        tab.classList.add('tab-focused');
        tab.focus();
      } else {
        tab.classList.remove('tab-focused');
      }
    });
    const targetCat = CATEGORIES[tabIdx];
    if (targetCat) {
      this.switchCategory(targetCat.id);
    }
  }

  unhighlightCategoryTabs() {
    this.categoryTabs.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('tab-focused'));
  }

  highlightHeaderItem(item) {
    this.unhighlightHeaderItems();
    this.headerFocusItem = item;
    if (item === 'settings') {
      const btn = document.getElementById('openSettingsBtn');
      if (btn) btn.classList.add('header-focused');
    } else if (item === 'weather') {
      const widget = document.getElementById('weatherWidget');
      if (widget) widget.classList.add('header-focused');
    }
  }

  unhighlightHeaderItems() {
    const btn = document.getElementById('openSettingsBtn');
    if (btn) btn.classList.remove('header-focused');
    const widget = document.getElementById('weatherWidget');
    if (widget) widget.classList.remove('header-focused');
  }

  openSettings() {
    this.modal.classList.add('open');
    document.getElementById('mascotSettingPreview').src = this.settings.customMascotSrc || 'assets/son_mascot_idle.webp';
    const carEtaToggle = document.getElementById('carEtaEnabledToggle');
    if (carEtaToggle) carEtaToggle.checked = this.settings.carEtaEnabled !== false;
    const carEtaChannelInput = document.getElementById('carEtaChannelInput');
    if (carEtaChannelInput) carEtaChannelInput.value = this.settings.carEtaChannel || 'kcchen-family-livingroom';

    this.renderMascotPresets();
    this.renderQuickAddGrid();
    this.renderAppEditorList();
  }

  closeSettings() {
    this.modal.classList.remove('open');
    this.updateFocus(this.currentIndex, false);
  }

  renderMascotPresets() {
    const grid = document.getElementById('mascotPresetsGrid');
    if (!grid) return;
    grid.innerHTML = '';
    MASCOT_PRESETS.forEach((preset) => {
      const item = document.createElement('div');
      item.className = `preset-thumb ${this.settings.customMascotSrc === preset.src ? 'active' : ''}`;
      item.title = preset.name;
      item.innerHTML = `<img src="${preset.src}" alt="${preset.name}">`;
      item.addEventListener('click', () => {
        this.saveSettings({ customMascotSrc: preset.src, dynamicPerAppActions: false });
        document.getElementById('mascotSettingPreview').src = preset.src;
        const dynamicToggle = document.getElementById('dynamicActionsToggle');
        if (dynamicToggle) dynamicToggle.checked = false;
        this.renderMascotPresets();
      });
      grid.appendChild(item);
    });
  }

  // 📱 Plan D: 渲染常用電視平台快速新增按鈕
  renderQuickAddGrid() {
    const container = document.getElementById('quickAddGrid');
    if (!container) return;
    container.innerHTML = '';

    PRESET_APP_LIBRARY.forEach(preset => {
      const isAlreadyAdded = this.apps.some(a => a.url === preset.url || a.name === preset.name);
      const btn = document.createElement('button');
      btn.className = `quick-add-btn ${isAlreadyAdded ? 'already-added' : ''}`;
      btn.innerHTML = `<span>${preset.icon}</span> <span>${preset.name}</span> <span>${isAlreadyAdded ? '✓ 已加入' : '+ 新增'}</span>`;

      if (!isAlreadyAdded) {
        btn.addEventListener('click', () => {
          this.saveApps([...this.apps, { ...preset, id: 'app_' + Date.now() }]);
          this.playChimeSound();
          this.renderQuickAddGrid();
          this.renderAppEditorList();
        });
      }
      container.appendChild(btn);
    });
  }

  // 📱 Plan D: 渲染卡片編輯清單（含分類下拉與網址設定）
  renderAppEditorList() {
    const listContainer = document.getElementById('appListEditor');
    if (!listContainer) return;
    listContainer.innerHTML = '';

    this.apps.forEach((app, idx) => {
      const row = document.createElement('div');
      row.className = 'app-item-row';
      row.innerHTML = `
        <select class="app-category-select">
          <option value="streaming" ${app.category === 'streaming' ? 'selected' : ''}>🎬 串流</option>
          <option value="music" ${app.category === 'music' ? 'selected' : ''}>🎵 音樂</option>
          <option value="kids" ${app.category === 'kids' ? 'selected' : ''}>👶 兒童</option>
          <option value="tools" ${app.category === 'tools' ? 'selected' : ''}>🛠️ 工具</option>
        </select>
        <input type="text" class="app-name-input" value="${app.name}" placeholder="名稱">
        <input type="text" class="app-url-input" value="${app.url}" placeholder="網址 (https://...)">
        <button class="btn-danger" data-idx="${idx}">刪除</button>
      `;

      row.querySelector('.app-category-select').addEventListener('change', (e) => {
        this.apps[idx].category = e.target.value;
        this.saveApps(this.apps);
      });

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
        this.renderQuickAddGrid();
      });

      listContainer.appendChild(row);
    });
  }

  // 🚗 Plan 6.1: 車載返家即時到站 (Car-to-Living-Room ETA) 監聽器與彈窗邏輯
  initCarEtaListener() {
    if (this.carEtaEventSource) {
      this.carEtaEventSource.close();
      this.carEtaEventSource = null;
    }

    if (this.settings.carEtaEnabled === false) {
      console.log('🚗 車載返家到站監聽已停用');
      return;
    }

    const channel = encodeURIComponent(this.settings.carEtaChannel || 'kcchen-family-livingroom');
    try {
      console.log(`📡 正在連線 ntfy.sh 車載推播頻道: ${channel}`);
      this.carEtaEventSource = new EventSource(`https://ntfy.sh/${channel}/sse`);

      this.carEtaEventSource.onmessage = (event) => {
        try {
          const raw = JSON.parse(event.data);
          let payload = raw;
          if (raw.message) {
            try {
              payload = JSON.parse(raw.message);
            } catch (e) {
              payload = { event: 'car_approaching', message: raw.message };
            }
          }

          if (payload.event === 'car_approaching') {
            const dist = payload.distance_km ? `${payload.distance_km} km` : '約 8~10 km';
            const eta = payload.eta_minutes || 10;
            this.showCarEtaToast({
              title: '🚗 爸爸正在回家路上',
              badge: `預計 ${eta} 分鐘抵達`,
              message: `目前車輛距離住家約 ${dist}，正在平穩行駛中。`,
              progress: Math.min(90, Math.max(15, 100 - (payload.distance_km || 10) * 8)),
              isArrived: false
            });
          } else if (payload.event === 'car_arrived') {
            this.showCarEtaToast({
              title: '🏡 爸爸已抵達家門口！',
              badge: '已抵達',
              message: '車輛已進入住家 500m 範圍，請準備開門迎接！',
              progress: 100,
              isArrived: true
            });
          }
        } catch (err) {
          console.warn('解析車載推播資料失敗:', err);
        }
      };

      this.carEtaEventSource.onerror = (err) => {
        console.warn('ntfy.sh 連線狀態更新，自動保持監聽');
      };
    } catch (e) {
      console.error('初始化車載推播監聽失敗:', e);
    }
  }

  showCarEtaToast(info) {
    const toast = document.getElementById('carEtaToast');
    if (!toast) return;

    const titleEl = toast.querySelector('.eta-title');
    const badgeEl = document.getElementById('etaBadge');
    const messageEl = document.getElementById('etaMessage');
    const progressEl = document.getElementById('etaProgressInner');
    const carIcon = toast.querySelector('.eta-car-icon');

    if (titleEl) titleEl.textContent = info.title;
    if (badgeEl) {
      badgeEl.textContent = info.badge;
      badgeEl.className = info.isArrived ? 'eta-badge eta-badge-arrived' : 'eta-badge';
    }
    if (messageEl) messageEl.textContent = info.message;
    if (progressEl) progressEl.style.width = `${info.progress || 50}%`;
    if (carIcon) carIcon.textContent = info.isArrived ? '🏡' : '🚗';

    // 播放客廳溫柔提示音
    this.playCarNotificationSound();

    toast.classList.add('visible');

    if (this.carEtaTimer) clearTimeout(this.carEtaTimer);
    this.carEtaTimer = setTimeout(() => {
      toast.classList.remove('visible');
    }, 25000); // 25 秒後自動隱藏
  }

  playCarNotificationSound() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!this.audioCtx) this.audioCtx = new AudioContext();
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      // 雙音叮咚音效 (C5 523Hz -> G5 784Hz)
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(783.99, now + 0.15);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.6);
    } catch (e) {}
  }
}

// 啟動電視主頁
window.addEventListener('DOMContentLoaded', () => {
  window.tvLauncher = new TVLauncher();
});
