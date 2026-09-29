/* Oneira project page. The synchronized players come from the supplementary video page
   (supp_videos/index.html). Here they load when a case scrolls into view and play on their own
   until the viewer pauses them. */
(() => {
"use strict";

const FPS = 24, SEG_FRAMES = 243, CHUNKS = 8;
const REDUCED = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

const fmt = (t) => {
  if (!isFinite(t)) t = 0;
  const m = Math.floor(t / 60), s = t - m * 60;
  return m + ":" + s.toFixed(2).padStart(5, "0");
};
const el = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
};
const posterFor = (src) => "static/posters/" + src.replace(/^assets\//, "").replace(/\.mp4$/, ".jpg");

/* A band across the middle half of the screen. A player plays while its case overlaps the band. */
const BAND = "-25% 0px -25% 0px";
const inBand = (node) => {
  const r = node.getBoundingClientRect(), h = window.innerHeight;
  return r.bottom > h * 0.25 && r.top < h * 0.75 && r.height > 0;
};

/* Start time of chunk k (0-based over the whole chain). Segments have 243 frames unless a case says otherwise. */
const chunkStart = (k, segFrames = SEG_FRAMES) => {
  const seg = Math.floor(k / CHUNKS), j = k % CHUNKS;
  return (seg * segFrames + Math.round((segFrames * j) / CHUNKS)) / FPS;
};

/* ---------- Math ---------- */
if (window.renderMathInElement) {
  window.renderMathInElement(document.body, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
    ],
    throwOnError: false,
  });
}

/* ---------- Chunk captions ---------- */

/* Chunk captions panel, after the style of Fig. 2. update(t) highlights the chunk at time t, and a click
   on a cell calls onSeek with the start time of that chunk. The result players and the highlight
   carousel both use it. */
const chunkPanel = (d, onSeek) => {
  const nSeg = d.segments || 1;
  const n = nSeg * CHUNKS;
  const evByK = new Map((d.events || []).map((e) => [e.k - 1, e]));
  const box = el("div", "caps" + (nSeg > 1 ? " chain" : ""));
  const head = el("div", "head");
  const title = el("div", "title");
  title.append(document.createTextNode("chunk captions "));
  const ci = el("i", null, "c");
  ci.appendChild(el("sub", null, "k"));
  title.appendChild(ci);
  const strip = el("div", "strip");
  const cells = [];
  for (let s = 0; s < nSeg; s++) {
    const seg = el("div", "seg");
    for (let j = 0; j < CHUNKS; j++) {
      const k = s * CHUNKS + j;
      const c = el("button", "cell" + (evByK.has(k) ? " ev" : ""));
      c.type = "button";
      c.title = "Chunk " + (k + 1) + (evByK.has(k) ? ", interaction" : "");
      c.setAttribute("aria-label", c.title);
      c.addEventListener("click", () => onSeek(chunkStart(k, d.segFrames) + 0.01));
      seg.appendChild(c);
      cells.push(c);
    }
    strip.appendChild(seg);
  }
  head.append(title, strip);
  box.appendChild(head);

  const ul = el("ul");
  const capLines = new Map();
  [...evByK.entries()].sort((a, b) => a[0] - b[0]).forEach(([k, e]) => {
    const li = el("li", "ev");
    const txt = el("span");
    txt.appendChild(el("span", "k", "Chunk " + (k + 1)));
    txt.appendChild(document.createTextNode(e.text));
    li.append(el("span", "sq"), txt);
    ul.appendChild(li);
    capLines.set(k, li);
  });
  const idle = el("li");
  idle.append(el("span", "sq"), el("span", null, "Nothing happens."));
  ul.appendChild(idle);
  box.appendChild(ul);
  const nowText = el("div", "now-text", "");
  box.appendChild(nowText);

  let cur = -1;
  const update = (t) => {
    let k = 0;
    while (k + 1 < n && t >= chunkStart(k + 1, d.segFrames)) k++;
    if (k === cur) return;
    cur = k;
    cells.forEach((c, i) => c.classList.toggle("now", i === k));
    capLines.forEach((li, i) => li.classList.toggle("now", i === k));
    idle.classList.toggle("now", !capLines.has(k));
    nowText.textContent = "Now in chunk " + (k + 1) + " of " + n;
  };
  update(0);
  return { el: box, update };
};

