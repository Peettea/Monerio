import barba from '@barba/core'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initScrollReveals } from '../animations/scroll-reveals.js'
import { initTextAnimations } from '../animations/text-animations.js'
import { initCardAnimations } from '../animations/cards.js'
import { initServiceAnimations } from '../animations/service-blocks.js'
import { initContactAnimations } from '../animations/contact.js'
import { initFooterAnimation } from '../animations/footer.js'
import { initCounters } from '../animations/counters.js'
import { initHeroAnimations, initHeroParticles, cleanupHeroParticles } from '../animations/hero.js'
import { updateActiveNavLink, reinitNavScrollTriggers } from '../animations/nav.js'
import { initCalculatorAnimations, initCalcDetailAnimations, initMortgageAnimations } from '../animations/calculators.js'

function initPageAnimations(namespace) {
  // Common animations for all pages
  initScrollReveals()
  initFooterAnimation()

  switch (namespace) {
    case 'home':
      initTextAnimations()
      initCardAnimations()
      initCounters()
      initHeroAnimations()
      initHeroParticles()
      break
    case 'sluzby':
      initTextAnimations()
      initServiceAnimations()
      break
    case 'about':
      initTextAnimations()
      initCardAnimations()
      break
    case 'blog':
      initCardAnimations()
      break
    case 'kontakt':
      initContactAnimations()
      break
    case 'article':
      initTextAnimations()
      break
    case 'kalkulacky':
      initTextAnimations()
      initCalculatorAnimations()
      break
    case 'kalkulacka':
      initTextAnimations()

      const path = window.location.pathname;
      if (path.includes('hypoteka')) {
        initMortgageAnimations()
        import('../calculators/mortgage-3.js').then(({ initMortgageStory }) => {
          initMortgageStory()
        })
      } else if (path.includes('investice')) {
        initCalcDetailAnimations()
        import('../calculators/investment-3.js').then(({ initInvestmentStory }) => {
          initInvestmentStory()
        })
      } else if (path.includes('vypadek-prijmu')) {
        initCalcDetailAnimations()
        import('../calculators/disability-3.js').then(({ initDisabilityStory }) => {
          initDisabilityStory()
        })
      } else if (path.includes('rentgen-mzdy')) {
        initCalcDetailAnimations()
        import('../calculators/wage-3.js').then(({ initWageStory }) => {
          initWageStory()
        })
      } else {
        initCalcDetailAnimations()
      }
      break
  }
}

export function initBarba() {
  // Initial page load animations
  const initialNamespace = document.querySelector('[data-barba="container"]')?.dataset.barbaNamespace
  if (initialNamespace) {
    initPageAnimations(initialNamespace)
  }

  barba.init({
    preventRunning: true,

    transitions: [
      {
        name: 'overlay-transition',

        async leave({ current }) {
          window.__lenis?.stop()

          const overlay = document.getElementById('page-transition')
          if (overlay) {
            await gsap.to(overlay, {
              scaleY: 1,
              transformOrigin: 'bottom',
              duration: 0.5,
              ease: 'power3.inOut',
            })
          }
          gsap.set(current.container, { opacity: 0 })
        },

        async enter({ next }) {
          window.__lenis?.scrollTo(0, { immediate: true })
          window.scrollTo(0, 0)

          gsap.set(next.container, { opacity: 1 })

          const overlay = document.getElementById('page-transition')
          if (overlay) {
            await gsap.to(overlay, {
              scaleY: 0,
              transformOrigin: 'top',
              duration: 0.5,
              ease: 'power3.inOut',
            })
          }

          window.__lenis?.start()
        },

        async once() {
          // First load handled by initPageAnimations above
        },
      },
      // Article pages: clip-path reveal
      {
        name: 'article-transition',
        to: { namespace: ['article'] },

        async leave({ current }) {
          window.__lenis?.stop()
          await gsap.to(current.container, { opacity: 0, duration: 0.3 })
        },

        async enter({ next }) {
          window.__lenis?.scrollTo(0, { immediate: true })
          window.scrollTo(0, 0)

          gsap.set(next.container, { clipPath: 'inset(0 0 100% 0)' })
          await gsap.to(next.container, {
            clipPath: 'inset(0 0 0% 0)',
            duration: 0.6,
            ease: 'power3.inOut',
          })

          window.__lenis?.start()
        },
      },
    ],
  })

  // Hooks
  barba.hooks.before(() => {
    cleanupHeroParticles()
    ScrollTrigger.getAll().forEach((st) => st.kill())
  })

  barba.hooks.after(({ next }) => {
    const namespace = next.container.dataset.barbaNamespace
    initPageAnimations(namespace)

    reinitNavScrollTriggers()
    ScrollTrigger.refresh()
    window.__lenis?.resize()
    updateActiveNavLink()
  })
}
