// src/calculators/pension.js
// Pension (DPS) calculator with stacked area chart

import { Chart, COLORS, createGradient, tooltipCZK } from './chart-theme.js'
import { formatCZK, syncInputs, animateResult, initRangeFills, setInsight } from './shared.js'

let pensionChart = null

function getStateContribution(monthly) {
  if (monthly >= 1000) return 230
  if (monthly >= 900) return 210
  if (monthly >= 800) return 190
  if (monthly >= 700) return 170
  if (monthly >= 600) return 150
  if (monthly >= 500) return 130
  if (monthly >= 400) return 110
  if (monthly >= 300) return 90
  return 0
}

function calculate() {
  const deposit = parseFloat(document.getElementById('pension-monthly').value)
  const years = parseInt(document.getElementById('pension-years').value)
  const annual = parseFloat(document.getElementById('pension-return').value) / 100
  const r = annual / 12
  const n = years * 12

  const stateCont = getStateContribution(deposit)
  const totalMonthlyIn = deposit + stateCont

  // Total value with compound interest
  const totalValue = r === 0
    ? totalMonthlyIn * n
    : totalMonthlyIn * ((Math.pow(1 + r, n) - 1) / r)

  const totalDeposited = deposit * n
  const totalState = stateCont * n
  const totalGrowth = totalValue - totalDeposited - totalState

  // Tax savings: 15% of amount above 1700/month, max 24000/year deductible
  const annualAbove1700 = Math.max(0, (deposit - 1700)) * 12
  const annualDeductible = Math.min(annualAbove1700, 24000)
  const annualTaxSaving = annualDeductible * 0.15

  animateResult('pension-total', totalValue)
  animateResult('pension-saved', totalDeposited)
  animateResult('pension-state', totalState)
  animateResult('pension-tax', annualTaxSaving)

  // Year-by-year data
  const labels = []
  const depositsArr = []
  const stateArr = []
  const growthArr = []

  for (let y = 0; y <= years; y++) {
    const months = y * 12
    const cumDeposit = deposit * months
    const cumState = stateCont * months
    const cumTotal = r === 0
      ? totalMonthlyIn * months
      : totalMonthlyIn * ((Math.pow(1 + r, months) - 1) / r)
    const cumGrowth = Math.max(0, cumTotal - cumDeposit - cumState)

    labels.push(y === 0 ? 'Start' : y + '. rok')
    depositsArr.push(Math.round(cumDeposit))
    stateArr.push(Math.round(cumState))
    growthArr.push(Math.round(cumGrowth))
  }

  updateChart(labels, depositsArr, stateArr, growthArr)

  // Insight — missed opportunity if deposit < 1000
  const optimalState = getStateContribution(1000)
  const missedState = (optimalState - stateCont) * 12
  const missedTax = deposit < 1700 ? 0 : annualTaxSaving
  const optimalTax = Math.min(Math.max(0, (1000 - 1700)) * 12, 24000) * 0.15 // 0 for 1000

  let insightHtml = `
    Za <strong>${years} let</strong> naspoříte celkem
    <strong class="text-positive">${formatCZK(totalValue)}</strong>,
    z toho <strong class="text-positive">${formatCZK(totalState)}</strong> vám přidá stát
    a na daních ročně ušetříte <strong class="text-positive">${formatCZK(annualTaxSaving)}</strong>.
  `

  if (deposit < 1000) {
    const totalMissed = missedState * years
    insightHtml += `
      <br><br>
      Při vkladu nižším než 1 000 Kč/měs. nevyužíváte maximální státní příspěvek.
      Ročně přicházíte o <strong class="text-warning">${formatCZK(missedState)}</strong> na státních příspěvcích.
      Za celou dobu spoření je to <strong class="text-warning">${formatCZK(totalMissed)}</strong>,
      které necháváte ležet na stole.
    `
  }

  setInsight('insight-text', insightHtml)
}

function updateChart(labels, depositsArr, stateArr, growthArr) {
  const canvas = document.getElementById('pension-chart')
  if (!canvas) return

  const data = {
    labels,
    datasets: [
      {
        label: 'Vaše vklady',
        data: depositsArr,
        fill: 'origin',
        borderColor: COLORS.blue,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        tension: 0.3,
      },
      {
        label: 'Státní příspěvky',
        data: stateArr,
        fill: '-1',
        borderColor: COLORS.cyan,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        tension: 0.3,
      },
      {
        label: 'Zhodnocení fondu',
        data: growthArr,
        fill: '-1',
        borderColor: COLORS.gold,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        tension: 0.3,
      }
    ]
  }

  if (pensionChart) {
    pensionChart.data = data
    const ctx = canvas.getContext('2d')
    pensionChart.data.datasets[0].backgroundColor = createGradient(ctx, COLORS.blue, 0.4, 0.05)
    pensionChart.data.datasets[1].backgroundColor = createGradient(ctx, COLORS.cyan, 0.3, 0.03)
    pensionChart.data.datasets[2].backgroundColor = createGradient(ctx, COLORS.gold, 0.35, 0.02)
    pensionChart.update('none')
  } else {
    const ctx = canvas.getContext('2d')
    data.datasets[0].backgroundColor = createGradient(ctx, COLORS.blue, 0.4, 0.05)
    data.datasets[1].backgroundColor = createGradient(ctx, COLORS.cyan, 0.3, 0.03)
    data.datasets[2].backgroundColor = createGradient(ctx, COLORS.gold, 0.35, 0.02)

    pensionChart = new Chart(canvas, {
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

export function initPensionCalc() {
  syncInputs('pension-monthly-range', 'pension-monthly', calculate)
  syncInputs('pension-years-range', 'pension-years', calculate)
  syncInputs('pension-return-range', 'pension-return', calculate)

  initRangeFills()
  calculate()
}
