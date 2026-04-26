import Chart from 'chart.js/auto';
import { marketData, formatCurrency } from './market-data.js';
import { estimateGrossFromNet } from './wage-3.js';
import { chartColors } from './chart-theme-2.js';

export function initDisabilityStory() {
    const sliderIncome = document.getElementById('slider-income');
    const valIncome = document.getElementById('val-income');
    const sliderExpenses = document.getElementById('slider-expenses');
    const valExpenses = document.getElementById('val-expenses');
    const sliderAge = document.getElementById('slider-age');
    const valAge = document.getElementById('val-age');
    const sliderChildren = document.getElementById('slider-children');
    const valChildren = document.getElementById('val-children');
    
    const radiosEvent = document.querySelectorAll('input[name="event-type"]');
    const radiosDegree = document.querySelectorAll('input[name="disability-degree"]');
    
    const wrapperDisability = document.getElementById('wrapper-disability');
    const wrapperDeath = document.getElementById('wrapper-death');

    // KPI elements
    const kpiStatePension = document.getElementById('kpi-state-pension');
    const kpiGap = document.getElementById('kpi-gap');
    const kpiReplacement = document.getElementById('kpi-replacement');

    let chartDisability = null;

    function calculateDisabilityPension(netIncome, degree, age) {
        const p = marketData.pension;

        // Přesná inverze čistá → hrubá mzda
        const gross = estimateGrossFromNet(netIncome);

        // Redukční hranice (2026 z market-data.js)
        let vZ = 0;
        if (gross <= p.reductionLimit1) {
            vZ = gross * p.reductionCoeff1; // 0.99 (novinka 2026)
        } else if (gross <= p.reductionLimit2) {
            vZ = p.reductionLimit1 * p.reductionCoeff1 + (gross - p.reductionLimit1) * p.reductionCoeff2;
        } else {
            vZ = p.reductionLimit1 * p.reductionCoeff1 + (p.reductionLimit2 - p.reductionLimit1) * p.reductionCoeff2;
        }

        // Roky pojištění odvozené z věku (min 0, max 45)
        const insuranceYears = Math.min(Math.max(0, age - 18), 45);

        // Procentní sazba dle stupně invalidity × roky pojištění
        let percentPerYear = 0;
        if (degree === 1) percentPerYear = 0.005;  // 0.5% za rok
        if (degree === 2) percentPerYear = 0.0075; // 0.75% za rok
        if (degree === 3) percentPerYear = 0.015;  // 1.5% za rok

        const percentMultiplier = percentPerYear * insuranceYears;

        return Math.round(p.basicAmount + (vZ * percentMultiplier));
    }

    function calculateSickness(netIncome) {
        const s = marketData.sickness;
        const gross = estimateGrossFromNet(netIncome);
        const dvz = gross / 30; // hrubý denní vyměřovací základ approximace 30 dní měsíc
        let reducedDvz = 0;
        
        if (dvz <= s.reductionLimit1_daily) {
            reducedDvz = dvz * s.reductionCoeff1;
        } else if (dvz <= s.reductionLimit2_daily) {
            reducedDvz = s.reductionLimit1_daily * s.reductionCoeff1 + (dvz - s.reductionLimit1_daily) * s.reductionCoeff2;
        } else if (dvz <= s.reductionLimit3_daily) {
            reducedDvz = s.reductionLimit1_daily * s.reductionCoeff1 + (s.reductionLimit2_daily - s.reductionLimit1_daily) * s.reductionCoeff2 + (dvz - s.reductionLimit2_daily) * s.reductionCoeff3;
        } else {
             reducedDvz = s.reductionLimit1_daily * s.reductionCoeff1 + (s.reductionLimit2_daily - s.reductionLimit1_daily) * s.reductionCoeff2 + (s.reductionLimit3_daily - s.reductionLimit2_daily) * s.reductionCoeff3;
        }
        
        const dailySickness = reducedDvz * s.sicknessRate;
        return Math.round(dailySickness * 30);
    }

    function calculateSurvivorPension(netIncome, childrenCount) {
        const p = marketData.pension;
        const gross = estimateGrossFromNet(netIncome);
        
        // Zjištění procentní výměry z invalidního důchodu III. stupně (max propad)
        let vZ = 0;
        if (gross <= p.reductionLimit1) {
            vZ = gross * p.reductionCoeff1;
        } else if (gross <= p.reductionLimit2) {
            vZ = p.reductionLimit1 * p.reductionCoeff1 + (gross - p.reductionLimit1) * p.reductionCoeff2;
        } else {
            vZ = p.reductionLimit1 * p.reductionCoeff1 + (p.reductionLimit2 - p.reductionLimit1) * p.reductionCoeff2;
        }
        
        const percentMultiplier = 0.015 * p.defaultInsuranceYears;
        const procentniVymera = vZ * percentMultiplier;
        
        let total = 0;
        // Vdovský důchod: 50 % procentní výměry + 1x základní výměra
        total += p.basicAmount + (procentniVymera * p.widowPercent);
        
        // Sirotčí důchod: 40 % procentní výměry + 1x základní výměra na každé dítě
        for (let i = 0; i < childrenCount; i++) {
             total += p.basicAmount + (procentniVymera * p.orphanPercent);
        }
        
        return Math.round(total);
    }

    function updateDashboard() {
        if (!sliderIncome || !sliderExpenses) return;

        const netIncome = parseInt(sliderIncome.value, 10);
        const fixedExpenses = parseInt(sliderExpenses.value, 10);
        const age = sliderAge ? parseInt(sliderAge.value, 10) : 35;

        // Typ události
        let eventType = 'disability';
        if (radiosEvent && radiosEvent.length > 0) {
            radiosEvent.forEach(radio => {
                if (radio.checked) eventType = radio.value;
            });
        }

        // Toggles UI
        if (wrapperDisability) wrapperDisability.style.display = (eventType === 'disability') ? 'block' : 'none';
        if (wrapperDeath) wrapperDeath.style.display = (eventType === 'death') ? 'block' : 'none';

        const kpiStateLabel = document.getElementById('kpi-state-label');
        let statePension = 0;

        if (eventType === 'sickness') {
             statePension = calculateSickness(netIncome);
             if (kpiStateLabel) kpiStateLabel.innerHTML = 'Nemocenská dávka (Odhad)\n' +
                                '<span class="calc2-tooltip-icon">i\n' +
                                    '<div class="calc2-tooltip-content" id="kpi-state-tooltip">\n' +
                                        '60 % z Vašeho denního vyměřovacího základu po redukci od 15. do 30. dne neschopnosti v měsíci.\n' +
                                    '</div>\n' +
                                '</span>';
        } else if (eventType === 'death') {
             const children = sliderChildren ? parseInt(sliderChildren.value, 10) : 0;
             if (valChildren) valChildren.textContent = children === 1 ? '1 dítě' : (children >= 2 && children <= 4 ? children + ' děti' : children + ' dětí');
             statePension = calculateSurvivorPension(netIncome, children);
             
             if (kpiStateLabel) kpiStateLabel.innerHTML = 'Vdovský a sirotčí důchod\n' +
                                '<span class="calc2-tooltip-icon">i\n' +
                                    '<div class="calc2-tooltip-content" id="kpi-state-tooltip">\n' +
                                        'Jeden vdovský důchod (50 %) a sirotčí důchody (každý 40 %) společně se základními dotacemi od státu dle zadaného počtu dětí.\n' +
                                    '</div>\n' +
                                '</span>';
        } else {
             // Disability
             let selectedDegree = 3;
             radiosDegree.forEach(radio => {
                 if (radio.checked) selectedDegree = parseInt(radio.value, 10);
             });
             statePension = calculateDisabilityPension(netIncome, selectedDegree, age);
             if (kpiStateLabel) kpiStateLabel.innerHTML = 'Státní invalidní důchod (Odhad)\n' +
                                '<span class="calc2-tooltip-icon">i\n' +
                                    '<div class="calc2-tooltip-content" id="kpi-state-tooltip">\n' +
                                        'Částka ovlivněna redukčními hranicemi MPSV 2026. Státní základ je 4 900 Kč, zbytek tvoří procentuální výměra procento platu.\n' +
                                    '</div>\n' +
                                '</span>';
        }

        const gap = statePension - fixedExpenses;
        const replacementRatio = netIncome > 0 ? Math.round((statePension / netIncome) * 100) : 0;

        // Labels
        if (valIncome) valIncome.textContent = formatCurrency(netIncome);
        if (valExpenses) valExpenses.textContent = formatCurrency(fixedExpenses);
        if (valAge) valAge.textContent = `${age} let`;

        // KPI
        if (kpiStatePension) kpiStatePension.textContent = formatCurrency(statePension);
        if (kpiGap) kpiGap.textContent = formatCurrency(gap);
        if (kpiReplacement) kpiReplacement.textContent = `${replacementRatio} %`;

        // Barvy dle gapu
        if (kpiGap) {
            if (gap < 0) {
                kpiGap.style.color = '#ff4c4c';
                kpiGap.parentElement.style.background = 'rgba(255, 76, 76, 0.05)';
                kpiGap.parentElement.style.borderTopColor = '#ff4c4c';
            } else {
                kpiGap.style.color = '#4CAF50';
                kpiGap.parentElement.style.background = 'rgba(76, 175, 80, 0.05)';
                kpiGap.parentElement.style.borderTopColor = '#4CAF50';
            }
        }

        updateChart(netIncome, fixedExpenses, statePension);
    }

    function updateChart(income, expenses, pension) {
        const ctx = document.getElementById('chart-disability');
        if (!ctx) return;

        if (!chartDisability) {
            Chart.defaults.color = "rgba(255,255,255,0.6)";
            Chart.defaults.font.family = "'Inter', sans-serif";

            chartDisability = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Měsíční bilance domácnosti'],
                    datasets: [
                        {
                            label: 'Původní čistý plat',
                            data: [income],
                            backgroundColor: 'rgba(255, 255, 255, 0.15)',
                            borderColor: 'transparent',
                            borderRadius: 4,
                            barPercentage: 0.9,
                            categoryPercentage: 0.9
                        },
                        {
                            label: 'Státní důchod a realita',
                            data: [pension],
                            backgroundColor: chartColors.red.solid,
                            borderColor: 'transparent',
                            borderRadius: 4,
                            barPercentage: 0.9,
                            categoryPercentage: 0.9
                        },
                        {
                            label: 'Fixní potřebné výdaje',
                            data: [expenses],
                            backgroundColor: chartColors.gold.solid,
                            borderColor: 'transparent',
                            borderRadius: 4,
                            barPercentage: 0.9,
                            categoryPercentage: 0.9
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(255,255,255,0.05)' },
                            ticks: {
                                callback: function (value) {
                                    return value / 1000 + 'k';
                                }
                            }
                        },
                        x: {
                            grid: { display: false }
                        }
                    },
                    plugins: {
                        legend: { position: 'bottom' },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    return context.dataset.label + ': ' + formatCurrency(context.raw);
                                }
                            }
                        }
                    }
                }
            });
        } else {
            chartDisability.data.datasets[0].data = [income];
            chartDisability.data.datasets[1].data = [pension];
            chartDisability.data.datasets[2].data = [expenses];
            chartDisability.update();
        }
    }

    function updateSliderProgress(slider) {
        if (!slider) return;
        const min = parseFloat(slider.min) || 0;
        const max = parseFloat(slider.max) || 100;
        const val = parseFloat(slider.value) || 0;
        const pct = ((Math.min(Math.max(val, min), max) - min) / (max - min)) * 100;
        slider.style.setProperty('--progress', pct + '%');
    }

    // Event listeners
    [sliderIncome, sliderExpenses, sliderAge, sliderChildren].filter(Boolean).forEach(el => {
        updateSliderProgress(el);
        ['input', 'change'].forEach(evt => el.addEventListener(evt, () => {
            updateSliderProgress(el);
            updateDashboard();
        }));
    });

    radiosDegree.forEach(radio => radio.addEventListener('change', updateDashboard));
    radiosEvent.forEach(radio => radio.addEventListener('change', updateDashboard));

    // Tooltip handling
    const tooltipIcons = document.querySelectorAll('.calc2-tooltip-icon');
    tooltipIcons.forEach(icon => {
        icon.addEventListener('mouseenter', () => icon.classList.add('active'));
        icon.addEventListener('mouseleave', () => icon.classList.remove('active'));
        icon.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const isActive = icon.classList.contains('active');
            tooltipIcons.forEach(i => i.classList.remove('active'));
            if (!isActive) icon.classList.add('active');
        });
    });

    // Initial render
    requestAnimationFrame(() => updateDashboard());
}
