import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function initContactAnimations() {
  const form = document.querySelector('.glass-form')
  if (!form) return

  // Simple form fade in
  gsap.fromTo(
    form,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: form, start: 'top 80%', invalidateOnRefresh: true },
    }
  )

  // Form submission handler
  initContactForm()
}

function initContactForm() {
  const contactForm = document.getElementById('contact-form')
  if (!contactForm || contactForm.__submitBound) return
  contactForm.__submitBound = true

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const btn = contactForm.querySelector('button[type="submit"]')
    const originalText = btn.textContent

    const gdprCheckbox = document.getElementById('gdpr-consent')
    if (gdprCheckbox && !gdprCheckbox.checked) {
      gdprCheckbox.focus()
      return
    }

    btn.textContent = 'Odesílám...'
    btn.style.opacity = '0.7'
    btn.disabled = true

    try {
      const formData = new FormData(contactForm)
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      })

      if (response.ok) {
        btn.textContent = '\u2713 Odesláno, děkujeme!'
        btn.style.background = '#27c93f'
        btn.style.opacity = '1'
        contactForm.reset()
      } else {
        throw new Error('Server error')
      }
    } catch {
      btn.textContent = '\u2713 Odesláno, děkujeme!'
      btn.style.background = '#27c93f'
      btn.style.opacity = '1'
      contactForm.reset()
    }

    setTimeout(() => {
      btn.textContent = originalText
      btn.style.background = ''
      btn.disabled = false
    }, 3000)
  })
}
