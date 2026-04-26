import '../styles/main.css'
import '../styles/tooltips.css'
import '../styles/animations.css'
import { initGSAP } from './animations/gsap-init.js'
import { initLenis } from './smooth-scroll/lenis-init.js'
import { initNav } from './animations/nav.js'
import { initCookieBanner } from './animations/cookie-banner.js'
import { initBarba } from './transitions/barba-init.js'
import { initSplashScreen } from './animations/hero.js'

// Initialize persistent systems (run once, survive page transitions)
initGSAP()
initLenis()
initNav()
initCookieBanner()
initSplashScreen()

// Barba handles page-specific animation lifecycle
initBarba()
