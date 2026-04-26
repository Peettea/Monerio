import Chart from 'chart.js/auto';
import { marketData, formatCurrency } from './market-data.js';
import { chartColors, formatYAxisCurrency } from './chart-theme-2.js';

// ═══════════════════════════════════════════════════
// CHART INSTANCE
// ═══════════════════════════════════════════════════
let chartInaction = null;
let chartHistMortgage = null;
let chartHistRates = null;

// ═══════════════════════════════════════════════════
// HISTORICAL DATA (hardcoded — these are facts)
// ═══════════════════════════════════════════════════
const HISTORY = {
    hypoindex: {
        labels: ['2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'],
        rates: [5.69, 5.66, 4.93, 4.10, 3.54, 3.20, 2.94, 2.36, 1.77, 2.08, 2.77, 2.68, 2.02, 2.37, 5.34, 5.90, 5.03, 4.70, 4.46],
    },
    // ČBA Hypomonitor — průměrná výše nové hypotéky (mil. Kč, roční průměry)
    avgMortgageSize: {
        labels: ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'],
        amountsMil: [1.98, 2.12, 2.32, 2.45, 2.76, 3.20, 3.20, 3.10, 3.70, 4.21, 4.56],
    },
};

// ═══════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════
function monthlyPayment(principal, annualRate, years) {
    const r = annualRate / 12;
    const n = years * 12;
    if (r === 0) return principal / n;
    return principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
}

