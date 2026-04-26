import Chart from 'chart.js/auto';
import { marketData, formatCurrency } from './market-data.js';
import { chartColors, formatYAxisCurrency } from './chart-theme-2.js';
import { estimateGrossFromNet } from './wage-3.js';

let investmentChartInstance = null;
const animationFrames = new Map();

function animateValue(element, end, prefix = '', duration = 800) {
    if (!element) return;
    const startVal = parseInt(element.dataset.currentVal || '0', 10) || 0;
    if (startVal === end) return;

    if (animationFrames.has(element)) cancelAnimationFrame(animationFrames.get(element));

    const startTime = performance.now();
    const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        const current = Math.round(startVal + (end - startVal) * eased);
        element.textContent = prefix + formatCurrency(current);
        element.dataset.currentVal = current;
        if (progress < 1) {
            animationFrames.set(element, requestAnimationFrame(update));
        } else {
            element.dataset.currentVal = end;
            animationFrames.delete(element);
        }
    };
    animationFrames.set(element, requestAnimationFrame(update));
}

function computeGrowth(initial, monthly, years, annualRate) {
    const monthlyRate = annualRate / 12;
    let value = initial;
    for (let y = 0; y < years; y++) {
        for (let m = 0; m < 12; m++) {
            value = value * (1 + monthlyRate) + monthly;
        }
    }
    return value;
}

// Výpočet státního důchodu dle redukčních hranic MPSV
function calculateStatePension(grossWage, insuranceYears) {
    const p = marketData.pension;
    let calculationBase = 0;

    if (grossWage <= p.reductionLimit1) {
        calculationBase = grossWage * p.reductionCoeff1;
    } else if (grossWage <= p.reductionLimit2) {
        calculationBase = p.reductionLimit1 * p.reductionCoeff1 + (grossWage - p.reductionLimit1) * p.reductionCoeff2;
    } else {
        calculationBase = p.reductionLimit1 * p.reductionCoeff1 + (p.reductionLimit2 - p.reductionLimit1) * p.reductionCoeff2;
    }

    const percentAmt = calculationBase * (insuranceYears * p.percentPerYear);
    return Math.round(p.basicAmount + percentAmt);
}

// Výpočet DPS státního příspěvku — 20 % z celého vkladu (500 Kč = min. pro nárok)
function calculateDPSSupport(monthlyContrib) {
    if (monthlyContrib < marketData.dps.stateSupportMinTotal) return 0;
    const eligible = Math.min(monthlyContrib, marketData.dps.stateSupportOptimal);
    return Math.round(eligible * 0.20 * 12);
}

