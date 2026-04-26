import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function initServiceAnimations() {
  gsap.utils.toArray('.service-block').forEach((block) => {
    const image = block.querySelector('.service-image-area')
    const content = block.querySelector('.service-content')

    // Subtle image parallax
    if (image) {
      gsap.to(image, {
        backgroundPositionY: '30%',
        ease: 'none',
        scrollTrigger: {
          trigger: block,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })
    }

    // Content fade in (not staggered piece-by-piece)
    if (content) {
      gsap.fromTo(
        content,
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: content,
            start: 'top 80%',
            invalidateOnRefresh: true,
          },
        }
      )
    }
  })
}