const animationFrames = new Map();
function animateValue(element, end, prefix = '', duration = 500) {
    if (!element) return;
    const startVal = parseInt(element.dataset.currentVal || '0', 10) || 0;
    if (startVal === end) return;
    if (animationFrames.has(element)) cancelAnimationFrame(animationFrames.get(element));
    const startTime = performance.now();
    const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
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

function updateSliderProgress(slider) {
    if (!slider) return;
    const pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.setProperty('--progress', pct + '%');
}

function computeRentOverYears(monthlyRent, growthRate, years) {
    let total = 0;
    let rent = monthlyRent;
    for (let y = 0; y < years; y++) {
        total += rent * 12;
        rent *= (1 + growthRate);
    }
    return total;
}

function computeTaxDeductionYearly(principal, annualRate, years) {
    // Returns first-year tax deduction (highest, since interest is highest in year 1)
    const monthlyRate = annualRate / 12;
    const payment = monthlyPayment(principal, annualRate, years);
    let remaining = principal;
    let yearInterest = 0;
    for (let m = 0; m < 12; m++) {
        const interest = remaining * monthlyRate;
        yearInterest += interest;
        remaining -= (payment - interest);
    }
    const deductible = Math.min(yearInterest, marketData.taxDeductionLimit);
    return Math.round(deductible * marketData.taxDeductionRate);
}

function computePrincipalPaidInYears(principal, annualRate, termYears, periodYears) {
    const monthlyRate = annualRate / 12;
    const payment = monthlyPayment(principal, annualRate, termYears);
    let remaining = principal;
    let totalPrincipal = 0;
    let totalInterest = 0;
    const months = Math.min(periodYears * 12, termYears * 12);
    for (let m = 0; m < months; m++) {
        const interest = remaining * monthlyRate;
        const princ = payment - interest;
        totalPrincipal += princ;
        totalInterest += interest;
        remaining -= princ;
    }
    return { principalPaid: totalPrincipal, interestPaid: totalInterest, totalPaid: totalPrincipal + totalInterest };
}

function czPlural(n, one, few, many) {
    if (n === 1) return one;
    if (n >= 2 && n <= 4) return few;
    return many;
}

// ═══════════════════════════════════════════════════
// TOOLTIP SYSTEM
// ═══════════════════════════════════════════════════
const tooltipContent = {
    'region': {
        title: 'Kde chcete bydlet?',
        body: 'Ceny nemovitostí se výrazně liší podle regionu. Praha je nejdražší, ale také nejlikvidnější trh. Vyberete-li region, automaticky se nastaví průměrná cena bytu v dané lokalitě.'
    },
    'price': {
        title: 'Cena nemovitosti',
        body: 'Aktuální tržní cena bytu nebo domu, o který máte zájem. Pro srovnání se podívejte na Sreality.cz nebo Bezrealitky.cz. Průměrné ceny se mohou výrazně lišit i v rámci jednoho města.'
    },
    'savings': {
        title: 'Vlastní úspory',
        body: 'Kolik peněz máte připravených v hotovosti na zálohu. Banka dle pravidel České národní banky zpravidla požaduje alespoň 20 % z ceny nemovitosti. Pokud je vám méně než 36 let, může stačit 10 %.'
    },
    'delay': {
        title: 'Kolik let ještě čekáte?',
        body: 'Kolik let plánujete čekat, než si vezmete hypotéku. Mezitím ceny nemovitostí rostou (průměrně asi 6–7 % ročně) a vaše naspořené peníze ztrácejí kupní sílu. Každý rok čekání vás stojí statisíce.'
    },
    'term': {
        title: 'Délka hypotéky',
        body: 'Na kolik let si od banky půjčujete. Delší doba znamená nižší měsíční splátku, ale zaplatíte víc na úrocích. Většina Čechů volí 25–30 let. Kratší doba = rychleji splatíte, ale vyšší měsíční zátěž.'
    },
    'rate': {
        title: 'Úroková sazba',
        body: 'Roční cena za půjčku od banky. Průměr, za který banky skutečně půjčují (únor 2026): 4,46 % podle České bankovní asociace. Monerio dokáže vyjednat výhodnější sazbu než průměr trhu.'
    },
    'young': {
        title: 'Je mi méně než 36 let',
        body: 'Pokud vám ještě nebylo 36 let, Česká národní banka umožňuje bankám půjčit vám až 90 % z ceny nemovitosti (místo standardních 80 %). To znamená, že potřebujete méně vlastních úspor na začátek.'
    },
    'invest': {
        title: 'Kupuji na pronájem',
        body: 'Kupujete-li nemovitost jako investici (na pronájem), banka od vás bude chtít minimálně 30 % z ceny v hotovosti a přísnější posouzení vašich příjmů. Od 1. dubna 2026 platí nová pravidla ČNB pro investiční hypotéky.'
    },
    'loan-amount': {
        title: 'Výše hypotéky',
        body: 'Částka, kterou si skutečně půjčíte od banky. Vypočítá se jako cena nemovitosti mínus vaše vlastní úspory. Čím víc máte naspořeno, tím méně si půjčujete a tím nižší bude vaše splátka.'
    },
    'tax-deduction': {
        title: 'Daňová úspora z úroků',
        body: 'Z hypotečních úroků (maximálně 150 000 Kč ročně) si můžete odečíst 15 % z daní z příjmu. To je maximálně 22 500 Kč zpět každý rok. Platí pro smlouvy uzavřené od roku 2021 a byt musí sloužit jako vaše hlavní bydliště.'
    },
    'chart-avg-mortgage': {
        title: 'Proč hypotéky narůstají?',
        body: 'Ceny nemovitostí historicky utíkají tempu růstu platů. Lidé si musí půjčovat stále více, aby si mohli dovolit stejný byt. Kdo čeká, bude potřebovat mnohem vyšší půjčku (nebo si pořídí menší bydlení).'
    },
    'chart-hypoindex': {
        title: 'Sazby se normalizují',
        body: 'Extrémy z roku 2022 a 2023 opadly. Zatímco tehdy lidé platili obrovské úroky, dnes se realizované sazby vrátily k rozumným hodnotám. Pokud sazby dále klesnou, hypotéku lze výhodně refinancovat.'
    },
};

function initTooltips() {
    const tooltip = document.getElementById('mort-tooltip');
    const titleEl = document.getElementById('mort-tooltip-title');
    const bodyEl = document.getElementById('mort-tooltip-body');
    const closeBtn = tooltip?.querySelector('.mort-tooltip-close');
    if (!tooltip) return;

    function hideTooltip() {
        tooltip.classList.remove('mort-tooltip--visible');
        tooltip.setAttribute('aria-hidden', 'true');
    }

    document.querySelectorAll('.mort-info-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const key = btn.dataset.tooltip;
            const content = tooltipContent[key];
            if (!content) return;

            titleEl.textContent = content.title;
            bodyEl.textContent = content.body;

            if (window.innerWidth < 768) {
                tooltip.style.top = 'auto';
                tooltip.style.left = '16px';
                tooltip.style.right = '16px';
                tooltip.style.bottom = '16px';
            } else {
                const rect = btn.getBoundingClientRect();
                let top = rect.bottom + 12;
                let left = rect.left - 120;
                if (left < 16) left = 16;
                if (left + 340 > window.innerWidth) left = window.innerWidth - 356;
                if (top + 200 > window.innerHeight) top = rect.top - 220;
                tooltip.style.top = top + 'px';
                tooltip.style.left = left + 'px';
                tooltip.style.right = 'auto';
                tooltip.style.bottom = 'auto';
            }

            tooltip.classList.add('mort-tooltip--visible');
            tooltip.setAttribute('aria-hidden', 'false');
        });
    });

    closeBtn?.addEventListener('click', hideTooltip);
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.mort-tooltip') && !e.target.closest('.mort-info-btn')) {
            hideTooltip();
        }
    });
}

