import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

export function initGSAP() {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

  gsap.defaults({
    ease: 'power2.out',
    duration: 0.8,
  })

  ScrollTrigger.config({
    limitCallbacks: true,
    syncInterval: 40,
  })
}