/* ---------- Synchronized players ---------- */

/* One synchronized player per case. The Oneira video is the clock and the others follow it by time. */
class SyncGroup {
  constructor(root, caseDef) {
    this.root = root;
    this.def = caseDef;
    this.videos = [];
    this.loaded = false;
    this.wantPlay = false;
    this.userPaused = REDUCED;
    this.loop = true;
    this.raf = null;
    this.build();
  }

  makeVideoTile(v, cls) {
    const tile = el("div", "tile" + (cls ? " " + cls : ""));
    const vid = document.createElement("video");
    vid.muted = true;
    vid.playsInline = true;
    vid.setAttribute("playsinline", "");
    vid.preload = "none";
    vid.dataset.src = v.src;
    vid.dataset.poster = posterFor(v.src);
    vid.title = "Click to play or pause, double-click to enlarge";
    /* A short delay keeps the two clicks of a double-click from toggling playback. */
    let clickTimer = null;
    vid.addEventListener("click", () => {
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => this.toggle(true), 230);
    });
    vid.addEventListener("dblclick", () => {
      clearTimeout(clickTimer);
      Lightbox.openVideo(this, v);
    });
    vid.addEventListener("loadedmetadata", () => this.onMeta());
    vid.addEventListener("error", () => {
      /* A missing file drops out of the case, so an input that is not ready yet leaves no empty box. */
      if (!vid.getAttribute("src")) return;
      tile.classList.add("gone");
      this.videos = this.videos.filter((x) => x !== vid);
    });
    vid.addEventListener("waiting", () => this.setStatus("Buffering…"));
    vid.addEventListener("canplay", () => this.setStatus(""));
    tile.append(vid, el("div", "label", v.label));
    return { tile, vid };
  }

  buildCaptions() {
    this.panel = chunkPanel(this.def, (t) => { this.pause(); this.userPaused = true; this.seek(t); });
    return this.panel.el;
  }

  build() {
    const d = this.def;
    this.root.appendChild(el("h4", null, d.title));
    this.root.appendChild(el("p", "desc", d.desc));
    const chk = el("p", "check");
    chk.appendChild(el("b", null, "What to look for. "));
    chk.appendChild(document.createTextNode(d.check));
    this.root.appendChild(chk);

    let firstTile = null;
    if (d.first) {
      const t = el("div", "tile");
      const img = document.createElement("img");
      img.alt = "First frame";
      img.dataset.src = d.first;
      img.addEventListener("error", () => { if (img.getAttribute("src")) t.classList.add("gone"); });
      img.title = "Double-click to enlarge";
      img.addEventListener("dblclick", () => Lightbox.openImage(d.first, "First frame"));
      t.append(img, el("div", "label", "First frame"));
      firstTile = t;
      this.firstImg = img;
    }
    let condVid = null, condTile = null;
    if (d.cond) {
      const { tile, vid } = this.makeVideoTile({ src: d.cond, label: "Conditioning video" });
      condTile = tile;
      condVid = vid;
    }
    const caps = d.events ? this.buildCaptions() : null;
    const genTiles = d.videos.map((v) => {
      const { tile, vid } = this.makeVideoTile(v, v.ours ? "ours" : "");
      this.videos.push(vid);
      return tile;
    });

    if (d.videos.length === 1) {
      /* A case without baselines fits in one row. The left cell puts the generated video next to its
         two inputs and the right cell holds the chunk captions. */
      const row = el("div", "solo");
      const combo = el("div", "combo");
      genTiles[0].classList.add("main");
      combo.appendChild(genTiles[0]);
      if (firstTile) combo.appendChild(firstTile);
      if (condTile) combo.appendChild(condTile);
      row.appendChild(combo);
      if (caps) row.appendChild(caps);
      this.root.appendChild(row);
    } else {
      /* Row 1, the inputs. */
      this.root.appendChild(el("div", "rowlab", "Inputs"));
      const inputs = el("div", "grid inputs");
      [firstTile, condTile, caps].forEach((x) => x && inputs.appendChild(x));
      this.root.appendChild(inputs);

      /* Row 2, one column per generated video. */
      this.root.appendChild(el("div", "rowlab", "Generated videos"));
      const gen = el("div", "grid gen");
      gen.style.setProperty("--n", Math.max(3, d.videos.length));
      genTiles.forEach((t) => gen.appendChild(t));
      this.root.appendChild(gen);
    }
    this.master = this.videos[0];
    if (condVid) this.videos.push(condVid);
    this.master.addEventListener("ended", () => this.onEnded());

    const bar = el("div", "controls");
    this.btn = el("button", "play", "Play");
    this.btn.type = "button";
    this.btn.addEventListener("click", () => this.toggle(true));
    const back = el("button", null, "◀ frame");
    back.type = "button";
    back.title = "Step back one frame";
    back.addEventListener("click", () => this.step(-1));
    const fwd = el("button", null, "frame ▶");
    fwd.type = "button";
    fwd.title = "Step forward one frame";
    fwd.addEventListener("click", () => this.step(1));

    const scrub = el("div", "scrub");
    this.range = document.createElement("input");
    this.range.type = "range";
    this.range.min = 0;
    this.range.max = 1;
    this.range.step = 0.001;
    this.range.value = 0;
    this.range.setAttribute("aria-label", "Seek");
    this.range.addEventListener("input", () => this.seek(parseFloat(this.range.value)));
    scrub.appendChild(this.range);

    this.time = el("span", "time", "0:00.00 / 0:00.00");

    const speedLab = el("label", null, "Speed");
    this.speed = document.createElement("select");
    [["0.25", "0.25×"], ["0.5", "0.5×"], ["1", "1×"]].forEach(([v, t]) => {
      const o = document.createElement("option");
      o.value = v; o.textContent = t;
      if (v === "1") o.selected = true;
      this.speed.appendChild(o);
    });
    this.speed.addEventListener("change", () => this.videos.forEach((v) => (v.playbackRate = parseFloat(this.speed.value))));
    speedLab.appendChild(this.speed);

    const loopLab = el("label", null, "");
    const loop = document.createElement("input");
    loop.type = "checkbox";
    loop.checked = true;
    loop.addEventListener("change", () => (this.loop = loop.checked));
    loopLab.append(loop, document.createTextNode("Loop"));

    this.status = el("span", "status", "");
    bar.append(this.btn, back, fwd, scrub, this.time, speedLab, loopLab, this.status);
    this.root.appendChild(bar);
    this.updateChunk(0);
  }

  setStatus(s) { if (this.status) this.status.textContent = s; }

  /* Posters and the first frame, fetched when the case comes near the screen. */
  prime() {
    if (this.firstImg && !this.firstImg.getAttribute("src")) this.firstImg.src = this.firstImg.dataset.src;
    this.videos.forEach((v) => { if (v.dataset.poster && !v.getAttribute("poster")) v.poster = v.dataset.poster; });
  }

  load() {
    if (this.loaded) return;
    this.loaded = true;
    this.prime();
    this.videos.forEach((v) => {
      if (!v.dataset.src) return;
      v.preload = "auto";
      v.src = v.dataset.src;
      v.load();
    });
  }

  unload() {
    this.pause();
    this.loaded = false;
    this.videos.forEach((v) => { v.removeAttribute("src"); v.load(); });
  }

  onMeta() {
    const dur = this.master.duration;
    if (!isFinite(dur)) return;
    this.range.max = dur;
    this.updateTime();
  }

  /* byUser marks a click or key press, which the automatic playback on scroll then respects. */
  toggle(byUser) {
    if (this.wantPlay) {
      this.pause();
      if (byUser) this.userPaused = true;
    } else {
      if (byUser) this.userPaused = false;
      this.play();
    }
  }

  /* Called when the case enters or leaves the middle of the screen. */
  setVisible(v) {
    if (v) {
      this.load();
      if (!this.userPaused && !this.wantPlay) this.play();
    } else if (this.wantPlay) {
      this.pause();
    }
  }

  play() {
    this.load();
    this.wantPlay = true;
    this.btn.textContent = "Pause";
    if (this.master.ended || this.master.currentTime >= this.master.duration - 0.02) this.seek(0);
    this.videos.forEach((v) => v.play().catch((e) => this.onPlayError(e)));
    this.tick();
  }

  /* A browser in power-saving mode can refuse to start muted videos on its own. The Play button still works. */
  onPlayError(e) {
    if (e && e.name === "NotAllowedError" && this.wantPlay) this.pause();
  }

  pause() {
    this.wantPlay = false;
    if (this.btn) this.btn.textContent = "Play";
    this.videos.forEach((v) => v.pause());
    cancelAnimationFrame(this.raf);
    this.raf = null;
  }

  seek(t) {
    this.load();
    this.videos.forEach((v) => {
      const d = isFinite(v.duration) ? v.duration : t;
      v.currentTime = Math.max(0, Math.min(t, d - 0.01));
    });
    this.updateTime(t);
  }

  step(dir) {
    this.pause();
    this.userPaused = true;
    this.seek(Math.max(0, this.master.currentTime + dir / FPS));
  }

  onEnded() {
    if (this.wantPlay && this.loop) {
      this.seek(0);
      this.videos.forEach((v) => v.play().catch(() => {}));
    } else {
      this.pause();
    }
  }

  updateChunk(t) {
    if (this.panel) this.panel.update(t);
  }

  updateTime(t) {
    const cur = t != null ? t : this.master.currentTime;
    this.range.value = cur;
    this.time.textContent = fmt(cur) + " / " + fmt(this.master.duration);
    this.updateChunk(cur);
  }

  tick() {
    cancelAnimationFrame(this.raf);
    const loopFn = () => {
      if (!this.wantPlay) return;
      const stalled = this.videos.some((v) => v.readyState < 3 && !v.ended && v.currentTime < v.duration - 0.05);
      if (stalled) {
        if (!this.master.paused) this.videos.forEach((v) => v.pause());
      } else if (this.master.paused && !this.master.ended) {
        this.videos.forEach((v) => { if (v.currentTime < v.duration - 0.05) v.play().catch(() => {}); });
      }
      const t = this.master.currentTime;
      for (const v of this.videos) {
        if (v === this.master || !isFinite(v.duration)) continue;
        const target = Math.min(t, v.duration - 0.01);
        if (t >= v.duration - 0.05) {
          if (!v.paused) v.pause();
        } else {
          if (v.paused && !this.master.paused) v.play().catch(() => {});
          if (Math.abs(v.currentTime - target) > 0.12) v.currentTime = target;
        }
      }
      this.updateTime();
      this.raf = requestAnimationFrame(loopFn);
    };
    this.raf = requestAnimationFrame(loopFn);
  }
}