// ═══════════════════════════════════════════════════
// REGION SELECTOR
// ═══════════════════════════════════════════════════
let currentRegion = 'praha';

function initRegionSelector(sliderPrice, sliderSavings, updateFn) {
    const pills = document.querySelectorAll('.mort-pill');
    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            pills.forEach(p => p.classList.remove('mort-pill--active'));
            pill.classList.add('mort-pill--active');

            currentRegion = pill.dataset.region;
            const region = marketData.regions[currentRegion];
            if (region && sliderPrice) {
                sliderPrice.value = region.avgPrice;
                updateSliderProgress(sliderPrice);

                const defaultSavings = Math.round(region.avgPrice * 0.20 / 100000) * 100000;
                if (sliderSavings) {
                    sliderSavings.value = defaultSavings;
                    updateSliderProgress(sliderSavings);
                }
            }

            const hint = document.getElementById('hint-price');
            if (hint && region) {
                hint.textContent = `Průměrná cena bytu: ${region.label} ${formatCurrency(region.avgPrice)} (ČSÚ 2026)`;
            }

            updateFn();
        });
    });
}

// ═══════════════════════════════════════════════════
// RENT COMPARISON TABLE
// ═══════════════════════════════════════════════════
function updateRentComparison(el, { delay, avgRent, rentGrowth, paymentNow, principalNow, rate, term, price, appreciation }) {
    if (!el) return;

    if (delay === 0) {
        el.innerHTML = `
            <div class="bdt-section" style="padding: 24px; text-align: center; border: 1px solid var(--accent-gold); background: rgba(220, 169, 58, 0.05);">
                <div style="width: 48px; height: 48px; min-width: 48px; border-radius: 50%; background: var(--accent-gold); color: var(--bg-dark); display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h4 style="font-size: 1.25rem; font-family: var(--font-heading); font-weight: 700; margin-bottom: 8px; color: #fff;">Výborně! Koupit dnes je to nejlepší rozhodnutí.</h4>
                <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 20px;">
                    Peníze budete ihned vkládat do vlastního majetku a vyhnete se drasticky rostoucím cenám nájmů. Nechte si od nás zjistit vaše přesné limity na trhu.
                </p>
                <a href="/kontakt.html" class="btn btn--primary" style="display: inline-block;">Nezávazná konzultace</a>
            </div>
        `;
        return;
    }

    const rentTotal = computeRentOverYears(avgRent, rentGrowth, delay);
    const { principalPaid, interestPaid, totalPaid } = computePrincipalPaidInYears(principalNow, rate, term, delay);
    const propertyGrowth = price * Math.pow(1 + appreciation, delay) - price;

    // Čistý zisk bytu: Růst hodnoty + splacená jistina (to je náš majetek) - zaplacené úroky
    const netBenefit = principalPaid + propertyGrowth - interestPaid;

    // Obrovský psychologický trigger: Kolik člověk reálně projede (Propálený nájem + Nerealizovaný zisk z bytu)
    const totalCostOfInaction = rentTotal + Math.max(0, netBenefit);

    const delayLabel = `${delay} ${czPlural(delay, 'rok', 'roky', 'let')}`;

    el.innerHTML = `
        <div class="bdt-section">
            <div class="bdt-row bdt-row--section-header" style="color: #ff4c4c;">
                <span>Placení cizího (<span style="text-transform:lowercase">nájem za ${delayLabel} čekání</span>)</span>
            </div>
            <div class="bdt-row">
                <span>Zaplaceno na nájmu</span>
                <span class="bdt-val--negative">${formatCurrency(Math.round(rentTotal))}</span>
            </div>
            <div class="bdt-row">
                <span>Váš majetek (co vám zůstane)</span>
                <span>0 Kč</span>
            </div>
        </div>
        <div class="bdt-section">
            <div class="bdt-row bdt-row--section-header" style="color: #4CAF50;">
                <span>Vlastní bydlení (<span style="text-transform:lowercase">při koupi dnes</span>)</span>
            </div>
            <div class="bdt-row">
                <span>Měsíční splátky celkem (${delayLabel})</span>
                <span>${formatCurrency(Math.round(totalPaid))}</span>
            </div>
            <div class="bdt-row">
                <span>→ z toho jistina (váš majetek)</span>
                <span class="bdt-val--positive">${formatCurrency(Math.round(principalPaid))}</span>
            </div>
            <div class="bdt-row">
                <span>→ z toho úroky (cena půjčky)</span>
                <span class="bdt-val--negative">${formatCurrency(Math.round(interestPaid))}</span>
            </div>
            <div class="bdt-row">
                <span>Růst tržní hodnoty nemovitosti</span>
                <span class="bdt-val--positive">+${formatCurrency(Math.round(propertyGrowth))}</span>
            </div>
            <div class="bdt-row bdt-row--result" style="border-top: 1px dashed rgba(255,255,255,0.1); margin-top: 8px; padding-top: 12px;">
                <span>Čistý zisk z vlastnictví bytu<br><span style="font-size: 0.75rem; color: rgba(255,255,255,0.5); font-weight: normal;">splacená jistina + růst hodnoty − úroky</span></span>
                <span class="bdt-val--positive">${netBenefit >= 0 ? '+' : ''}${formatCurrency(Math.round(netBenefit))}</span>
            </div>
        </div>
        <div class="bdt-section" style="background: rgba(255, 76, 76, 0.05); border: 1px solid rgba(255, 76, 76, 0.15); padding: 16px 16px 10px; margin-top: 12px; border-radius: 12px;">
            <div class="bdt-row bdt-row--section-header" style="color: #ff4c4c; padding-top: 0;">
                <span style="font-size: 0.85rem">Celková cena za vyčkávání</span>
            </div>
            <div class="bdt-row bdt-row--result" style="border: none;">
                <span style="color: rgba(255,255,255,0.7); font-size: 0.9rem; font-weight: normal;">Dnes přicházíte o:</span>
                <span style="color: #ff4c4c; font-size: 1.3rem; white-space: nowrap;">-${formatCurrency(Math.round(totalCostOfInaction))}</span>
            </div>
        </div>
    `;
}

