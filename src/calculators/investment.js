// src/calculators/investment.js
// Investment calculator with stacked area chart

import { Chart, COLORS, createGradient, tooltipCZK } from './chart-theme.js'
import { formatCZK, syncInputs, animateResult, initRangeFills, setInsight } from './shared.js'

let investChart = null

function calculate() {
  const PV = parseFloat(document.getElementById('invest-initial').value)
  const PMT = parseFloat(document.getElementById('invest-monthly').value)
  const annual = parseFloat(document.getElementById('invest-return').value) / 100
  const years = parseInt(document.getElementById('invest-years').value)
  const r = annual / 12
  const n = years * 12

  // Final value
  const FV = r === 0
    ? PV + PMT * n
    : PV * Math.pow(1 + r, n) + PMT * ((Math.pow(1 + r, n) - 1) / r)

  const deposited = PV + PMT * n
  const profit = FV - deposited
  const profitPct = deposited > 0 ? ((profit / deposited) * 100).toFixed(0) : 0

  animateResult('invest-total-value', FV)
  animateResult('invest-deposited', deposited)
  animateResult('invest-profit', profit)

  // Year-by-year data
  const labels = []
  const depositedArr = []
  const profitArr = []

  for (let y = 0; y <= years; y++) {
    const months = y * 12
    const cumDeposited = PV + PMT * months
    const cumValue = r === 0
      ? cumDeposited
      : PV * Math.pow(1 + r, months) + PMT * ((Math.pow(1 + r, months) - 1) / r)

    labels.push(y === 0 ? 'Start' : y + '. rok')
    depositedArr.push(Math.round(cumDeposited))
    profitArr.push(Math.max(0, Math.round(cumValue - cumDeposited)))
  }

  updateChart(labels, depositedArr, profitArr)

  // Inflation comparison for insight
  const inflRate = 0.03 // assume 3%
  const inflatedValue = deposited / Math.pow(1 + inflRate, years)
  const difference = FV - inflatedValue

  setInsight('insight-text', `
    Z vložených <strong>${formatCZK(deposited)}</strong> se díky složenému úročení stane
    <strong class="text-positive">${formatCZK(FV)}</strong>.
    Výnos tvoří <strong class="text-positive">${profitPct} %</strong> celkové hodnoty.
    <br><br>
    Pokud necháte peníze jen na účtu, inflace (3 % ročně) z nich za ${years} let udělá pouhých
    <strong class="text-warning">${formatCZK(inflatedValue)}</strong> v reálné hodnotě.
    Rozdíl oproti investování: <strong class="text-positive">${formatCZK(difference)}</strong>.
  `)
}

function updateChart(labels, depositedArr, profitArr) {
  const canvas = document.getElementById('invest-chart')
  if (!canvas) return

  const data = {
    labels,
    datasets: [
      {
        label: 'Vloženo',
        data: depositedArr,
        fill: 'origin',
        borderColor: COLORS.blue,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: COLORS.blue,
        tension: 0.3,
      },
      {
        label: 'Výnos (složené úročení)',
        data: profitArr,
        fill: '-1',
        borderColor: COLORS.gold,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: COLORS.gold,
        tension: 0.3,
      }
    ]
  }

  if (investChart) {
    investChart.data = data
    // Update gradient fills
    const ctx = canvas.getContext('2d')
    investChart.data.datasets[0].backgroundColor = createGradient(ctx, COLORS.blue, 0.4, 0.05)
    investChart.data.datasets[1].backgroundColor = createGradient(ctx, COLORS.gold, 0.35, 0.02)
    investChart.update('none')
  } else {
    const ctx = canvas.getContext('2d')
    data.datasets[0].backgroundColor = createGradient(ctx, COLORS.blue, 0.4, 0.05)
    data.datasets[1].backgroundColor = createGradient(ctx, COLORS.gold, 0.35, 0.02)

    investChart = new Chart(canvas, {
      type: 'line',
      data,
      options: {
        scales: {
          x: { ticks: { maxTicksLimit: 10 } },
          y: {
            stacked: true,
            ticks: {
              callback: (v) => {
                if (v >= 1000000) return (v / 1000000).toFixed(1) + 'M'
                if (v >= 1000) return (v / 1000).toFixed(0) + 'k'
                return v
              }
            }
          }
        },
        interaction: { mode: 'index', intersect: false },
        plugins: {
          tooltip: {
            callbacks: { label: tooltipCZK }
          }
        }
      }
    })
  }
}

export function initInvestmentCalc() {
  syncInputs('invest-initial-range', 'invest-initial', calculate)
  syncInputs('invest-monthly-range', 'invest-monthly', calculate)
  syncInputs('invest-return-range', 'invest-return', calculate)
  syncInputs('invest-years-range', 'invest-years', calculate)

  initRangeFills()
  calculate()
}
