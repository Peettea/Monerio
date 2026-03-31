// src/calculators/mortgage.js
// Mortgage calculator with donut + amortization charts

import { Chart, COLORS, createGradient, tooltipCZK } from './chart-theme.js'
import { formatCZK, syncInputs, animateResult, initRangeFills, setInsight } from './shared.js'

let donutChart = null
let amortChart = null

function calculate() {
  const P = parseFloat(document.getElementById('mortgage-amount').value)
  const annual = parseFloat(document.getElementById('mortgage-rate').value) / 100
  const years = parseInt(document.getElementById('mortgage-years').value)
  const r = annual / 12
  const n = years * 12

  // Monthly payment (annuity formula)
  const monthly = r === 0 ? P / n : P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
  const totalPaid = monthly * n
  const overpay = totalPaid - P
  const overpayPct = ((overpay / P) * 100).toFixed(0)

  // Animate result numbers
  animateResult('mortgage-monthly', monthly)
  animateResult('mortgage-total', totalPaid)
  animateResult('mortgage-overpay', overpay)

  // Amortization schedule (yearly)
  let balance = P
  const yearLabels = []
  const principalData = []
  const interestData = []

  for (let y = 1; y <= years; y++) {
    let yearPrincipal = 0
    let yearInterest = 0

    for (let m = 0; m < 12; m++) {
      const interestPayment = balance * r
      const principalPayment = monthly - interestPayment
      yearInterest += interestPayment
      yearPrincipal += principalPayment
      balance = Math.max(0, balance - principalPayment)
    }

    yearLabels.push(y + '. rok')
    principalData.push(Math.round(yearPrincipal))
    interestData.push(Math.round(yearInterest))
  }

  // Update donut chart
  updateDonut(P, overpay)

  // Update amortization chart
  updateAmort(yearLabels, principalData, interestData)

  // Update insight box
  setInsight('insight-text', `
    Za <strong>${years} let</strong> zaplatíte na úrocích
    <strong class="text-warning">${formatCZK(overpay)}</strong> — to je
    <strong class="text-warning">${overpayPct} %</strong> navíc oproti půjčené částce.
    Správně zvolená fixace a načasování refinancování mohou ušetřit stovky tisíc korun.
  `)
}

function updateDonut(principal, interest) {
  const ctx = document.getElementById('mortgage-donut')
  if (!ctx) return

  const data = {
    labels: ['Jistina', 'Úroky'],
    datasets: [{
      data: [Math.round(principal), Math.round(interest)],
      backgroundColor: [COLORS.blue, COLORS.gold],
      borderWidth: 0,
      hoverOffset: 8,
    }]
  }

  if (donutChart) {
    donutChart.data = data
    donutChart.update('none')
  } else {
    donutChart = new Chart(ctx, {
      type: 'doughnut',
      data,
      options: {
        cutout: '65%',
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: (ctx) => ' ' + formatCZK(ctx.parsed)
            }
          }
        }
      },
      plugins: [{
        id: 'centerText',
        afterDraw(chart) {
          const { ctx: c, width, height } = chart
          const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0)
          c.save()
          c.font = '600 14px Montserrat, sans-serif'
          c.fillStyle = COLORS.muted
          c.textAlign = 'center'
          c.textBaseline = 'middle'
          c.fillText('Celkem', width / 2, height / 2 - 12)
          c.font = '700 18px Montserrat, sans-serif'
          c.fillStyle = COLORS.text
          c.fillText(formatCZK(total), width / 2, height / 2 + 12)
          c.restore()
        }
      }]
    })
  }
}

function updateAmort(labels, principalData, interestData) {
  const ctx = document.getElementById('mortgage-amort')
  if (!ctx) return

  const data = {
    labels,
    datasets: [
      {
        label: 'Jistina',
        data: principalData,
        backgroundColor: COLORS.blue,
        borderRadius: 3,
      },
      {
        label: 'Úroky',
        data: interestData,
        backgroundColor: COLORS.gold,
        borderRadius: 3,
      }
    ]
  }

  if (amortChart) {
    amortChart.data = data
    amortChart.update('none')
  } else {
    amortChart = new Chart(ctx, {
      type: 'bar',
      data,
      options: {
        scales: {
          x: {
            stacked: true,
            ticks: { maxTicksLimit: 10 }
          },
          y: {
            stacked: true,
            ticks: { callback: (v) => (v / 1000).toFixed(0) + 'k' }
          }
        },
        plugins: {
          tooltip: {
            callbacks: { label: tooltipCZK }
          }
        }
      }
    })
  }
}

export function initMortgageCalc() {
  syncInputs('mortgage-amount-range', 'mortgage-amount', calculate)
  syncInputs('mortgage-rate-range', 'mortgage-rate', calculate)
  syncInputs('mortgage-years-range', 'mortgage-years', calculate)

  initRangeFills()
  calculate()
}
