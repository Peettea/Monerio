import gsap from 'gsap'

export function initCookieBanner() {
  const cookieBanner = document.getElementById('cookie-banner')
  const cookieAccept = document.getElementById('cookie-accept')
  const cookieReject = document.getElementById('cookie-reject')

  if (!cookieBanner) return

  const consent = localStorage.getItem('monerio-cookie-consent')

  if (!consent) {
    setTimeout(() => {
      cookieBanner.classList.add('visible')
    }, 2000)
  }

  if (cookieAccept) {
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('monerio-cookie-consent', 'accepted')
      gsap.to(cookieBanner, {
        y: '100%',
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => cookieBanner.classList.remove('visible'),
      })
    })
  }

  if (cookieReject) {
    cookieReject.addEventListener('click', () => {
      localStorage.setItem('monerio-cookie-consent', 'rejected')
      gsap.to(cookieBanner, {
        y: '100%',
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => cookieBanner.classList.remove('visible'),
      })
    })
  }
}
