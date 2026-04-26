// src/animations/calculators.js
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Hub page: card stagger with enhanced entrance
export function initCalculatorAnimations() {
  const cards = gsap.utils.toArray('.calc2-card')
  if (!cards.length) return

  if (prefersReducedMotion) {
    gsap.set(cards, { opacity: 1, y: 0 })
    return
  }

  // Hub header entrance
  const header = document.querySelector('.calc3-hub-header')
  if (header) {
    gsap.from(header, {
      y: 30, opacity: 0, duration: 0.7,
      ease: 'power2.out', delay: 0.1,
    })
  }

  // Cards stagger with scale
  gsap.fromTo(cards,
    { opacity: 0, y: 40, scale: 0.97 },
    {
      opacity: 1, y: 0, scale: 1,
      duration: 0.7,
      stagger: 0.2,
      ease: 'power2.out',
      delay: 0.3,
    }
  )

  // Trust strip fade
  const trust = document.querySelector('.calc3-hub-trust')
  if (trust) {
    gsap.from(trust, { opacity: 0, duration: 0.5, ease: 'power2.out', delay: 0.7 })
  }
}

// Detail page: rich entrance animations
export function initCalcDetailAnimations() {
  if (prefersReducedMotion) return

  // Hero text entrance
  const heroH1 = document.querySelector('.calc3-hero h1')
  if (heroH1) {
    gsap.from(heroH1, {
      y: 30, opacity: 0, duration: 0.7,
      ease: 'power2.out', delay: 0.1,
    })
  }

  const heroSub = document.querySelector('.calc3-hero-subtitle')
  if (heroSub) {
    gsap.from(heroSub, {
      y: 20, opacity: 0, duration: 0.6,
      ease: 'power2.out', delay: 0.25,
    })
  }

  // Slider container entrance
  const sliderBox = document.querySelector('.calc3-inline-slider-container')
  if (sliderBox) {
    gsap.from(sliderBox, {
      y: 25, opacity: 0, scale: 0.98,
      duration: 0.7, ease: 'power2.out', delay: 0.4,
    })
  }

  // KPI cards stagger
  const kpiCards = gsap.utils.toArray('.calc3-kpi-card')
  if (kpiCards.length) {
    gsap.from(kpiCards, {
      y: 20, opacity: 0,
      duration: 0.5, stagger: 0.1,
      ease: 'power2.out', delay: 0.2,
    })
  }

  // Chart area entrance with scale
  const chartBox = document.querySelector('.calc3-chart-box')
  if (chartBox) {
    gsap.from(chartBox, {
      y: 30, opacity: 0, scale: 0.97,
      duration: 0.8, ease: 'power2.out', delay: 0.3,
    })
  }

  // Comparison cards stagger (time machine) — scroll triggered
  const compCards = gsap.utils.toArray('.calc3-comparison-card')
  if (compCards.length) {
    gsap.from(compCards, {
      y: 25, opacity: 0, scale: 0.97,
      duration: 0.6, stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.calc3-comparison-grid',
        start: 'top 85%',
      },
    })
  }

  // Leadgen section — scroll triggered entrance
  const leadgen = document.querySelector('.calc3-leadgen')
  if (leadgen) {
    gsap.from(leadgen, {
      y: 40, opacity: 0,
      duration: 0.8, ease: 'power2.out',
      scrollTrigger: {
        trigger: '.calc3-leadgen',
        start: 'top 85%',
      },
    })
  }

  // Cross-calculator link
  const crossLink = document.querySelector('.calc3-cross-link')
  if (crossLink) {
    gsap.from(crossLink, {
      y: 10, opacity: 0, duration: 0.4,
      ease: 'power2.out', delay: 0.6,
      scrollTrigger: {
        trigger: '.calc3-cross-link',
        start: 'top 90%',
      },
    })
  }

  // Trust signals fade-in
  const trustSignals = document.querySelector('.calc3-trust-signals')
  if (trustSignals) {
    gsap.from(trustSignals, {
      opacity: 0, duration: 0.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.calc3-trust-signals',
        start: 'top 92%',
      },
    })
  }
}

// Mortgage detail page: dashboard entrance animations (no ScrollTrigger)
export function initMortgageAnimations() {
  if (prefersReducedMotion) return

  // Sidebar entrance
  const sidebar = document.querySelector('.calc2-sidebar')
  if (sidebar) {
    gsap.from(sidebar, {
      y: 20, opacity: 0, duration: 0.6,
      ease: 'power2.out', delay: 0.2,
    })
  }

  // KPI cards stagger
  const kpiCards = gsap.utils.toArray('.calc2-kpi-card')
  if (kpiCards.length) {
    gsap.from(kpiCards, {
      y: 20, opacity: 0, scale: 0.97,
      duration: 0.5, stagger: 0.1,
      ease: 'power2.out', delay: 0.3,
    })
  }

  // Chart wrapper
  const chartWrapper = document.querySelector('.mort-chart-wrapper')
  if (chartWrapper) {
    gsap.from(chartWrapper, {
      y: 25, opacity: 0, scale: 0.98,
      duration: 0.6, ease: 'power2.out', delay: 0.5,
    })
  }

  // Detail tabs
  const detailTabs = document.querySelector('.mort-detail-tabs')
  if (detailTabs) {
    gsap.from(detailTabs, {
      y: 20, opacity: 0,
      duration: 0.5, ease: 'power2.out', delay: 0.6,
    })
  }
}
