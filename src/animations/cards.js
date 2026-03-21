import gsap from 'gsap'

export function initCardAnimations() {
  // Premium cards hover - keep subtle hover effects
  gsap.utils.toArray('.premium-card').forEach((card) => {
    const icon = card.querySelector('.icon-luxury')

    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        y: -8,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 85, 164, 0.08)',
        duration: 0.4,
        ease: 'power2.out',
      })
      if (icon) {
        gsap.to(icon, {
          scale: 1.1,
          color: '#00B4D8',
          duration: 0.4,
          ease: 'power2.out',
        })
      }
    })

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        y: 0,
        boxShadow: 'none',
        duration: 0.4,
        ease: 'power2.out',
      })
      if (icon) {
        gsap.to(icon, {
          scale: 1,
          color: '#0055A4',
          duration: 0.4,
        })
      }
    })
  })

  // Blog cards hover
  gsap.utils.toArray('.blog-card').forEach((card) => {
    const img = card.querySelector('.blog-card-image img')

    card.addEventListener('mouseenter', () => {
      gsap.to(card, { y: -6, boxShadow: '0 15px 35px rgba(0, 0, 0, 0.35)', duration: 0.4 })
      if (img) gsap.to(img, { scale: 1.05, duration: 0.5, ease: 'power2.out' })
    })

    card.addEventListener('mouseleave', () => {
      gsap.to(card, { y: 0, boxShadow: 'none', duration: 0.4 })
      if (img) gsap.to(img, { scale: 1, duration: 0.5 })
    })
  })

  // Partner cards hover
  gsap.utils.toArray('.partner-card').forEach((card) => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, { y: -4, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)', duration: 0.4 })
    })
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { y: 0, boxShadow: 'none', duration: 0.4 })
    })
  })
}