// ═══════════════════════════════════════════════════
// HISTORY CHARTS (static — rendered once)
// ═══════════════════════════════════════════════════
function initHistoryCharts() {
    // Property prices bar chart
    if (chartHistMortgage) { chartHistMortgage.destroy(); chartHistMortgage = null; }
    if (chartHistRates) { chartHistRates.destroy(); chartHistRates = null; }

    const ctxMortgage = document.getElementById('chart-hist-mortgage');
    if (ctxMortgage) {
        chartHistMortgage = new Chart(ctxMortgage, {
            type: 'bar',
            data: {
                labels: HISTORY.avgMortgageSize.labels,
                datasets: [{
                    label: 'mil. Kč',
                    data: HISTORY.avgMortgageSize.amountsMil,
                    backgroundColor: HISTORY.avgMortgageSize.amountsMil.map((_, i, arr) =>
                        i === arr.length - 1 ? chartColors.gold.solid : chartColors.gold.fill
                    ),
                    borderColor: chartColors.gold.solid,
                    borderWidth: 1,
                    borderRadius: 3,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (c) => c.raw.toFixed(2).replace('.', ',') + ' mil. Kč',
                        },
                    },
                },
                scales: {
                    x: { display: true, ticks: { maxRotation: 45, font: { size: 10 } } },
                    y: {
                        display: true,
                        ticks: { callback: (v) => v.toFixed(1).replace('.', ',') + ' mil.' },
                        suggestedMin: 1.5,
                    },
                },
            },
        });
    }

    // Hypoindex line chart
    const ctxRates = document.getElementById('chart-hist-rates');
    if (ctxRates) {
        chartHistRates = new Chart(ctxRates, {
            type: 'line',
            data: {
                labels: HISTORY.hypoindex.labels,
                datasets: [{
                    label: 'Realizovaná sazba %',
                    data: HISTORY.hypoindex.rates,
                    borderColor: chartColors.red.solid,
                    backgroundColor: (c) => {
                        if (!c.chart) return chartColors.red.fill;
                        const g = c.chart.ctx.createLinearGradient(0, 0, 0, c.chart.height);
                        g.addColorStop(0, 'rgba(255, 76, 76, 0.25)');
                        g.addColorStop(1, 'rgba(255, 76, 76, 0.02)');
                        return g;
                    },
                    borderWidth: 2.5,
                    fill: true,
                    tension: 0.3,
                    pointRadius: 3,
                    pointBackgroundColor: chartColors.red.solid,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (c) => c.raw.toFixed(2).replace('.', ',') + ' %',
                        },
                    },
                },
                scales: {
                    x: { display: true, ticks: { maxRotation: 45, font: { size: 10 } } },
                    y: {
                        display: true,
                        ticks: { callback: (v) => v.toFixed(1) + ' %' },
                        suggestedMin: 0,
                        suggestedMax: 7,
                    },
                },
            },
        });
    }
}

