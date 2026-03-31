// src/calculators/shared.js
// Shared utilities for all calculator pages

export function formatCZK(value) {
  return Math.round(value).toLocaleString('cs-CZ') + ' Kč'
}

export function formatPercent(value, decimals = 1) {
  return value.toFixed(decimals) + ' %'
}

export function syncInputs(rangeId, numberId, onChange) {
  const range = document.getElementById(rangeId)
  const num = document.getElementById(numberId)
  if (!range || !num) return

  range.addEventListener('input', () => {
    num.value = range.value
    updateRangeFill(range)
    onChange()
  })

  num.addEventListener('input', () => {
    let val = parseFloat(num.value)
    if (isNaN(val)) val = parseFloat(num.min)
    val = Math.max(parseFloat(num.min), Math.min(parseFloat(num.max), val))
    range.value = val
    updateRangeFill(range)
    onChange()
  })
}

export function updateRangeFill(rangeEl) {
  const min = parseFloat(rangeEl.min)
  const max = parseFloat(rangeEl.max)
  const val = parseFloat(rangeEl.value)
  const pct = ((val - min) / (max - min)) * 100
  rangeEl.style.setProperty('--range-progress', pct + '%')
}

const prevValues = {}

export function animateResult(elementId, value, isCurrency = true) {
  const el = document.getElementById(elementId)
  if (!el) return

  const prev = prevValues[elementId] || 0
  prevValues[elementId] = value

  el.dispatchEvent(new CustomEvent('calc:update', {
    detail: { from: prev, to: value, currency: isCurrency }
  }))
}

export function setResultText(elementId, text) {
  const el = document.getElementById(elementId)
  if (el) el.textContent = text
}

export function initTooltips() {
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.tooltip-trigger')
    if (trigger) {
      e.preventDefault()
      const content = trigger.nextElementSibling
      if (content && content.classList.contains('tooltip-content')) {
        content.classList.toggle('active')
      }
      // Close other open tooltips
      document.querySelectorAll('.tooltip-content.active').forEach(tc => {
        if (tc !== content) tc.classList.remove('active')
      })
      return
    }
    // Click outside closes all
    if (!e.target.closest('.tooltip-content')) {
      document.querySelectorAll('.tooltip-content.active').forEach(tc => tc.classList.remove('active'))
    }
  })
}

export function initRangeFills(container) {
  const root = container || document
  root.querySelectorAll('input[type="range"]').forEach(range => {
    updateRangeFill(range)
  })
}

// Dynamic insight text builder
export function setInsight(elementId, html) {
  const el = document.getElementById(elementId)
  if (el) el.innerHTML = html
}

// Dispatcher: detect which calculator is present and init it
export async function initCalcDetail() {
  initTooltips()

  if (document.getElementById('calc-mortgage')) {
    const { initMortgageCalc } = await import('./mortgage.js')
    initMortgageCalc()
  } else if (document.getElementById('calc-investment')) {
    const { initInvestmentCalc } = await import('./investment.js')
    initInvestmentCalc()
  } else if (document.getElementById('calc-inflation')) {
    const { initInflationCalc } = await import('./inflation.js')
    initInflationCalc()
  } else if (document.getElementById('calc-pension')) {
    const { initPensionCalc } = await import('./pension.js')
    initPensionCalc()
  }
}
