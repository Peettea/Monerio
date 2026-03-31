// src/calculators/inflation.js
// Inflation calculator with area chart showing purchasing power decline

import { Chart, COLORS, createGradient, tooltipCZK } from './chart-theme.js'
import { formatCZK, syncInputs, animateResult, initRangeFills, setInsight } from './shared.js'

let inflationChart = null

function calculate() {
  const PV = parseFloat(document.getElementById('inflation-amount').value)
  const rate = parseFloat(document.getElementById('inflation-rate').value) / 100
  const years = parseInt(document.getElementById('inflation-years').value)

  const real = PV / Math.pow(1 + rate, years)
  const lossKc = PV - real
  const monthlyLoss = lossKc / (years * 12)

  animateResult('inflation-real-value', real)
  animateResult('inflation-loss-kc', lossKc)
  animateResult('inflation-monthly-loss', monthlyLoss)

  // Year-by-year data
  const labels = []
  const nominalArr = []
  const realArr = []

  for (let y = 0; y <= years; y++) {
    labels.push(y === 0 ? 'Dnes' : y + '. rok')
    nominalArr.push(Math.round(PV))
    realArr.push(Math.round(PV / Math.pow(1 + rate, y)))
  }

  updateChart(labels, nominalArr, realArr)

  const lossPct = ((lossKc / PV) * 100).toFixed(0)

  setInsight('insight-text', `
    Za <strong>${years} let</strong> bude mít váš <strong>${formatCZK(PV)}</strong>
    kupní sílu pouhých <strong class="text-warning">${formatCZK(real)}</strong>.
    Přicházíte o přibližně <strong class="text-warning">${formatCZK(monthlyLoss)}</strong> měsíčně
    — to je jako byste každý měsíc vyhodili tuto částku z okna.
    <br><br>
    Celkem ztratíte <strong class="text-warning">${lossPct} %</strong> kupní síly.
    Existují způsoby, jak úspory ochránit a zároveň k nim mít přístup.
  `)
}

function updateChart(labels, nominalArr, realArr) {
  const canvas = document.getElementById('inflation-chart')
  if (!canvas) return

  const data = {
    labels,
    datasets: [
      {
        label: 'Nominální hodnota',
        data: nominalArr,
        borderColor: COLORS.muted,
        borderWidth: 2,
        borderDash: [6, 4],
        pointRadius: 0,
        fill: false,
        tension: 0,
      },
      {
        label: 'Reálná kupní síla',
        data: realArr,
        borderColor: COLORS.red,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: COLORS.red,
        fill: 'origin',
        tension: 0.3,
      }
    ]
  }

  if (inflationChart) {
    inflationChart.data = data
    const ctx = canvas.getContext('2d')
    inflationChart.data.datasets[1].backgroundColor = createGradient(ctx, COLORS.red, 0.3, 0.03)
    inflationChart.update('none')
  } else {
    const ctx = canvas.getContext('2d')
    data.datasets[1].backgroundColor = createGradient(ctx, COLORS.red, 0.3, 0.03)

    inflationChart = new Chart(canvas, {
      type: 'line',
      data,
      options: {
        scales: {
          x: { ticks: { maxTicksLimit: 10 } },
          y: {
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

export function initInflationCalc() {
  syncInputs('inflation-amount-range', 'inflation-amount', calculate)
  syncInputs('inflation-rate-range', 'inflation-rate', calculate)
  syncInputs('inflation-years-range', 'inflation-years', calculate)

  initRangeFills()
  calculate()
}
