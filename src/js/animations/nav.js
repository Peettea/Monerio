import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function initNav() {
  const navbar = document.querySelector('.navbar')
  if (!navbar) return

  // Prevent flicker by removing the global scroll-reveal class after first mount
  const navContent = navbar.querySelector('.nav-content')
  if (navContent && navContent.classList.contains('fade-in-up')) {
    setTimeout(() => navContent.classList.remove('fade-in-up'), 100)
  }

  initNavScrollTriggers(navbar)

  // Mobile menu
  initMobileMenu()

  // Update active link
  updateActiveNavLink()
}

function initNavScrollTriggers(navbar) {
  let lastScrollY = 0

  // Hide on scroll down, show on scroll up
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      const currentScroll = self.scroll()
      if (currentScroll > 300 && currentScroll > lastScrollY) {
        gsap.to(navbar, { y: -100, duration: 0.3, ease: 'power2.in' })
      } else {
        gsap.to(navbar, { y: 0, duration: 0.3, ease: 'power2.out' })
      }
      lastScrollY = currentScroll
    },
  })

  // Compact mode
  ScrollTrigger.create({
    start: 50,
    onEnter: () => {
      navbar.style.padding = '8px 0'
      navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)'
    },
    onLeaveBack: () => {
      navbar.style.padding = '15px 0'
      navbar.style.boxShadow = 'none'
    },
  })
}

export function reinitNavScrollTriggers() {
  const navbar = document.querySelector('.navbar')
  if (navbar) {
    // Hard reset position before adding new triggers to avoid it getting stuck off-screen
    gsap.set(navbar, { y: 0, clearProps: 'all' })
    navbar.style.padding = ''
    navbar.style.boxShadow = ''
    initNavScrollTriggers(navbar)
  }
}

function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn')
  const menu = document.getElementById('mobile-menu')
  if (!btn || !menu) return

  const links = menu.querySelectorAll('.mobile-link, .btn')
  let isOpen = false

  btn.addEventListener('click', () => {
    isOpen = !isOpen
    if (isOpen) {
      menu.classList.add('active')
      gsap.fromTo(
        links,
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.07, duration: 0.3, ease: 'power2.out', delay: 0.1 }
      )
    } else {
      gsap.to(menu, {
        x: '-100%',
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          menu.classList.remove('active')
          gsap.set(menu, { x: '' })
        },
      })
    }
  })

  // Close on link click
  links.forEach((link) => {
    link.addEventListener('click', () => {
      if (isOpen) {
        isOpen = false
        menu.classList.remove('active')
      }
    })
  })
}

export function updateActiveNavLink() {
  const currentPath = window.location.pathname
  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.classList.remove('active')
    const href = link.getAttribute('href')
    if (href === currentPath || (currentPath === '/' && href === '/')) {
      link.classList.add('active')
    }
  })
}