/* Large view opened by a double-click. The video in it joins the sync group of its case, so it keeps
   the same clock and the same controls, and it leaves the group again when the view closes. */
const Lightbox = (() => {
  const box = el("div", "lightbox");
  box.hidden = true;
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  const frame = el("div", "frame");
  const bar = el("div", "bar");
  const left = el("div");
  const name = el("div", "name", "");
  const hint = el("div", "hint", "");
  left.append(name, hint);
  const close = el("button", "close", "×");
  close.type = "button";
  close.setAttribute("aria-label", "Close");
  bar.append(left, close);
  const slot = el("div");
  frame.append(bar, slot);
  box.appendChild(frame);
  document.body.appendChild(box);

  const api = { group: null, media: null };

  api.isOpen = () => !box.hidden;

  api.close = () => {
    if (box.hidden) return;
    const m = api.media;
    if (m && m.tagName === "VIDEO" && api.group) {
      api.group.videos = api.group.videos.filter((x) => x !== m);
      m.pause();
      m.removeAttribute("src");
      m.load();
    }
    slot.replaceChildren();
    api.media = null;
    api.group = null;
    box.hidden = true;
    document.body.style.overflow = "";
  };

  const show = (media, label, tip) => {
    api.close();
    name.textContent = label;
    hint.textContent = tip;
    slot.appendChild(media);
    api.media = media;
    box.hidden = false;
    document.body.style.overflow = "hidden";
    close.focus({ preventScroll: true });
  };

  api.openVideo = (group, v) => {
    const vid = document.createElement("video");
    vid.muted = true;
    vid.playsInline = true;
    vid.setAttribute("playsinline", "");
    vid.preload = "auto";
    vid.playbackRate = parseFloat(group.speed.value);
    vid.addEventListener("click", () => group.toggle(true));
    vid.addEventListener("loadedmetadata", () => {
      vid.currentTime = Math.min(group.master.currentTime, vid.duration - 0.01);
      if (group.wantPlay) vid.play().catch(() => {});
    });
    show(vid, v.label, "Click or press space to play or pause. Press Esc to close.");
    api.group = group;
    group.load();
    vid.src = v.src;
    group.videos.push(vid);
  };

  api.openImage = (src, label) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = label;
    show(img, label, "Press Esc to close.");
  };

  close.addEventListener("click", api.close);
  box.addEventListener("click", (e) => { if (e.target === box) api.close(); });
  return api;
})();

