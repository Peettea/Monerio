import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function initCounters() {
  gsap.utils.toArray('.stat-number[data-target]').forEach((el) => {
    const target = parseInt(el.dataset.target, 10)
    if (!target) return

    const suffix = el.dataset.suffix || ''
    const obj = { val: 0 }

    ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = Math.floor(obj.val).toLocaleString('cs-CZ') + suffix
          },
        })
      },
    })
  })
}
