// src/animations/calculators.js
import gsap from 'gsap'

// Hub page: card stagger + hover
export function initCalculatorAnimations() {
  const cards = gsap.utils.toArray('.calc-hub-card')
  if (!cards.length) return

  // Staggered reveal
  gsap.fromTo(cards,
    { opacity: 0, y: 30 },
    {
      opacity: 1, y: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.calc-hub-grid',
        start: 'top 85%',
      },
    }
  )
}

// Detail page: chart entrance, result card stagger, insight fade-in
export function initCalcDetailAnimations() {
  // Count-up animation on result values
  document.querySelectorAll('.calc-result-value, .calc-result-value-sm').forEach(el => {
    el.addEventListener('calc:update', (e) => {
      const { from, to, currency } = e.detail

      // Kill previous tween to prevent overlap during fast slider dragging
      if (el._calcTween) el._calcTween.kill()

      const obj = { val: from }
      el._calcTween = gsap.to(obj, {
        val: to,
        duration: 0.5,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = Math.round(obj.val).toLocaleString('cs-CZ') + ' Kč'
        },
      })
    })
  })

  // Chart area entrance (gentle, no hiding)
  const chartArea = document.querySelector('.calc-chart-area')
  if (chartArea) {
    gsap.from(chartArea, { y: 20, duration: 0.8, ease: 'power2.out', delay: 0.2 })
  }

  // Result cards — visible immediately, gentle entrance animation
  const resultCards = gsap.utils.toArray('.calc-result-card')
  if (resultCards.length) {
    gsap.from(resultCards, {
      y: 15,
      duration: 0.5,
      stagger: 0.08,
      ease: 'power2.out',
      delay: 0.3,
    })
  }

  // Insight box — visible immediately, gentle entrance
  const insightBox = document.querySelector('.calc-insight-box')
  if (insightBox) {
    gsap.from(insightBox, {
      y: 15,
      duration: 0.6,
      ease: 'power2.out',
      delay: 0.5,
    })
  }

  // Sub-nav fade-in
  const subnav = document.querySelector('.calc-subnav')
  if (subnav) {
    gsap.from(subnav, { opacity: 0, y: -10, duration: 0.4, ease: 'power2.out', delay: 0.3 })
  }
}