/* ---------- Result sections ---------- */

const groups = {};
const selectors = {};
const blocksRoot = document.getElementById("blocks");
const blockStates = [];

if (blocksRoot && typeof CASES !== "undefined") {
  const bandObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => { const st = e.target._state; st.inBand = e.isIntersecting; st.active.setVisible(e.isIntersecting); });
  }, { rootMargin: BAND });
  const nearObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) e.target._state.active.prime(); });
  }, { rootMargin: "800px 0px" });

  BLOCKS.forEach((b) => {
    const sec = el("div", "block");
    sec.id = b.id;
    sec.appendChild(el("h3", null, b.title));
    sec.appendChild(el("p", "blead", b.lead));

    const tabs = el("div", "tabs");
    tabs.setAttribute("role", "tablist");
    tabs.setAttribute("aria-label", b.title);
    sec.appendChild(tabs);
    const cases = CASES.filter((c) => c.block === b.id);
    const entries = [];
    const state = { active: null, inBand: false };
    cases.forEach((c, i) => {
      const btn = el("button", null, (i + 1) + ". " + c.tab);
      btn.type = "button";
      btn.id = "tab-" + c.id;
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", i === 0 ? "true" : "false");
      btn.setAttribute("aria-controls", "case-" + c.id);
      tabs.appendChild(btn);
      const panel = el("div", "case");
      panel.id = "case-" + c.id;
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-labelledby", btn.id);
      if (i !== 0) panel.hidden = true;
      sec.appendChild(panel);
      groups[c.id] = new SyncGroup(panel, c);
      entries.push({ btn, panel, id: c.id });
      btn.addEventListener("click", () => selectors[c.id]());
    });
    entries.forEach(({ id }) => {
      selectors[id] = () => {
        entries.forEach((p) => {
          const on = p.id === id;
          p.btn.setAttribute("aria-selected", on ? "true" : "false");
          p.panel.hidden = !on;
          if (!on) groups[p.id].unload();
        });
        const g = groups[id];
        if (state.active !== g) g.userPaused = REDUCED;
        state.active = g;
        g.prime();
        g.setVisible(inBand(sec));
      };
    });
    state.active = groups[cases[0].id];
    sec._state = state;
    blockStates.push(state);
    blocksRoot.appendChild(sec);
    bandObs.observe(sec);
    nearObs.observe(sec);
  });
}

