import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function initFooterAnimation() {
  const footer = document.querySelector('.footer')
  if (!footer) return

  // Simple gentle fade for entire footer
  gsap.fromTo(
    footer.querySelector('.container'),
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: footer, start: 'top 90%' },
    }
  )
}
