import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function initSplashScreen(onComplete) {
  const splash = document.getElementById('splash-screen')
  if (!splash) {
    onComplete?.()
    return
  }

  const logo = splash.querySelector('.splash-logo')
  const progressBar = splash.querySelector('.splash-progress-bar')

  const tl = gsap.timeline({
    onComplete: () => {
      splash.remove()
      onComplete?.()
    },
  })

  tl.set(logo, { opacity: 0, scale: 0.9 })
    .to(logo, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' })

  if (progressBar) {
    tl.to(progressBar, { scaleX: 1, duration: 0.5, ease: 'power2.inOut' }, '-=0.1')
  }

  tl.to(splash, { yPercent: -100, duration: 0.5, ease: 'power3.inOut' }, '+=0.1')
}

export function initHeroAnimations() {
  const hero = document.querySelector('.hero-section')
  if (!hero) return

  // Subtle hero content parallax on scroll
  const heroContent = hero.querySelector('.hero-content')
  if (heroContent) {
    gsap.to(heroContent, {
      y: -60,
      opacity: 0.3,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'center center',
        end: 'bottom top',
        scrub: true,
      },
    })
  }

  // Background glow parallax
  const glow = hero.querySelector('.hero-bg-glow')
  if (glow) {
    gsap.to(glow, {
      y: 100,
      scale: 1.15,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    })
  }
}

export function initHeroParticles() {
  const canvas = document.getElementById('particle-canvas')
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  let particles = []
  let animationId
  let mouseX = -1000
  let mouseY = -1000
  const isMobile = window.innerWidth < 768
  const PARTICLE_COUNT = isMobile ? 30 : 80
  const MAX_DISTANCE = 180
  const MOUSE_RADIUS = 200
  const PARTICLE_COLOR = 'rgba(0, 85, 164, 0.4)'
  const LINE_COLOR_BASE = [0, 85, 164]

  function resizeCanvas() {
    const hero = canvas.parentElement
    canvas.width = hero.offsetWidth
    canvas.height = hero.offsetHeight
  }

  function createParticles() {
    particles = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
      })
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < MAX_DISTANCE) {
          const opacity = (1 - dist / MAX_DISTANCE) * 0.15
          ctx.beginPath()
          ctx.strokeStyle = `rgba(${LINE_COLOR_BASE[0]}, ${LINE_COLOR_BASE[1]}, ${LINE_COLOR_BASE[2]}, ${opacity})`
          ctx.lineWidth = 0.5
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.stroke()
        }
      }
    }

    particles.forEach((p) => {
      const mDx = mouseX - p.x
      const mDy = mouseY - p.y
      const mDist = Math.sqrt(mDx * mDx + mDy * mDy)

      if (mDist < MOUSE_RADIUS && mDist > 0) {
        const force = ((MOUSE_RADIUS - mDist) / MOUSE_RADIUS) * 0.02
        p.vx += (mDx / mDist) * force
        p.vy += (mDy / mDist) * force
      }

      p.vx *= 0.99
      p.vy *= 0.99

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
      ctx.fillStyle = PARTICLE_COLOR
      ctx.fill()

      p.x += p.vx
      p.y += p.vy

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1
    })

    animationId = requestAnimationFrame(drawParticles)
  }

  document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect()
    mouseX = e.clientX - rect.left
    mouseY = e.clientY - rect.top
  })

  const heroObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!animationId) drawParticles()
        } else {
          if (animationId) {
            cancelAnimationFrame(animationId)
            animationId = null
          }
        }
      })
    },
    { threshold: 0.1 }
  )

  resizeCanvas()
  createParticles()
  heroObserver.observe(canvas.parentElement)

  let resizeTimeout
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      resizeCanvas()
      createParticles()
    }, 250)
  })
}