/* Links such as #case-lh1 open that case and scroll to its section. */
const openCase = (id) => {
  if (!selectors[id]) return false;
  selectors[id]();
  const sec = document.getElementById("case-" + id).closest(".block");
  sec.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "start" });
  return true;
};
document.addEventListener("click", (e) => {
  const a = e.target.closest("a[data-case]");
  if (!a || !openCase(a.dataset.case)) return;
  e.preventDefault();
  history.replaceState(null, "", "#case-" + a.dataset.case);
});
const hashCase = location.hash.match(/^#case-([a-z0-9]+)$/);
if (hashCase) openCase(hashCase[1]);

/* ---------- Highlight carousel at the top ---------- */

const PLAY_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>';
const PAUSE_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor"/></svg>';

/* The centre slide plays from its start and the carousel moves on when it ends. A swipe, a mouse drag,
   the arrows, the dots and the arrow keys each move it by one slide. */
const Carousel = (() => {
  const root = document.getElementById("reel");
  const track = document.getElementById("reel-track");
  const dotsBox = document.getElementById("reel-dots");
  if (!root || !track || !dotsBox) return null;
  const slides = [...track.querySelectorAll(".slide")];
  const n = slides.length;
  let current = -1, inView = false, userPaused = REDUCED;
  let settleTimer = null, markRaf = null, drag = null, suppressClick = false;

  /* One dot per slide. The dot of the playing slide fills as its video plays. */
  const dots = slides.map((s, i) => {
    const b = el("button", "dot");
    b.type = "button";
    b.setAttribute("role", "tab");
    b.setAttribute("aria-label", (i + 1) + ". " + s.querySelector("h3").textContent);
    const bar = el("span", "bar");
    const fill = el("span", "fill");
    bar.appendChild(fill);
    b.appendChild(bar);
    b.addEventListener("click", () => go(i));
    dotsBox.appendChild(b);
    return { b, fill };
  });

  /* One controller per slide. The inset follows the main video within a few frames. */
  const ctl = slides.map((slide, i) => {
    const media = slide.querySelector(".reel-media");
    const main = media.querySelector("video.main");
    const inset = media.querySelector("video.inset");
    const btn = el("button", "playbtn");
    btn.type = "button";
    media.appendChild(btn);
    /* Chunk captions of the same case as in the Results section, which the slide links to. */
    const link = slide.querySelector("a[data-case]");
    const def = link && typeof CASES !== "undefined" ? CASES.find((c) => c.id === link.dataset.case) : null;
    const panel = def ? chunkPanel(def, (t) => { main.currentTime = t; }) : null;
    if (panel) link.before(panel.el);
    let loaded = false, raf = null;
    const icon = () => {
      btn.innerHTML = main.paused ? PLAY_ICON : PAUSE_ICON;
      btn.setAttribute("aria-label", main.paused ? "Play" : "Pause");
    };
    const follow = () => {
      if (isFinite(inset.duration)) inset.currentTime = Math.min(main.currentTime, inset.duration - 0.01);
    };
    const frame = () => {
      if (main.paused) { raf = null; return; }
      if (Math.abs(inset.currentTime - main.currentTime) > 0.12) follow();
      if (inset.paused && !inset.ended) inset.play().catch(() => {});
      if (i === current && main.duration) dots[i].fill.style.width = (100 * main.currentTime / main.duration).toFixed(2) + "%";
      if (panel) panel.update(main.currentTime);
      raf = requestAnimationFrame(frame);
    };
    const api = {
      load() {
        if (loaded) return;
        loaded = true;
        [main, inset].forEach((v) => { v.preload = "auto"; v.src = v.dataset.src; v.load(); });
      },
      play() { api.load(); main.play().catch(() => icon()); },
      pause() { if (!main.paused) main.pause(); },
      rewind() { main.currentTime = 0; inset.currentTime = 0; },
    };
    main.addEventListener("play", () => { inset.play().catch(() => {}); if (!raf) raf = requestAnimationFrame(frame); icon(); });
    /* Fetch the next slide while this one plays, so the move to it starts at once. */
    main.addEventListener("playing", () => ctl[(i + 1) % n].load());
    main.addEventListener("pause", () => { inset.pause(); icon(); });
    main.addEventListener("seeked", follow);
    if (panel) main.addEventListener("timeupdate", () => panel.update(main.currentTime));
    main.addEventListener("ended", () => {
      if (i !== current) return;
      dots[i].fill.style.width = "100%";
      if (inView && !userPaused && !REDUCED) go(i + 1);
    });
    const toggle = () => {
      if (i !== current) return;
      if (main.paused) { userPaused = false; api.play(); }
      else { userPaused = true; api.pause(); }
    };
    main.addEventListener("click", toggle);
    btn.addEventListener("click", toggle);
    /* A click on a side slide brings it to the centre. */
    slide.addEventListener("click", (e) => {
      if (i !== current && !e.target.closest("a")) { e.preventDefault(); go(i); }
    });
    icon();
    return api;
  });

  const slideLeft = (i) => slides[i].offsetLeft - (track.clientWidth - slides[i].offsetWidth) / 2;
  const nearest = () => {
    const mid = track.scrollLeft + track.clientWidth / 2;
    let best = 0, bestDist = Infinity;
    slides.forEach((s, j) => {
      const d = Math.abs(s.offsetLeft + s.offsetWidth / 2 - mid);
      if (d < bestDist) { bestDist = d; best = j; }
    });
    return best;
  };
  const mark = (i) => slides.forEach((s, j) => s.classList.toggle("is-active", j === i));

  const activate = (i) => {
    mark(i);
    dots.forEach((d, j) => d.b.setAttribute("aria-selected", j === i ? "true" : "false"));
    if (i === current) return;
    if (current >= 0) { ctl[current].pause(); dots[current].fill.style.width = "0%"; }
    current = i;
    dots[i].fill.style.width = "0%";
    ctl[i].rewind();
    if (inView && !userPaused) ctl[i].play();
  };

  /* Moving to another slide counts as asking to watch it, so it plays even after a pause. */
  const go = (i) => {
    i = ((i % n) + n) % n;
    userPaused = REDUCED;
    track.scrollTo({ left: slideLeft(i), behavior: REDUCED ? "auto" : "smooth" });
    activate(i);
  };

  /* The highlight follows the scroll, and playback switches once the scroll comes to rest. */
  track.addEventListener("scroll", () => {
    if (!markRaf) markRaf = requestAnimationFrame(() => { markRaf = null; mark(nearest()); });
    clearTimeout(settleTimer);
    settleTimer = setTimeout(() => {
      if (drag) return;
      track.classList.remove("free");
      const i = nearest();
      if (i !== current) userPaused = REDUCED;
      activate(i);
    }, 140);
  }, { passive: true });

  /* Mouse drag. Touch screens and trackpads scroll the track natively. */
  track.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    drag = { x: e.clientX, left: track.scrollLeft, moved: false, id: e.pointerId, from: current };
  });
  track.addEventListener("pointermove", (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x;
    if (!drag.moved) {
      if (Math.abs(dx) < 6) return;
      drag.moved = true;
      track.setPointerCapture(e.pointerId);
      track.classList.add("free");
    }
    track.scrollLeft = drag.left - dx;
  });
  const endDrag = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const { moved, from, x } = drag;
    drag = null;
    if (!moved) return;
    suppressClick = true;
    setTimeout(() => { suppressClick = false; }, 0);
    const dx = e.type === "pointercancel" ? 0 : e.clientX - x;
    const target = Math.abs(dx) > 50 ? from + (dx < 0 ? 1 : -1) : nearest();
    go(Math.max(0, Math.min(n - 1, target)));
  };
  track.addEventListener("pointerup", endDrag);
  track.addEventListener("pointercancel", endDrag);
  track.addEventListener("click", (e) => { if (suppressClick) { e.preventDefault(); e.stopPropagation(); } }, true);
  track.addEventListener("dragstart", (e) => e.preventDefault());

  const onKey = (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(current + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(current - 1); }
  };
  track.addEventListener("keydown", onKey);
  dotsBox.addEventListener("keydown", onKey);
  root.querySelector(".car-nav.prev").addEventListener("click", () => go(current - 1));
  root.querySelector(".car-nav.next").addEventListener("click", () => go(current + 1));
  window.addEventListener("resize", () => { if (current >= 0) track.scrollTo({ left: slideLeft(current), behavior: "auto" }); });

  new IntersectionObserver(([e]) => {
    inView = e.isIntersecting;
    if (!inView) ctl[current].pause();
    else if (!userPaused) ctl[current].play();
  }, { threshold: 0.35 }).observe(track);

  activate(0);
  return {
    pause() { ctl[current].pause(); },
    resume() {
      const r = track.getBoundingClientRect();
      inView = r.bottom > 0 && r.top < window.innerHeight;
      if (inView && !userPaused) ctl[current].play();
    },
  };
})();

