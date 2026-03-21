import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function initTextAnimations() {
  // Section headings: gentle fade up on scroll
  gsap.utils.toArray('.section-header h2, .service-content h3, .about-content h2').forEach((heading) => {
    gsap.fromTo(
      heading,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: heading,
          start: 'top 85%',
          invalidateOnRefresh: true,
        },
      }
    )
  })

  // Subtitle badges: subtle slide in
  gsap.utils.toArray('.subtitle-badge').forEach((badge) => {
    gsap.fromTo(
      badge,
      { opacity: 0, x: -15 },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: badge,
          start: 'top 90%',
          invalidateOnRefresh: true,
        },
      }
    )
  })
}