export function initInvestmentStory() {
    // Vstupy
    const sIncome = document.getElementById('slider-income');
    const sHorizon = document.getElementById('slider-horizon');
    const sMonthly = document.getElementById('slider-monthly');
    const sEmployer = document.getElementById('slider-employer');
    const sDelay = document.getElementById('slider-delay');
    const tState = document.getElementById('toggle-state');

    // Nové vstupy
    const sAge = document.getElementById('slider-age');
    const sInsYears = document.getElementById('slider-ins-years');
    const sSavings = document.getElementById('slider-savings');
    const riskBtns = document.querySelectorAll('.calc2-risk-btn');

    // Value labely
    const vIncome = document.getElementById('val-income');
    const vHorizon = document.getElementById('val-horizon');
    const vMonthly = document.getElementById('val-monthly');
    const vEmployer = document.getElementById('val-employer');
    const vDelay = document.getElementById('val-delay');
    const vAge = document.getElementById('val-age');
    const vInsYears = document.getElementById('val-ins-years');
    const vSavings = document.getElementById('val-savings');

    // KPI
    const kpiStatePension = document.getElementById('kpi-state-pension');
    const kpiGap = document.getElementById('kpi-gap');
    const kpiReplacement = document.getElementById('kpi-replacement');
    const kpiYearlySupport = document.getElementById('kpi-yearly-support');
    const kpiTotalWealth = document.getElementById('kpi-total-wealth');
    const kpiLoss = document.getElementById('kpi-loss');
    const kpiDuration = document.getElementById('kpi-duration');
    const kpiFeeImpact = document.getElementById('kpi-fee-impact');

    // Tabulka benefitů
    const benefitDps = document.getElementById('benefit-dps');
    const benefitTax = document.getElementById('benefit-tax');
    const benefitEmployer = document.getElementById('benefit-employer');
    const benefitTotal = document.getElementById('benefit-total');

    if (!sIncome) return;

    let riskProfile = 0.08; // Výchozí: dynamický

    // Risk profil tlačítka
    riskBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            riskBtns.forEach(b => b.classList.remove('calc2-risk-btn--active'));
            btn.classList.add('calc2-risk-btn--active');
            riskProfile = parseFloat(btn.dataset.rate);
            updateDashboard();
        });
    });

    // Synchronizace věk ↔ horizont
    if (sAge) {
        sAge.addEventListener('input', () => {
            const age = parseInt(sAge.value, 10);
            const newHorizon = Math.max(5, marketData.pension.retirementAge - age);
            if (sHorizon) {
                sHorizon.value = Math.min(newHorizon, parseInt(sHorizon.max, 10));
                updateSliderProgress(sHorizon);
            }
            // Auto-nastavení roků pojištění
            if (sInsYears) {
                sInsYears.value = Math.min(Math.max(0, age - 18), 45);
                updateSliderProgress(sInsYears);
            }
            updateSliderProgress(sAge);
            updateDashboard();
        });
    }

    function updateDashboard() {
        const income = parseInt(sIncome.value, 10);
        const horizon = parseInt(sHorizon.value, 10);
        const monthly = parseInt(sMonthly.value, 10);
        const employer = parseInt(sEmployer.value, 10);
        let delay = parseInt(sDelay.value, 10);
        const useStateSupport = tState.checked;
        const insuranceYears = sInsYears ? parseInt(sInsYears.value, 10) : marketData.pension.defaultInsuranceYears;
        const existingSavings = sSavings ? parseInt(sSavings.value, 10) : 0;

        // Limity na delay slideru
        sDelay.max = Math.max(0, horizon - 1);
        delay = Math.min(delay, parseInt(sDelay.max, 10));

        // Labely
        if (vIncome) vIncome.textContent = formatCurrency(income);
        if (vHorizon) vHorizon.textContent = `${horizon} let`;
        if (vMonthly) vMonthly.textContent = formatCurrency(monthly);
        if (vEmployer) vEmployer.textContent = formatCurrency(employer);
        if (vDelay) vDelay.textContent = `${delay} let`;
        if (vAge && sAge) vAge.textContent = `${sAge.value} let`;
        if (vInsYears) vInsYears.textContent = `${insuranceYears} let`;
        if (vSavings) vSavings.textContent = formatCurrency(existingSavings);

        // ── 1. Důchodová propast ──────────────────────
        // Přesná inverze čistá → hrubá mzda
        const grossWage = estimateGrossFromNet(income);

        const expectedPension = calculateStatePension(grossWage, insuranceYears);
        const incomeGap = income - expectedPension;
        const replacementRatio = income > 0 ? Math.round((expectedPension / income) * 100) : 0;

        animateValue(kpiStatePension, expectedPension);
        animateValue(kpiGap, Math.max(0, incomeGap), '- ');
        if (kpiReplacement) kpiReplacement.textContent = replacementRatio;

        // ── 2. Státní podpora (DPS/DIP) ───────────────
        let stateContribYearly = 0;
        let taxSavingYearly = 0;

        if (useStateSupport) {
            let dpsInput = 0;
            let dipInput = 0;

            if (monthly <= marketData.dps.stateSupportOptimal) {
                dpsInput = monthly;
            } else {
                dpsInput = marketData.dps.stateSupportOptimal;
                dipInput = monthly - marketData.dps.stateSupportOptimal;
            }

            stateContribYearly = calculateDPSSupport(dpsInput);

            const dpsTaxBase = Math.max(0, dpsInput - marketData.dps.stateSupportOptimal);
            const totalTaxBase = Math.min((dipInput + dpsTaxBase) * 12, marketData.dip.taxDeductionMaxYearly);
            taxSavingYearly = totalTaxBase * marketData.dip.taxRate;

            const totalSupport = stateContribYearly + taxSavingYearly + (employer > 0 ? employer * 12 : 0);
            animateValue(kpiYearlySupport, totalSupport, '+ ');
            kpiYearlySupport.style.color = '';

            // Tabulka benefitů
            if (benefitDps) benefitDps.textContent = formatCurrency(stateContribYearly);
            if (benefitTax) benefitTax.textContent = formatCurrency(taxSavingYearly);
            if (benefitEmployer) benefitEmployer.textContent = formatCurrency(employer * 12);
            if (benefitTotal) benefitTotal.textContent = formatCurrency(totalSupport);
        } else {
            if (kpiYearlySupport) {
                kpiYearlySupport.textContent = '0 Kč';
                kpiYearlySupport.dataset.currentVal = 0;
                kpiYearlySupport.style.color = 'var(--text-muted)';
            }
            if (benefitDps) benefitDps.textContent = '—';
            if (benefitTax) benefitTax.textContent = '—';
            if (benefitEmployer) benefitEmployer.textContent = '—';
            if (benefitTotal) benefitTotal.textContent = '—';
        }

        // ── 3. Modely zhodnocení ──────────────────────
        const monthlyTotal = useStateSupport
            ? monthly + employer + ((stateContribYearly + taxSavingYearly) / 12)
            : monthly;

        const returnRate = riskProfile;

        // Scénář 1: Ihned
        const wealthNow = computeGrowth(existingSavings, monthlyTotal, horizon, returnRate);

        // Scénář 2: S prodlením
        const effectiveYears = Math.max(0, horizon - delay);
        const cashDuringDelay = delay > 0 ? monthly * 12 * delay + existingSavings : existingSavings;
        const wealthLater = delay > 0
            ? computeGrowth(cashDuringDelay, monthlyTotal, effectiveYears, returnRate)
            : wealthNow;

        animateValue(kpiTotalWealth, Math.round(wealthNow));

        const loss = wealthNow - wealthLater;
        animateValue(kpiLoss, Math.round(loss), '- ');

        // ── 4. Pokrytí propasti ───────────────────────
        if (kpiDuration) {
            if (incomeGap <= 0) {
                kpiDuration.textContent = 'Propast nevzniká';
            } else if (wealthNow <= 0) {
                kpiDuration.textContent = '0 let';
            } else {
                const yearlyGap = incomeGap * 12;
                const durationYears = (wealthNow / yearlyGap).toFixed(1);
                kpiDuration.textContent = `${durationYears.replace('.', ',')} let`;
            }
        }

        // ── 5. Dopad poplatků ─────────────────────────
        if (kpiFeeImpact) {
            const feeRate = 0.01; // 1% TER
            const wealthWithFee = computeGrowth(existingSavings, monthlyTotal, horizon, returnRate - feeRate);
            const feeImpact = Math.round(wealthNow - wealthWithFee);
            kpiFeeImpact.textContent = '- ' + formatCurrency(feeImpact);
        }

        drawCompactChart(horizon, delay, monthly, monthlyTotal, returnRate, existingSavings);
    }

    function drawCompactChart(years, delay, rawMonthly, totalEngineMonthly, returnRate, initialSaved) {
        const ctx = document.getElementById('chart-investment');
        if (!ctx) return;

        const labels = [];
        const dataWait = [];
        const dataNow = [];

        let currentWaitCash = initialSaved;

        for (let y = 0; y <= years; y++) {
            labels.push(`Rok ${y}`);

            if (y <= delay) {
                currentWaitCash = initialSaved + (rawMonthly * 12 * y);
                dataWait.push(Math.round(currentWaitCash));
            } else {
                const activeTime = y - delay;
                dataWait.push(Math.round(computeGrowth(currentWaitCash, totalEngineMonthly, activeTime, returnRate)));
            }

            dataNow.push(Math.round(computeGrowth(initialSaved, totalEngineMonthly, y, returnRate)));
        }

        const datasets = [];

        if (delay > 0) {
            datasets.push({
                label: 'S vyčkávací prodlevou ' + delay + ' ' + (delay === 1 ? 'rok' : delay < 5 ? 'roky' : 'let'),
                data: dataWait,
                borderColor: chartColors.red.solid,
                backgroundColor: 'rgba(255, 76, 76, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHitRadius: 10,
            });
        }

        datasets.push({
            label: delay > 0 ? 'Start od dnes' : 'Vývoj vašeho majetku',
            data: dataNow,
            borderColor: chartColors.gold.solid,
            backgroundColor: 'rgba(212, 175, 55, 0.15)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHitRadius: 10,
        });

        if (investmentChartInstance) {
            investmentChartInstance.data.labels = labels;
            investmentChartInstance.data.datasets = datasets;
            investmentChartInstance.update();
        } else {
            investmentChartInstance = new Chart(ctx, {
                type: 'line',
                data: { labels, datasets },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: { mode: 'index', intersect: false },
                    scales: {
                        x: { display: true },
                        y: {
                            display: true,
                            ticks: { callback: formatYAxisCurrency }
                        }
                    },
                    plugins: {
                        legend: { position: 'bottom', labels: { color: '#ffffff' } },
                        tooltip: {
                            callbacks: {
                                label: (c) => c.dataset.label + ': ' + formatCurrency(c.raw)
                            }
                        }
                    }
                }
            });
        }
    }

    function updateSliderProgress(slider) {
        if (!slider) return;
        const min = parseFloat(slider.min) || 0;
        const max = parseFloat(slider.max) || 100;
        const val = parseFloat(slider.value) || 0;
        const actualVal = Math.min(Math.max(val, min), max);
        const pct = ((actualVal - min) / (max - min)) * 100;
        slider.style.setProperty('--progress', pct + '%');
    }

    const sliders = [sIncome, sHorizon, sMonthly, sEmployer, sDelay, sAge, sInsYears, sSavings].filter(Boolean);

    sliders.forEach(el => {
        updateSliderProgress(el);
        el.addEventListener('input', () => {
            updateSliderProgress(el);
            // Přeskočit age — má vlastní handler
            if (el !== sAge) updateDashboard();
        });
    });

    [tState].filter(Boolean).forEach(el => el.addEventListener('change', updateDashboard));

    // Accordion toggle
    document.querySelectorAll('.calc2-accordion-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const expanded = trigger.getAttribute('aria-expanded') === 'true';
            trigger.setAttribute('aria-expanded', !expanded);
            const body = trigger.nextElementSibling;
            if (body) body.classList.toggle('calc2-accordion-body--open', !expanded);
        });
    });

    // Touch support for hover tooltips
    document.querySelectorAll('.calc2-tooltip-icon').forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.stopPropagation();
            // Close all other open tooltips
            document.querySelectorAll('.calc2-tooltip-icon--active').forEach(other => {
                if (other !== icon) other.classList.remove('calc2-tooltip-icon--active');
            });
            icon.classList.toggle('calc2-tooltip-icon--active');
        });
    });
    document.addEventListener('click', () => {
        document.querySelectorAll('.calc2-tooltip-icon--active').forEach(el => {
            el.classList.remove('calc2-tooltip-icon--active');
        });
    });

    updateDashboard();
}
