import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

/*
 * Pixel runner mini-game (dino-style):
 * click / Space / ArrowUp to start and jump, collect coins for bonus points,
 * click or Space after crashing to restart. Pure canvas — no libraries.
 * HI score persists in localStorage. Background stays in gentle motion even
 * before the game starts so it reads as alive.
 */

const H = 224
const GROUND_H = 12
const GROUND_TOP = H - GROUND_H

function PixelGame() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf = null

    const state = {
      mode: 'idle', // idle | running | over
      t: 0,
      speed: 3.5,
      dist: 0,
      bonus: 0,
      score: 0,
      hi: Number(localStorage.getItem('pixelRunnerHi')) || 0,
      py: 0, // player height above ground
      vy: 0,
      obstacles: [],
      coins: [],
      popups: [], // floating "+10" markers
      nextSpawn: 500,
      nextCoin: 650,
      farOffset: 0,
      nearOffset: 0,
      buildingsFar: [],
      buildingsNear: [],
      birds: [],
      width: 0,
      loopW: 0,
    }
    const setMode = (m) => {
      state.mode = m
      canvas.dataset.mode = m
      // Cursor label: "Play" when waiting, "Jump" mid-game
      canvas.dataset.cursor = m === 'running' ? 'Jump' : 'Play'
    }
    setMode('idle')

    const PLAYER_X = 70
    const PLAYER_W = 20
    const PLAYER_H = 22

    function genScenery() {
      state.loopW = state.width + 240
      const gen = (minH, maxH) => {
        const arr = []
        let x = 0
        while (x < state.loopW) {
          const w = 34 + Math.random() * 80
          arr.push({ x, w, h: minH + Math.random() * (maxH - minH) })
          x += w + 6 + Math.random() * 26
        }
        return arr
      }
      state.buildingsFar = gen(30, 80)
      state.buildingsNear = gen(50, 120)
      state.birds = Array.from({ length: 3 }, () => ({
        x: Math.random() * state.width,
        y: 24 + Math.random() * 60,
        s: 0.4 + Math.random() * 0.5,
      }))
    }

    function resize() {
      const dpr = window.devicePixelRatio || 1
      state.width = canvas.clientWidth
      canvas.width = state.width * dpr
      canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      genScenery()
    }

    /* ---------- drawing ---------- */

    function drawBuildings(list, offset, color, dotColor) {
      ctx.fillStyle = color
      for (const b of list) {
        const bx = ((b.x - offset) % state.loopW + state.loopW) % state.loopW - 120
        if (bx > state.width + 20) continue
        ctx.fillRect(bx, GROUND_TOP - b.h, b.w, b.h)
        ctx.fillStyle = dotColor
        for (let wx = bx + 8; wx < bx + b.w - 6; wx += 14) {
          for (let wy = GROUND_TOP - b.h + 10; wy < GROUND_TOP - 8; wy += 16) {
            ctx.fillRect(wx, wy, 3, 3)
          }
        }
        ctx.fillStyle = color
      }
    }

    function drawBird(b) {
      const flap = Math.floor(state.t / 14) % 2 === 0 ? 0 : 2
      ctx.fillStyle = '#b9b9b9'
      ctx.fillRect(b.x, b.y + flap, 6, 2)
      ctx.fillRect(b.x + 7, b.y, 3, 2)
      ctx.fillRect(b.x + 11, b.y + flap, 6, 2)
    }

    function drawTree(x, baseY) {
      ctx.fillStyle = '#4a3a2c'
      ctx.fillRect(x + 6, baseY - 8, 6, 8)
      ctx.fillStyle = '#2f8f3e'
      ctx.fillRect(x, baseY - 18, 18, 10)
      ctx.fillStyle = '#37a54a'
      ctx.fillRect(x + 3, baseY - 26, 12, 9)
      ctx.fillStyle = '#2f8f3e'
      ctx.fillRect(x + 6, baseY - 32, 6, 7)
    }

    function drawGear(x, baseY) {
      const r = 11
      const cx = x + r
      const cy = baseY - r
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate((state.dist / 14) % (Math.PI * 2))
      ctx.fillStyle = '#4c4c4c'
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(-r - 3, -2.5, (r + 3) * 2, 5)
        ctx.rotate(Math.PI / 4)
      }
      ctx.beginPath()
      ctx.arc(0, 0, r - 2, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#f4f4f4'
      ctx.beginPath()
      ctx.arc(0, 0, 3, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    function drawBlock(x, baseY) {
      ctx.fillStyle = '#3a3a3a'
      ctx.fillRect(x, baseY - 42, 14, 42)
      ctx.fillStyle = '#575757'
      ctx.fillRect(x + 9, baseY - 24, 3, 3)
    }

    function drawObstacle(o) {
      if (o.type === 'tree') drawTree(o.x, GROUND_TOP)
      else if (o.type === 'gear') drawGear(o.x, GROUND_TOP)
      else drawBlock(o.x, GROUND_TOP)
    }

    function drawCoin(c) {
      const bob = Math.sin(state.t / 12 + c.x / 30) * 2
      const cy = GROUND_TOP - c.h + bob
      ctx.fillStyle = '#e8b83a'
      ctx.beginPath()
      ctx.arc(c.x, cy, 6, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#f6d264'
      ctx.beginPath()
      ctx.arc(c.x, cy, 4, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#c9962a'
      ctx.fillRect(c.x - 1, cy - 3, 2, 6)
    }

    function drawPlayer() {
      const y = GROUND_TOP - PLAYER_H - state.py
      ctx.fillStyle = '#1f1f1f'
      ctx.fillRect(PLAYER_X, y, PLAYER_W, PLAYER_H - 4)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(PLAYER_X + 10, y + 5, 3, 3)
      ctx.fillRect(PLAYER_X + 15, y + 5, 3, 3)
      ctx.fillStyle = '#1f1f1f'
      if (state.py > 0) {
        ctx.fillRect(PLAYER_X + 3, y + PLAYER_H - 4, 4, 3)
        ctx.fillRect(PLAYER_X + 13, y + PLAYER_H - 4, 4, 3)
      } else {
        const phase = state.mode === 'running' && Math.floor(state.t / 5) % 2 === 0
        ctx.fillRect(PLAYER_X + (phase ? 2 : 5), y + PLAYER_H - 4, 4, 4)
        ctx.fillRect(PLAYER_X + (phase ? 13 : 10), y + PLAYER_H - 4, 4, 4)
      }
    }

    function drawText(text, x, y, size, color, align = 'center') {
      ctx.font = `${size}px "Press Start 2P", monospace`
      ctx.fillStyle = color
      ctx.textAlign = align
      ctx.fillText(text, x, y)
    }

    function draw() {
      ctx.clearRect(0, 0, state.width, H)
      drawBuildings(state.buildingsFar, state.farOffset, '#f2f2f2', '#eaeaea')
      drawBuildings(state.buildingsNear, state.nearOffset, '#e6e6e6', '#dddddd')
      for (const b of state.birds) drawBird(b)
      // ground
      ctx.fillStyle = '#8f8f8f'
      ctx.fillRect(0, GROUND_TOP, state.width, GROUND_H)
      ctx.fillStyle = '#a6a6a6'
      for (let gx = (-state.dist * 1.2) % 26; gx < state.width; gx += 26) {
        ctx.fillRect(gx, GROUND_TOP + 2, 8, 2)
      }
      for (const c of state.coins) drawCoin(c)
      for (const o of state.obstacles) drawObstacle(o)
      drawPlayer()
      // score popups
      for (const p of state.popups) {
        drawText('+10', p.x, p.y, 8, `rgba(180,140,40,${p.life / 40})`)
      }
      // HUD
      drawText(`HI ${String(state.hi).padStart(4, '0')}  SCORE ${String(state.score).padStart(4, '0')}`, state.width - 20, 30, 9, '#9a9a9a', 'right')
      if (state.mode === 'idle') {
        drawText('CLICK OR PRESS SPACE TO PLAY', state.width / 2, 86, 10, '#8a8a8a')
      } else if (state.mode === 'over') {
        drawText('GAME OVER', state.width / 2, 76, 13, '#3a3a3a')
        drawText('CLICK OR PRESS SPACE TO RESTART', state.width / 2, 100, 8, '#8a8a8a')
      }
    }

    /* ---------- game logic ---------- */

    function spawnObstacle() {
      const types = ['tree', 'gear', 'block', 'tree']
      const type = types[Math.floor(Math.random() * types.length)]
      const w = type === 'tree' ? 18 : type === 'gear' ? 22 : 14
      const h = type === 'tree' ? 32 : type === 'gear' ? 22 : 42
      state.obstacles.push({ type, x: state.width + 40, w, h })
      state.nextSpawn = 300 + Math.random() * 380 + state.speed * 30
    }

    function spawnCoins() {
      const count = 1 + Math.floor(Math.random() * 3) // 1-3 coins in a row
      const h = Math.random() < 0.5 ? 26 : 64 // low (run through) or high (jump for it)
      for (let i = 0; i < count; i++) {
        state.coins.push({ x: state.width + 40 + i * 26, h })
      }
      state.nextCoin = 500 + Math.random() * 600
    }

    function update() {
      state.dist += state.speed
      state.score = Math.floor(state.dist / 40) + state.bonus
      state.speed = 3.5 + Math.min(2.5, state.dist / 4000)
      state.farOffset += state.speed * 0.15
      state.nearOffset += state.speed * 0.3

      // player physics
      state.py += state.vy
      state.vy -= 0.55
      if (state.py <= 0) {
        state.py = 0
        state.vy = 0
      }

      // spawns
      state.nextSpawn -= state.speed
      if (state.nextSpawn <= 0) spawnObstacle()
      state.nextCoin -= state.speed
      if (state.nextCoin <= 0) spawnCoins()

      for (const o of state.obstacles) o.x -= state.speed
      state.obstacles = state.obstacles.filter((o) => o.x + o.w > -30)
      for (const c of state.coins) c.x -= state.speed
      state.coins = state.coins.filter((c) => c.x > -20)

      // player hitbox
      const px = PLAYER_X + 4
      const pw = PLAYER_W - 8
      const pTop = GROUND_TOP - PLAYER_H - state.py + 3
      const ph = PLAYER_H - 5

      // coin pickup (generous radius)
      state.coins = state.coins.filter((c) => {
        const cy = GROUND_TOP - c.h
        const hit = c.x > px - 10 && c.x < px + pw + 10 && cy > pTop - 12 && cy < pTop + ph + 12
        if (hit) {
          state.bonus += 10
          state.popups.push({ x: c.x, y: cy - 12, life: 40 })
        }
        return !hit
      })

      // popups float up and fade
      for (const p of state.popups) {
        p.y -= 0.6
        p.life -= 1
      }
      state.popups = state.popups.filter((p) => p.life > 0)

      // obstacle collision
      for (const o of state.obstacles) {
        const oTop = GROUND_TOP - o.h + 3
        if (px < o.x + o.w - 3 && px + pw > o.x + 3 && pTop + ph > oTop) {
          gameOver()
          return
        }
      }
    }

    function loop() {
      // Skip work entirely while the footer is offscreen (game auto-pauses).
      if (!state.onScreen) {
        raf = requestAnimationFrame(loop)
        return
      }
      state.t += 1
      // ambient motion runs in every mode so the scene always feels alive
      for (const b of state.birds) {
        b.x -= b.s
        if (b.x < -20) {
          b.x = state.width + 20
          b.y = 24 + Math.random() * 60
        }
      }
      if (state.mode === 'running') {
        update()
      } else {
        state.farOffset += 0.2
        state.nearOffset += 0.38
      }
      draw()
      raf = requestAnimationFrame(loop)
    }

    function gameOver() {
      setMode('over')
      if (state.score > state.hi) {
        state.hi = state.score
        try {
          localStorage.setItem('pixelRunnerHi', String(state.hi))
        } catch {
          /* storage unavailable — HI just won't persist */
        }
      }
    }

    function reset() {
      state.t = 0
      state.dist = 0
      state.bonus = 0
      state.score = 0
      state.speed = 3.5
      state.py = 0
      state.vy = 0
      state.obstacles = []
      state.coins = []
      state.popups = []
      state.nextSpawn = 500
      state.nextCoin = 650
    }

    function jump() {
      if (state.py === 0) state.vy = 10.5
    }

    function act() {
      if (state.mode === 'idle') {
        setMode('running')
      } else if (state.mode === 'running') {
        jump()
      } else {
        reset()
        setMode('running')
      }
    }

    const onPointer = (e) => {
      e.preventDefault()
      act()
    }
    // Window-level keys: Space always jumps while running; starting/restarting
    // only triggers when the game is actually on screen, so Space still
    // scrolls the page everywhere else.
    const onKey = (e) => {
      if (e.code !== 'Space' && e.code !== 'ArrowUp') return
      if (state.mode === 'running') {
        e.preventDefault()
        jump()
        return
      }
      const r = canvas.getBoundingClientRect()
      const visible = r.top < window.innerHeight * 0.85 && r.bottom > 0
      if (visible) {
        e.preventDefault()
        act()
      }
    }

    state.onScreen = false
    const io = new IntersectionObserver(([entry]) => {
      state.onScreen = entry.isIntersecting
    })
    io.observe(canvas)

    canvas.addEventListener('pointerdown', onPointer)
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', resize)
    resize()
    draw()
    raf = requestAnimationFrame(loop)

    return () => {
      if (raf) cancelAnimationFrame(raf)
      io.disconnect()
      canvas.removeEventListener('pointerdown', onPointer)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      tabIndex={0}
      role="button"
      aria-label="Pixel runner mini-game. Click or press space to jump over obstacles and collect coins."
      className="block h-[224px] w-full cursor-pointer select-none outline-none"
    />
  )
}

export default function Footer() {
  return (
    <footer>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      >
        <PixelGame />
      </motion.div>
      <div
        className="bg-[#2d2d2d] py-10 text-center"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      >
        <p className="text-sm font-medium text-gray-400">
          © {new Date().getFullYear()} all rights reserved by Venkatesh Rao
        </p>
      </div>
    </footer>
  )
}