/* Pause everything while the browser tab is in the background, and resume what is on screen after. */
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    Object.values(groups).forEach((g) => { if (g.wantPlay) g.pause(); });
    if (Carousel) Carousel.pause();
  } else {
    blockStates.forEach((s) => s.active.setVisible(s.inBand));
    if (Carousel) Carousel.resume();
  }
});

/* Space bar plays or pauses the open large view, or else the case closest to the middle of the screen. */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && Lightbox.isOpen()) { Lightbox.close(); return; }
  if (e.code !== "Space" || /^(INPUT|SELECT|BUTTON|TEXTAREA|A)$/.test(document.activeElement.tagName)) return;
  if (Lightbox.isOpen()) {
    e.preventDefault();
    if (Lightbox.group) Lightbox.group.toggle(true);
    return;
  }
  let best = null, bestDist = Infinity;
  Object.values(groups).forEach((g) => {
    if (g.root.hidden) return;
    const r = g.root.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    const dist = Math.abs(r.top + r.height / 2 - window.innerHeight / 2);
    if (dist < bestDist) { bestDist = dist; best = g; }
  });
  if (best) { e.preventDefault(); best.toggle(true); }
});

/* ---------- Top bar ---------- */

const topbar = document.getElementById("topbar");
const title = document.getElementById("title");
if (topbar && title) {
  new IntersectionObserver(([e]) => topbar.classList.toggle("show", !e.isIntersecting && e.boundingClientRect.top < 0))
    .observe(title);
  const links = [...document.querySelectorAll("#topnav a")];
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  links.forEach((a) => { const s = document.querySelector(a.getAttribute("href")); if (s) spy.observe(s); });
}

/* ---------- Tabs of the quantitative results ---------- */

document.querySelectorAll("[data-tabs]").forEach((root) => {
  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const select = (t, focus) => {
    tabs.forEach((x) => {
      const on = x === t;
      x.setAttribute("aria-selected", on ? "true" : "false");
      x.tabIndex = on ? 0 : -1;
      document.getElementById(x.getAttribute("aria-controls")).hidden = !on;
    });
    if (focus) t.focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => select(t));
    t.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      select(tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length], true);
    });
  });
});

/* ---------- BibTeX ---------- */

const copyBtn = document.getElementById("copybib");
const bib = document.getElementById("bibtext");
if (copyBtn && bib) {
  copyBtn.addEventListener("click", async () => {
    const text = bib.textContent;
    let ok = false;
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch (err) {
      const r = document.createRange();
      r.selectNodeContents(bib);
      const s = window.getSelection();
      s.removeAllRanges();
      s.addRange(r);
      ok = document.execCommand && document.execCommand("copy");
    }
    copyBtn.textContent = ok ? "Copied" : "Press Ctrl+C";
    setTimeout(() => { copyBtn.textContent = "Copy"; }, 1600);
  });
}
})();