// ═══════════════════════════════════════════════════
// MAIN INIT
// ═══════════════════════════════════════════════════
export function initMortgageStory() {
    const sPrice = document.getElementById('slider-price');
    const sSavings = document.getElementById('slider-savings');
    const sDelay = document.getElementById('slider-delay');
    const sTerm = document.getElementById('slider-term');
    const sRate = document.getElementById('slider-rate');

    const vPrice = document.getElementById('val-price');
    const vSavings = document.getElementById('val-savings');
    const vDelay = document.getElementById('val-delay');
    const vTerm = document.getElementById('val-term');
    const vRate = document.getElementById('val-rate');

    const tYoung = document.getElementById('toggle-young');
    const tInvest = document.getElementById('toggle-invest');
    const warningLtv = document.getElementById('warning-ltv');

    // Sidebar: inaction box
    const kpiLossValue = document.getElementById('kpi-loss-value');
    const kpiPaymentDiff = document.getElementById('kpi-payment-diff');

    // Main: KPIs
    const kpiLoanAmount = document.getElementById('kpi-loan-amount');
    const kpiPaymentNow = document.getElementById('kpi-payment-now');
    const kpiTermDisplay = document.getElementById('kpi-term-display');
    const kpiRateDisplay = document.getElementById('kpi-rate-display');
    const benefitTax = document.getElementById('benefit-tax');

    // Rent comparison
    const rentComparisonEl = document.getElementById('rent-comparison-table');

    // Monerio
    const monerioRateSavings = document.getElementById('monerio-rate-savings');

    const allDelayYearsSpans = document.querySelectorAll('.kpi-delay-years');

    // Rent Edit Elements
    const valRentDisplay = document.getElementById('val-rent-display');
    const btnEditRent = document.getElementById('btn-edit-rent');
    const wrapperEditRent = document.getElementById('wrapper-edit-rent');
    const inputCustomRent = document.getElementById('input-custom-rent');
    const btnResetRent = document.getElementById('btn-reset-rent');

    let userCustomRent = null;
    // MAIN UPDATE
    // ───────────────────────────────────────────
    function update() {
        const price = parseInt(sPrice.value, 10);
        const savings = parseInt(sSavings.value, 10);
        const delay = parseInt(sDelay.value, 10);
        const term = parseInt(sTerm.value, 10);
        const rate = parseFloat(sRate.value) / 100;

        const isYoung = tYoung?.checked || false;
        const isInvest = tInvest?.checked || false;

        const region = marketData.regions[currentRegion] || marketData.regions.praha;
        const appreciation = marketData.propertyAppreciationPa;
        const rentGrowth = marketData.rentGrowthPa;
        
        // Dynamický výpočet referenčního nájmu vázaný na poměr k ceně (rent yield pro daný region)
        const regionYield = (region.avgRent * 12) / region.avgPrice;
        const calculatedRent = Math.round((price * regionYield) / 12);
        
        const activeRent = userCustomRent !== null ? userCustomRent : calculatedRent;

        if (valRentDisplay) valRentDisplay.textContent = formatCurrency(activeRent);
        if (inputCustomRent && userCustomRent === null) {
            inputCustomRent.value = calculatedRent;
        }

        // Display values
        if (vPrice) vPrice.textContent = formatCurrency(price);
        if (vSavings) vSavings.textContent = formatCurrency(savings);
        if (vDelay) vDelay.textContent = `${delay} ${czPlural(delay, 'rok', 'roky', 'let')}`;
        if (vTerm) vTerm.textContent = `${term} let`;
        if (vRate) vRate.textContent = (rate * 100).toFixed(2).replace('.', ',') + ' %';

        [sPrice, sSavings, sDelay, sTerm, sRate].filter(Boolean).forEach(s => {
            s.setAttribute('aria-valuenow', s.value);
        });

        allDelayYearsSpans.forEach(span => { span.textContent = delay; });

        // LTV validation
        let maxLtv = marketData.ltvMaxStandard;
        if (isYoung && !isInvest) maxLtv = marketData.ltvMaxYoung;
        if (isInvest) {
            maxLtv = marketData.ltvMaxInvest;
            if (tYoung) tYoung.checked = false;
        }

        const requiredSavings = price * (1 - maxLtv);
        if (warningLtv) {
            if (savings < requiredSavings) {
                warningLtv.classList.add('show');
                const pct = Math.round((1 - maxLtv) * 100);
                warningLtv.textContent = `Banka bude chtít alespoň ${pct} % z ceny v hotovosti (${formatCurrency(Math.round(requiredSavings))}). Vaše úspory nestačí.`;
            } else {
                warningLtv.classList.remove('show');
            }
        }

        const hintLtv = document.getElementById('hint-ltv');
        if (hintLtv) {
            const pct = Math.round((1 - maxLtv) * 100);
            hintLtv.textContent = `Banka chce zpravidla alespoň ${pct} % z ceny (= ${formatCurrency(Math.round(requiredSavings))})`;
        }

        // ═══ CORE CALCULATIONS ═══
        const futurePrice = price * Math.pow(1 + appreciation, delay);
        const lossValue = futurePrice - price;

        const principalNow = Math.max(0, price - savings);
        const principalLater = Math.max(0, futurePrice - savings);
        const paymentNow = principalNow > 0 ? monthlyPayment(principalNow, rate, term) : 0;
        const paymentLater = principalLater > 0 ? monthlyPayment(principalLater, rate, term) : 0;
        const paymentDiff = paymentLater - paymentNow;

        // ═══ SIDEBAR: INACTION BOX ═══
        animateValue(kpiLossValue, Math.round(lossValue), '- ');
        if (kpiPaymentDiff) kpiPaymentDiff.textContent = '+ ' + formatCurrency(Math.round(paymentDiff)) + '/měs.';

        // ═══ MAIN: KPIs ═══
        animateValue(kpiLoanAmount, Math.round(principalNow));
        animateValue(kpiPaymentNow, Math.round(paymentNow));
        if (kpiTermDisplay) kpiTermDisplay.textContent = term;
        if (kpiRateDisplay) kpiRateDisplay.textContent = (rate * 100).toFixed(2).replace('.', ',');

        const taxDeductionYearly = principalNow > 0 ? computeTaxDeductionYearly(principalNow, rate, term) : 0;
        animateValue(benefitTax, taxDeductionYearly);

        // ═══ RENT COMPARISON ═══
        updateRentComparison(rentComparisonEl, {
            delay, avgRent: activeRent, rentGrowth, paymentNow,
            principalNow, rate, term, price, appreciation,
        });

        // ═══ MONERIO SAVINGS ═══
        const monerioRate = rate + marketData.monerioMortgageDiscount;
        const monerioPayment = principalNow > 0 ? monthlyPayment(principalNow, monerioRate, term) : 0;
        const ctaSaving = Math.round((paymentNow - monerioPayment) * term * 12);
        if (monerioRateSavings) monerioRateSavings.textContent = formatCurrency(ctaSaving);

        // ═══ CHART ═══
        updateChartInaction(price, savings, delay, rate, term, appreciation);
    }

    // ── CHART: Inaction ──
    function updateChartInaction(price, savings, delay, rate, term, appreciation) {
        const ctx = document.getElementById('chart-inaction');
        if (!ctx) return;

        const maxYears = Math.max(delay, 1);
        const labels = [];
        const priceData = [];
        const paymentData = [];
        const savingsLine = [];

        for (let y = 0; y <= maxYears; y++) {
            labels.push(y === 0 ? 'Dnes' : `Za ${y} ${czPlural(y, 'rok', 'roky', 'let')}`);
            const fp = price * Math.pow(1 + appreciation, y);
            priceData.push(Math.round(fp));
            const principal = Math.max(0, fp - savings);
            paymentData.push(principal > 0 ? Math.round(monthlyPayment(principal, rate, term)) : 0);
            savingsLine.push(savings);
        }

        const datasets = [
            {
                label: 'Cena nemovitosti',
                data: priceData,
                borderColor: chartColors.red.solid,
                backgroundColor: (c) => {
                    if (!c.chart) return chartColors.red.fill;
                    const g = c.chart.ctx.createLinearGradient(0, 0, 0, c.chart.height);
                    g.addColorStop(0, 'rgba(255, 76, 76, 0.25)');
                    g.addColorStop(1, 'rgba(255, 76, 76, 0.02)');
                    return g;
                },
                borderWidth: 3, fill: true, tension: 0.3,
                pointRadius: 5, pointBackgroundColor: chartColors.red.solid, yAxisID: 'y',
            },
            {
                label: 'Měsíční splátka',
                data: paymentData,
                borderColor: chartColors.gold.solid,
                backgroundColor: 'transparent',
                borderWidth: 2, borderDash: [6, 3], fill: false, tension: 0.3,
                pointRadius: 4, pointBackgroundColor: chartColors.gold.solid, yAxisID: 'y1',
            },
            {
                label: 'Vaše úspory',
                data: savingsLine,
                borderColor: chartColors.gray.solid,
                backgroundColor: 'transparent',
                borderWidth: 1, borderDash: [4, 4], fill: false, tension: 0,
                pointRadius: 0, yAxisID: 'y',
            },
        ];

        if (chartInaction) {
            chartInaction.data = { labels, datasets };
            chartInaction.options.scales.y.suggestedMin = savings * 0.8;
            chartInaction.update();
        } else {
            chartInaction = new Chart(ctx, {
                type: 'line',
                data: { labels, datasets },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    interaction: { mode: 'index', intersect: false },
                    scales: {
                        x: { display: true },
                        y: { display: true, position: 'left', suggestedMin: savings * 0.8, ticks: { callback: formatYAxisCurrency } },
                        y1: { display: true, position: 'right', grid: { drawOnChartArea: false }, ticks: { callback: (v) => formatYAxisCurrency(v) + '/m' } },
                    },
                    plugins: {
                        legend: { position: 'bottom' },
                        tooltip: { callbacks: { label: (c) => { const s = c.datasetIndex === 1 ? '/měs.' : ''; return c.dataset.label + ': ' + formatCurrency(c.raw) + s; } } },
                    },
                },
            });
        }
    }

    // ── Event listeners ──
    const allSliders = [sPrice, sSavings, sDelay, sTerm, sRate].filter(Boolean);
    allSliders.forEach(el => {
        el.addEventListener('input', () => {
            updateSliderProgress(el);
            update();
        });
    });
    [tYoung, tInvest].filter(Boolean).forEach(el => el.addEventListener('change', update));

    allSliders.forEach(updateSliderProgress);

    // ── RENT EDIT EVENTS ──
    if (btnEditRent && wrapperEditRent) {
        btnEditRent.addEventListener('click', () => {
            const isHidden = wrapperEditRent.style.display === 'none';
            wrapperEditRent.style.display = isHidden ? 'block' : 'none';
        });
    }

    if (inputCustomRent) {
        inputCustomRent.addEventListener('input', () => {
            const val = parseInt(inputCustomRent.value, 10);
            if (!isNaN(val) && val >= 0) {
                userCustomRent = val;
                update();
            }
        });
    }

    if (btnResetRent) {
        btnResetRent.addEventListener('click', () => {
            userCustomRent = null;
            if (wrapperEditRent) wrapperEditRent.style.display = 'none';
            update();
        });
    }

    initRegionSelector(sPrice, sSavings, update);
    initTooltips();
    initHistoryCharts();

    update();
}

// Init is handled by barba-init.js (dynamic import + initMortgageStory call)
