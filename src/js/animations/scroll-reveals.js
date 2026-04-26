import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function initScrollReveals() {
  // Single element reveals - subtle fade up
  const revealElements = gsap.utils.toArray('[data-reveal], .fade-in-up')

  revealElements.forEach((el) => {
    if (el.closest('.grid-3, .grid-2, .partner-grid, .blog-grid') && !el.classList.contains('fade-in-up')) return

    gsap.fromTo(
      el,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none',
          invalidateOnRefresh: true,
        },
        onStart: () => {
          el.classList.remove('fade-in-up')
          el.removeAttribute('data-reveal')
        }
      }
    )
  })

  // Staggered grid reveals - gentle stagger
  gsap.utils.toArray('.grid-3, .grid-2, .partner-grid, .blog-grid').forEach((grid) => {
    const children = gsap.utils.toArray(grid.children)
    if (!children.length) return

    gsap.fromTo(
      children,
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: grid,
          start: 'top 85%',
          invalidateOnRefresh: true,
        },
      }
    )
  })
}
