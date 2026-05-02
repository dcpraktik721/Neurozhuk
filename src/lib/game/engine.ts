// ========================================
// Поймай Жука — Game Engine
// ========================================
// Pure canvas game engine — no React dependency.
// Mechanics match bug-game-with-music.html exactly.

import type { Enemy, GameMode, GameState, GameSession, GameConfig, DifficultyMode } from '@/types';
import type { GameCallbacks } from '@/types';
import { getRank } from '@/types';
import { getEquationsForLevel, pickRandomEquation } from './equations';
import { getKavashimaEquationsForLevel } from './kavashima-equations';

export type { GameCallbacks };

// ── Helpers ──

let _idCounter = 0;
function uid(): string {
  return `e${++_idCounter}_${Date.now().toString(36)}`;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

// ── Particle System ──

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

// ── Default Config ──

const DEFAULT_CONFIG: GameConfig = {
  canvasWidth: 800,
  canvasHeight: 800,
  enemyCount: 3,   // 3 left + 3 right = 6 total at start
  timedDuration: 300,
  playerSpeed: 6,
  playerSize: 48,
  enemySize: 44,
};

// ── Engine ──

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private config: GameConfig;
  private callbacks: GameCallbacks;

  // Game state
  private state: GameState = 'idle';
  private mode: GameMode = 'normal';
  private difficultyMode: DifficultyMode = 'easy';
  private score = 0;
  private bestScore = 0;
  private correctAnswers = 0;
  private totalAttempts = 0;
  private streak = 0;
  private maxStreak = 0;
  private gameTime = 0;
  private timeRemaining = 300;
  private startTimestamp = 0;

  // Level system
  private level = 1;
  private levelProgress = 0;
  private levelTarget = 10;

  // Combo system
  private combo = 0;
  private maxCombo = 0;

  // Accuracy tracking
  private totalCorrect = 0;
  private totalWrong = 0;
  private recentErrors: boolean[] = [];

  // Current equation
  private currentEquation = '';
  private currentAnswer = 0;

  // Player
  private playerX = 0;
  private playerY = 0;
  private playerVX = 0;
  private playerVY = 0;
  private readonly playerAccel = 0.8;
  private readonly playerFriction = 0.85;

  // Input
  private keys: Set<string> = new Set();
  private touchDir: { x: number; y: number } = { x: 0, y: 0 };

  // Enemies
  private enemies: Enemy[] = [];

  // Particles
  private particles: Particle[] = [];

  // Scaling
  private scale = 1;

  // Animation
  private rafId = 0;
  private lastTime = 0;
  private timerAccumulator = 0;
  private frameCount = 0;
  private collisionCooldownMs = 0;
  private readonly wrongCollisionCooldownMs = 350;
  private readonly correctCollisionCooldownMs = 120;

  // Bound handlers
  private _onKeyDown: (e: KeyboardEvent) => void;
  private _onKeyUp: (e: KeyboardEvent) => void;
  private _onResize: () => void;

  constructor(
    canvas: HTMLCanvasElement,
    config: Partial<GameConfig> = {},
    callbacks: GameCallbacks = {},
  ) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Cannot get 2d context');
    this.ctx = ctx;
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.callbacks = callbacks;

    // Load best score from localStorage
    try {
      const stored = localStorage.getItem('neurozhuk_highscore');
      if (stored) this.bestScore = parseInt(stored, 10) || 0;
    } catch {
      // localStorage not available
    }

    // Center player
    this.playerX = this.config.canvasWidth / 2 - this.config.playerSize / 2;
    this.playerY = this.config.canvasHeight / 2 - this.config.playerSize / 2;

    // Bind handlers
    this._onKeyDown = this.handleKeyDown.bind(this);
    this._onKeyUp = this.handleKeyUp.bind(this);
    this._onResize = this.handleResize.bind(this);

    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup', this._onKeyUp);
    window.addEventListener('resize', this._onResize);

    this.handleResize();
    this.drawIdleScreen();
  }

  // ── Public API ──

  start(mode: GameMode = 'normal', difficultyMode: DifficultyMode = 'easy'): void {
    this.mode = mode;
    this.difficultyMode = difficultyMode;

    // Reset stats
    this.score = 0;
    this.correctAnswers = 0;
    this.totalAttempts = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.gameTime = 0;
    this.timeRemaining = this.config.timedDuration;
    this.timerAccumulator = 0;
    this.startTimestamp = Date.now();
    this.particles = [];
    this.frameCount = 0;
    this.collisionCooldownMs = 0;
    this.keys.clear();
    this.touchDir = { x: 0, y: 0 };

    // Level / combo reset
    this.level = 1;
    this.levelProgress = 0;
    this.levelTarget = 10;
    this.combo = 0;
    this.maxCombo = 0;
    this.totalCorrect = 0;
    this.totalWrong = 0;
    this.recentErrors = [];

    // Reset player
    this.playerX = this.config.canvasWidth / 2 - this.config.playerSize / 2;
    this.playerY = this.config.canvasHeight / 2 - this.config.playerSize / 2;
    this.playerVX = 0;
    this.playerVY = 0;

    // Pick first equation
    this.nextEquation();

    // Spawn enemies
    this.enemies = [];
    for (let i = 0; i < this.config.enemyCount; i++) {
      this.enemies.push(this.createEnemy(true, false));
      this.enemies.push(this.createEnemy(false, false));
    }
    this.ensureCorrectEnemy();

    this.setState('playing');
    this.callbacks.onScoreChange?.(0);
    this.callbacks.onAccuracyChange?.(100);
    this.callbacks.onStreakChange?.(0);
    this.callbacks.onTimeChange?.(mode === 'timed' ? this.timeRemaining : 0);
    this.callbacks.onLevelChange?.(this.level, this.levelProgress, this.levelTarget);
    this.callbacks.onComboChange?.(0);
    this.callbacks.onTotalsChange?.(0, 0);

    this.lastTime = performance.now();
    cancelAnimationFrame(this.rafId);
    this.loop(this.lastTime);
  }

  pause(): void {
    if (this.state !== 'playing') return;
    this.setState('paused');
  }

  resume(): void {
    if (this.state !== 'paused') return;
    this.setState('playing');
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  reset(): void {
    cancelAnimationFrame(this.rafId);
    this.keys.clear();
    this.touchDir = { x: 0, y: 0 };
    this.enemies = [];
    this.particles = [];
    this.collisionCooldownMs = 0;
    this.playerVX = 0;
    this.playerVY = 0;
    this.playerX = this.config.canvasWidth / 2 - this.config.playerSize / 2;
    this.playerY = this.config.canvasHeight / 2 - this.config.playerSize / 2;
    this.setState('idle');
    this.drawIdleScreen();
  }

  /**
   * Finish the current session early. Works for `normal` and `practice`
   * modes (where no timer auto-ends the game) and as an early-quit for
   * `timed` mode. Emits the `onGameEnd` callback with a built `GameSession`.
   */
  finish(): void {
    if (this.state !== 'playing' && this.state !== 'paused') return;
    this.endGame();
  }

  destroy(): void {
    cancelAnimationFrame(this.rafId);
    this.keys.clear();
    this.touchDir = { x: 0, y: 0 };
    this.collisionCooldownMs = 0;
    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('keyup', this._onKeyUp);
    window.removeEventListener('resize', this._onResize);
  }

  setTouchDirection(x: number, y: number): void {
    this.touchDir = { x, y };
  }

  setDifficultyMode(mode: DifficultyMode): void {
    this.difficultyMode = mode;
    this.callbacks.onDifficultyModeChange?.(mode);
  }

  getState(): GameState { return this.state; }
  getScore(): number { return this.score; }
  getBestScore(): number { return this.bestScore; }
  setBestScore(v: number): void { this.bestScore = v; }
  getMode(): GameMode { return this.mode; }
  getLevel(): number { return this.level; }
  getCombo(): number { return this.combo; }

  getTime(): number {
    return this.mode === 'timed' ? this.timeRemaining : this.gameTime;
  }

  getAccuracy(): number {
    return this.totalAttempts === 0 ? 100 : Math.round((this.correctAnswers / this.totalAttempts) * 100);
  }

  getStreak(): number { return this.streak; }
  getEquation(): string { return this.currentEquation; }

  // ── Internal: state ──

  private setState(s: GameState): void {
    this.state = s;
    this.callbacks.onStateChange?.(s);
  }

  // ── Internal: equations ──

  private nextEquation(): void {
    const pool = this.mode === 'practice'
      ? getKavashimaEquationsForLevel(this.level)
      : getEquationsForLevel(this.level);
    const eq = pickRandomEquation(pool);
    this.currentEquation = eq.equation;
    this.currentAnswer = eq.answer;
    this.callbacks.onEquationChange?.(this.currentEquation, this.currentAnswer);
    // Update isTarget on all existing enemies
    for (const e of this.enemies) {
      e.isTarget = e.number === this.currentAnswer;
    }
  }

  // ── Internal: hint ──

  private shouldShowHint(): boolean {
    if (this.difficultyMode === 'normal') return false;
    if (this.level <= 2) return true;
    const total = this.totalCorrect + this.totalWrong;
    if (total < 10) return false;
    const accuracy = (this.totalCorrect / total) * 100;
    if (accuracy < 65) return true;
    if (this.recentErrors.length >= 5) {
      const recentWrong = this.recentErrors.slice(-5).filter((x) => x === false).length;
      if (recentWrong >= 3) return true;
    }
    return false;
  }

  // ── Internal: level system ──

  private handleLevelUp(): void {
    this.level++;
    this.levelProgress = 0;
    this.levelTarget = 10 + (this.level - 1) * 2;
    this.callbacks.onLevelChange?.(this.level, this.levelProgress, this.levelTarget);
    this.callbacks.onNotification?.(`🎉 Уровень ${this.level}! Скорость увеличена!`, '#A855F7');
  }

  // ── Internal: enemies ──

  private createEnemy(isLeft: boolean, isTarget: boolean): Enemy {
    const w = this.config.canvasWidth;
    const h = this.config.canvasHeight;
    const sz = this.config.enemySize;
    const num = isTarget ? this.currentAnswer : this.randomWrongNumber();
    const minDist = 110;

    // left-враги стартуют у ВЕРХА (y: 0–200), двигаются вниз (direction=1)
    // right-враги стартуют у НИЗА (y: h-200 до h), двигаются вверх (direction=-1)
    // Зона спавна увеличена до 200px для надёжного размещения без стека
    const spawnZone = 200;

    // Безопасная зона вокруг игрока — только для противников с той же стороны
    // что и игрок (центр). Спавн-зоны у краёв естественно безопасны по вертикали.
    const playerCX = this.playerX + this.config.playerSize / 2;
    const playerCY = this.playerY + this.config.playerSize / 2;
    const safeRadius = 130;

    let x = 0;
    let y = 0;
    let attempts = 0;
    let valid = false;

    while (!valid && attempts < 50) {
      x = isLeft
        ? Math.random() * (w / 2 - sz)
        : w / 2 + Math.random() * (w / 2 - sz);
      y = isLeft
        ? Math.random() * spawnZone
        : h - spawnZone + Math.random() * spawnZone;

      valid = true;

      // Не спавнить рядом с игроком
      const dpx = (x + sz / 2) - playerCX;
      const dpy = (y + sz / 2) - playerCY;
      if (Math.sqrt(dpx * dpx + dpy * dpy) < safeRadius) {
        valid = false;
        attempts++;
        continue;
      }

      // Проверяем расстояние до других жуков
      for (const e of this.enemies) {
        const dx = (x + sz / 2) - (e.x + e.size / 2);
        const dy = (y + sz / 2) - (e.y + e.size / 2);
        if (Math.sqrt(dx * dx + dy * dy) < minDist) {
          valid = false;
          break;
        }
      }
      attempts++;
    }

    // Fallback: позиция у края
    if (!valid) {
      x = isLeft
        ? Math.random() * (w / 2 - sz)
        : w / 2 + Math.random() * (w / 2 - sz);
      y = isLeft ? 0 : h - sz;
    }

    const speed = 1 + Math.random() * (this.level * 0.2);

    return {
      id: uid(),
      x,
      y,
      size: sz,
      speed,
      direction: isLeft ? 1 : -1, // left → вниз, right → вверх
      number: num,
      isTarget: num === this.currentAnswer,
    };
  }

  private randomWrongNumber(): number {
    let n: number;
    do {
      n = Math.floor(Math.random() * 99) + 1;
    } while (n === this.currentAnswer);
    return n;
  }

  private ensureCorrectEnemy(): void {
    if (!this.enemies.some((e) => e.number === this.currentAnswer)) {
      this.enemies.push(this.createEnemy(Math.random() < 0.5, true));
    }
    // Sync isTarget on all
    for (const e of this.enemies) {
      e.isTarget = e.number === this.currentAnswer;
    }
  }

  private ensureMinimumEnemies(): void {
    const w = this.config.canvasWidth;
    const left = this.enemies.filter((e) => e.x + e.size / 2 < w / 2);
    const right = this.enemies.filter((e) => e.x + e.size / 2 >= w / 2);
    while (left.length < 3) {
      const e = this.createEnemy(true, false);
      this.enemies.push(e);
      left.push(e);
    }
    while (right.length < 3) {
      const e = this.createEnemy(false, false);
      this.enemies.push(e);
      right.push(e);
    }
    this.ensureCorrectEnemy();
  }

  // ── Internal: anti-stacking ──

  private resolveEnemyCollisions(): void {
    const minDistance = 110;
    const count = this.enemies.length;
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const a = this.enemies[i];
        const b = this.enemies[j];
        const dx = (b.x + b.size / 2) - (a.x + a.size / 2);
        const dy = (b.y + b.size / 2) - (a.y + a.size / 2);
        const dist = Math.hypot(dx, dy);
        if (dist < minDistance && dist > 0) {
          const overlap = (minDistance - dist) / 2;
          const nx = dx / dist;
          const ny = dy / dist;
          a.x -= nx * overlap;
          a.y -= ny * overlap;
          b.x += nx * overlap;
          b.y += ny * overlap;
          // Clamp to canvas
          const w = this.config.canvasWidth;
          const h = this.config.canvasHeight;
          a.x = clamp(a.x, 0, w - a.size);
          a.y = clamp(a.y, 0, h - a.size);
          b.x = clamp(b.x, 0, w - b.size);
          b.y = clamp(b.y, 0, h - b.size);
        }
      }
    }
  }

  // ── Internal: input ──

  private handleKeyDown(e: KeyboardEvent): void {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }
    this.keys.add(e.key);
    if (e.key === ' ') {
      if (this.state === 'playing') this.pause();
      else if (this.state === 'paused') this.resume();
    }
  }

  private handleKeyUp(e: KeyboardEvent): void {
    this.keys.delete(e.key);
  }

  // ── Internal: resize ──

  handleResize(): void {
    const parent = this.canvas.parentElement;
    if (!parent) return;

    const containerW = parent.clientWidth;
    const containerH = parent.clientHeight || containerW;
    const aspect = this.config.canvasWidth / this.config.canvasHeight;

    let drawW: number;
    let drawH: number;
    if (containerW / containerH > aspect) {
      drawH = containerH;
      drawW = drawH * aspect;
    } else {
      drawW = containerW;
      drawH = drawW / aspect;
    }

    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = drawW * dpr;
    this.canvas.height = drawH * dpr;
    this.canvas.style.width = `${drawW}px`;
    this.canvas.style.height = `${drawH}px`;

    this.scale = (drawW * dpr) / this.config.canvasWidth;

    if (this.state === 'idle') {
      this.drawIdleScreen();
    }
  }

  // ── Internal: game loop ──

  private loop = (now: number): void => {
    if (this.state !== 'playing') return;

    const dt = Math.min(now - this.lastTime, 50);
    this.lastTime = now;
    this.frameCount++;

    // Timer
    this.timerAccumulator += dt;
    while (this.timerAccumulator >= 1000) {
      this.timerAccumulator -= 1000;
      if (this.mode === 'normal' || this.mode === 'practice') {
        this.gameTime++;
        this.callbacks.onTimeChange?.(this.gameTime);
      } else {
        this.timeRemaining--;
        this.callbacks.onTimeChange?.(this.timeRemaining);
        if (this.timeRemaining <= 0) {
          this.endGame();
          return;
        }
      }
    }

    this.update(dt);
    this.render();

    this.rafId = requestAnimationFrame(this.loop);
  };

  private update(dt: number): void {
    const dtFactor = dt / 16.667;
    this.collisionCooldownMs = Math.max(0, this.collisionCooldownMs - dt);

    // ── Player movement ──
    let ax = 0;
    let ay = 0;
    if (this.keys.has('ArrowLeft') || this.keys.has('a') || this.keys.has('A')) ax -= 1;
    if (this.keys.has('ArrowRight') || this.keys.has('d') || this.keys.has('D')) ax += 1;
    if (this.keys.has('ArrowUp') || this.keys.has('w') || this.keys.has('W')) ay -= 1;
    if (this.keys.has('ArrowDown') || this.keys.has('s') || this.keys.has('S')) ay += 1;

    if (this.touchDir.x !== 0 || this.touchDir.y !== 0) {
      ax = this.touchDir.x;
      ay = this.touchDir.y;
    }

    this.playerVX += ax * this.playerAccel * dtFactor;
    this.playerVY += ay * this.playerAccel * dtFactor;
    this.playerVX *= this.playerFriction;
    this.playerVY *= this.playerFriction;

    const maxV = this.config.playerSpeed;
    this.playerVX = clamp(this.playerVX, -maxV, maxV);
    this.playerVY = clamp(this.playerVY, -maxV, maxV);

    this.playerX += this.playerVX * dtFactor;
    this.playerY += this.playerVY * dtFactor;

    this.playerX = clamp(this.playerX, 0, this.config.canvasWidth - this.config.playerSize);
    this.playerY = clamp(this.playerY, 0, this.config.canvasHeight - this.config.playerSize);

    // ── Move enemies ──
    const h = this.config.canvasHeight;
    for (const e of this.enemies) {
      e.y += e.speed * e.direction * dtFactor;
      if (e.y <= 0 || e.y + e.size >= h) {
        e.direction *= -1;
        e.y = clamp(e.y, 0, h - e.size);
      }
    }

    // Anti-stacking every 3rd frame
    if (this.frameCount % 3 === 0) {
      this.resolveEnemyCollisions();
    }

    // ── Collision detection ──
    if (this.collisionCooldownMs === 0) {
      const ps = this.config.playerSize;
      for (let i = this.enemies.length - 1; i >= 0; i--) {
        const e = this.enemies[i];
        if (
          this.playerX < e.x + e.size &&
          this.playerX + ps > e.x &&
          this.playerY < e.y + e.size &&
          this.playerY + ps > e.y
        ) {
          this.totalAttempts++;

          if (e.number === this.currentAnswer) {
            // ── Correct catch ──
            this.combo++;
            if (this.combo > this.maxCombo) this.maxCombo = this.combo;
            this.streak++;
            if (this.streak > this.maxStreak) this.maxStreak = this.streak;

            const comboBonus = Math.floor(this.combo / 5) * 5;
            const points = 10 + comboBonus;
            this.score += points;
            this.correctAnswers++;
            this.totalCorrect++;
            this.collisionCooldownMs = this.correctCollisionCooldownMs;

            this.recentErrors.push(true);
            if (this.recentErrors.length > 10) this.recentErrors.shift();

            // Level progress
            this.levelProgress++;
            if (this.levelProgress >= this.levelTarget) {
              this.handleLevelUp();
            }

            // Spawn green particles
            this.spawnParticles(e.x + e.size / 2, e.y + e.size / 2, '#22C55E');

            // Remove caught enemy, spawn replacement
            this.enemies.splice(i, 1);

            // New equation
            this.nextEquation();
            this.ensureCorrectEnemy();

            // Save best score
            if (this.score > this.bestScore) {
              this.bestScore = this.score;
              try { localStorage.setItem('neurozhuk_highscore', String(this.bestScore)); } catch { /* ignore */ }
            }

            this.callbacks.onScoreChange?.(this.score);
            this.callbacks.onStreakChange?.(this.streak);
            this.callbacks.onComboChange?.(this.combo);
            this.callbacks.onTotalsChange?.(this.totalCorrect, this.totalWrong);
            this.callbacks.onLevelChange?.(this.level, this.levelProgress, this.levelTarget);

            const comboText = this.combo > 1 ? ` 🔥 Комбо: ${this.combo}` : '';
            this.callbacks.onNotification?.(`+${points} очков!${comboText}`, '#22C55E');

          } else {
            // ── Wrong catch — do NOT remove enemy ──
            this.combo = 0;
            this.streak = 0;
            this.totalWrong++;
            this.collisionCooldownMs = this.wrongCollisionCooldownMs;

            this.recentErrors.push(false);
            if (this.recentErrors.length > 10) this.recentErrors.shift();

            // Red particles at collision
            this.spawnParticles(e.x + e.size / 2, e.y + e.size / 2, '#EF4444');

            // Push player back hard enough to avoid repeated overlap on the next frame
            this.playerVX = (this.playerX + ps / 2 < e.x + e.size / 2 ? -1 : 1) * this.config.playerSpeed;
            this.playerVY = (this.playerY + ps / 2 < e.y + e.size / 2 ? -1 : 1) * this.config.playerSpeed;

            this.callbacks.onStreakChange?.(0);
            this.callbacks.onComboChange?.(0);
            this.callbacks.onTotalsChange?.(this.totalCorrect, this.totalWrong);
            this.callbacks.onNotification?.('Неверный ответ! Комбо сброшено ❌', '#EF4444');
          }

          this.callbacks.onAccuracyChange?.(this.getAccuracy());
          break;
        }
      }
    }

    // Maintain minimum enemy count
    this.ensureMinimumEnemies();

    // ── Update particles ──
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dtFactor;
      p.y += p.vy * dtFactor;
      p.vy += 0.1 * dtFactor;
      p.life -= dt;
      if (p.life <= 0) this.particles.splice(i, 1);
    }
  }

  private spawnParticles(x: number, y: number, color: string): void {
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12 + Math.random() * 0.3;
      const speed = 2 + Math.random() * 3;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 600 + Math.random() * 400,
        maxLife: 1000,
        size: 3 + Math.random() * 3,
        color,
      });
    }
  }

  // ── Internal: rendering ──

  private render(): void {
    const ctx = this.ctx;
    const w = this.config.canvasWidth;
    const h = this.config.canvasHeight;
    const showHint = this.shouldShowHint();

    ctx.save();
    ctx.scale(this.scale, this.scale);

    // Black background (matches original)
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, w, h);

    // Center divider — white semi-transparent solid line
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w / 2, h);
    ctx.stroke();

    // Enemies
    this.drawEnemies(showHint);

    // Player — green with glow always
    ctx.shadowBlur = 25;
    ctx.shadowColor = '#22C55E';
    this.drawBeetle(this.playerX, this.playerY, this.config.playerSize, '#22C55E', true);
    ctx.shadowBlur = 0;

    // Particles
    for (const p of this.particles) {
      const alpha = p.life / p.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    ctx.restore();
  }

  private drawEnemies(showHint: boolean): void {
    for (const e of this.enemies) {
      if (e.isTarget && showHint) {
        // Gold with glow for the target when hint is active
        this.drawBeetle(e.x, e.y, e.size, '#FFD700', false, true);
      } else {
        // All enemies are yellow, no glow
        this.drawBeetle(e.x, e.y, e.size, '#FFEB3B', false, false);
      }
      // Draw number label
      const ctx = this.ctx;
      const cx = e.x + e.size / 2;
      const cy = e.y + e.size / 2;
      ctx.fillStyle = '#000';
      ctx.font = `bold ${Math.round(e.size * 0.28)}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(e.number), cx, cy + e.size * 0.05);
    }
  }

  // Exact ellipse-based beetle from bug-game-with-music.html
  private drawBeetle(x: number, y: number, size: number, color: string, isPlayer = false, glow = false): void {
    const ctx = this.ctx;
    const centerX = x + size / 2;
    const centerY = y + size / 2;

    if (glow) {
      ctx.shadowBlur = 25;
      ctx.shadowColor = color;
    }

    // Ellipse body
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, size * 0.35, size * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.arc(centerX, centerY - size * 0.35, size * 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Antennae with quadratic curves
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(centerX - size * 0.1, centerY - size * 0.4);
    ctx.quadraticCurveTo(centerX - size * 0.25, centerY - size * 0.55, centerX - size * 0.3, centerY - size * 0.5);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX + size * 0.1, centerY - size * 0.4);
    ctx.quadraticCurveTo(centerX + size * 0.25, centerY - size * 0.55, centerX + size * 0.3, centerY - size * 0.5);
    ctx.stroke();

    // Antenna balls
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(centerX - size * 0.3, centerY - size * 0.5, size * 0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(centerX + size * 0.3, centerY - size * 0.5, size * 0.05, 0, Math.PI * 2);
    ctx.fill();

    // 3 legs each side
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    for (let i = 0; i < 3; i++) {
      const legY = centerY - size * 0.15 + i * size * 0.15;
      ctx.beginPath();
      ctx.moveTo(centerX - size * 0.3, legY);
      ctx.lineTo(centerX - size * 0.45, legY + size * 0.08);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(centerX + size * 0.3, legY);
      ctx.lineTo(centerX + size * 0.45, legY + size * 0.08);
      ctx.stroke();
    }

    // Wing divider — not for player
    if (!isPlayer) {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - size * 0.35);
      ctx.lineTo(centerX, centerY + size * 0.4);
      ctx.stroke();
    }

    if (glow) {
      ctx.shadowBlur = 0;
    }
  }

  private drawIdleScreen(): void {
    const ctx = this.ctx;
    const w = this.config.canvasWidth;
    const h = this.config.canvasHeight;

    ctx.save();
    ctx.scale(this.scale, this.scale);

    // Black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, w, h);

    // Center divider
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w / 2, h);
    ctx.stroke();

    // Title
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#22C55E';
    ctx.fillStyle = '#22C55E';
    ctx.font = 'bold 48px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Поймай Жука', w / 2, h / 2 - 50);
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#94A3B8';
    ctx.font = '20px system-ui, sans-serif';
    ctx.fillText('Нажмите "Начать игру"', w / 2, h / 2 + 10);

    // Demo beetle with glow
    ctx.shadowBlur = 25;
    ctx.shadowColor = '#22C55E';
    this.drawBeetle(w / 2 - 30, h / 2 + 60, 60, '#22C55E', true, false);
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  private endGame(): void {
    cancelAnimationFrame(this.rafId);
    this.keys.clear();
    this.touchDir = { x: 0, y: 0 };
    this.collisionCooldownMs = 0;
    this.setState('ended');

    const duration = Math.round((Date.now() - this.startTimestamp) / 1000);
    const rank = getRank(this.score);
    const session: GameSession = {
      id: uid(),
      score: this.score,
      correctAnswers: this.correctAnswers,
      totalAttempts: this.totalAttempts,
      accuracy: this.getAccuracy(),
      duration,
      mode: this.mode,
      rank: rank.name,
      maxStreak: this.maxStreak,
      createdAt: new Date().toISOString(),
      level: this.level,
      maxCombo: this.maxCombo,
      totalCorrect: this.totalCorrect,
      totalWrong: this.totalWrong,
    };

    this.callbacks.onGameEnd?.(session);
  }
}
