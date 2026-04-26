import { marketData, formatCurrency } from './market-data.js';

// Sdílený výpočet čisté mzdy — použitelný i z investment-3.js pro inverzi
export function calculateWageCore(gross, children, options = {}) {
    const w = marketData.wage;

    // Typ pracovního poměru — DPP/DPČ mají prahové hodnoty pro odvody
    let socialRate = w.employeeSocial;
    let healthRate = w.employeeHealth;
    let empSocialRate = w.employerSocial;
    let empHealthRate = w.employerHealth;

    if (options.contractType === 'dpp' && gross <= w.dppThreshold) {
        socialRate = 0; healthRate = 0; empSocialRate = 0; empHealthRate = 0;
    }
    if (options.contractType === 'dpc' && gross <= w.dpcThreshold) {
        socialRate = 0; healthRate = 0; empSocialRate = 0; empHealthRate = 0;
    }

    // Odvody zaměstnance
    const empeeSoc = gross * socialRate;
    const empeeHlt = gross * healthRate;

    // Odvody zaměstnavatele (skrytá cena práce)
    const emperSoc = gross * empSocialRate;
    const emperHlt = gross * empHealthRate;

    const superGross = gross + emperSoc + emperHlt;

    // Základ daně — snížení o nezdanitelné části (podrobný režim)
    let taxBase = gross;
    if (options.mortgageInterest) taxBase -= Math.min(options.mortgageInterest, w.mortgageInterestMaxYearly / 12);
    if (options.lifeInsurance) taxBase -= Math.min(options.lifeInsurance, w.lifeInsuranceMaxYearly / 12);
    if (options.pensionDeduction) taxBase -= Math.min(options.pensionDeduction, marketData.dip.taxDeductionMaxYearly / 12);
    if (options.donationsMonthly) taxBase -= options.donationsMonthly;
    taxBase = Math.max(0, taxBase);

    // Progresivní daň: 15 % do limitu, 23 % nad limit
    const taxBase15 = Math.min(taxBase, w.taxLimitMonthly);
    const taxBase23 = Math.max(0, taxBase - w.taxLimitMonthly);
    const baseTax = (Math.round(taxBase15) * w.taxRate15) + (Math.round(taxBase23) * w.taxRate23);

    // Slevy na dani — rozklad po položkách
    const creditBasic = w.basicCredit;
    let creditChildren = 0;
    if (children >= 1) creditChildren += w.childCredits[0];
    if (children >= 2) creditChildren += w.childCredits[1];
    if (children >= 3) creditChildren += (children - 2) * w.childCredits[2];
    const creditSpouse = options.spouseCredit ? w.spouseCredit : 0;
    const creditDisability = (options.disabilityDegree > 0 && options.disabilityDegree <= 3)
        ? w.disabilityCredits[options.disabilityDegree - 1] : 0;
    const creditStudent = options.studentCredit ? w.studentCredit : 0;

    const discount = creditBasic + creditChildren + creditSpouse + creditDisability + creditStudent;

    // Finální daň
    let finalTax = baseTax - discount;
    // Daňový bonus vyžaduje hrubou ≥ ½ minimální mzdy
    if (finalTax < 0 && gross < w.minGrossForBonus) finalTax = 0;

    const netIncome = Math.round(gross - empeeSoc - empeeHlt - finalTax);
    const stateTaken = Math.round(superGross - netIncome);

    return {
        gross,
        net: netIncome,
        superGross: Math.round(superGross),
        taken: stateTaken,
        empeeSoc: Math.round(empeeSoc),
        empeeHlt: Math.round(empeeHlt),
        emperSoc: Math.round(emperSoc),
        emperHlt: Math.round(emperHlt),
        taxBeforeCredits: Math.round(baseTax),
        taxAfterCredits: Math.round(finalTax),
        effectiveRate: superGross > 0 ? (stateTaken / superGross) : 0,
        // Rozklad slev
        creditBasic,
        creditChildren,
        creditSpouse,
        creditDisability,
        creditStudent,
        totalCredits: discount,
    };
}

// Inverze: z čisté mzdy na hrubou (binary search)
export function estimateGrossFromNet(netTarget, children = 0) {
    let lo = netTarget;
    let hi = netTarget * 2.5;
    for (let i = 0; i < 40; i++) {
        const mid = Math.round((lo + hi) / 2);
        const result = calculateWageCore(mid, children);
        if (result.net < netTarget) lo = mid;
        else hi = mid;
    }
    return Math.round((lo + hi) / 2);
}

export function initWageStory() {
    const sliderGross = document.getElementById('slider-gross');
    const valGross = document.getElementById('val-gross');
    const sliderChildren = document.getElementById('slider-children');
    const valChildren = document.getElementById('val-children');

    const kpiSupergross = document.getElementById('kpi-supergross');
    const kpiTaken = document.getElementById('kpi-taken');
    const kpiNet = document.getElementById('kpi-net');
    const kpiEffRate = document.getElementById('kpi-eff-rate');

    const btnSimple = document.getElementById('mode-simple');
    const btnDetail = document.getElementById('mode-detail');
    const detailPanel = document.getElementById('detail-panel');

    const toggleSpouse = document.getElementById('toggle-spouse');
    const toggleStudent = document.getElementById('toggle-student');
    const selectDisability = document.getElementById('select-disability');
    const selectContract = document.getElementById('select-contract');
    const contractNote = document.getElementById('contract-note');
    const sliderMortgage = document.getElementById('slider-mortgage');
    const sliderLifeIns = document.getElementById('slider-lifeins');
    const sliderPension = document.getElementById('slider-pension-ded');
    const sliderDonations = document.getElementById('slider-donations');
    const valMortgage = document.getElementById('val-mortgage');
    const valLifeIns = document.getElementById('val-lifeins');
    const valPension = document.getElementById('val-pension-ded');
    const valDonations = document.getElementById('val-donations');

    const btnMonthly = document.getElementById('period-monthly');
    const btnYearly = document.getElementById('period-yearly');

    let isDetailMode = false;
    let isYearly = false;
    let taxDetailOpen = false;

    // Režim jednoduchý/podrobný
    if (btnSimple && btnDetail && detailPanel) {
        btnSimple.addEventListener('click', () => {
            isDetailMode = false;
            btnSimple.classList.add('calc2-mode-btn--active');
            btnDetail.classList.remove('calc2-mode-btn--active');
            detailPanel.style.display = 'none';
            updateDashboard();
        });
        btnDetail.addEventListener('click', () => {
            isDetailMode = true;
            btnDetail.classList.add('calc2-mode-btn--active');
            btnSimple.classList.remove('calc2-mode-btn--active');
            detailPanel.style.display = 'flex';
            updateDashboard();
        });
    }

    // Přepínač období
    if (btnMonthly && btnYearly) {
        btnMonthly.addEventListener('click', () => {
            isYearly = false;
            btnMonthly.classList.add('calc2-mode-btn--active');
            btnYearly.classList.remove('calc2-mode-btn--active');
            updateDashboard();
        });
        btnYearly.addEventListener('click', () => {
            isYearly = true;
            btnYearly.classList.add('calc2-mode-btn--active');
            btnMonthly.classList.remove('calc2-mode-btn--active');
            updateDashboard();
        });
    }

    function updateSliderProgress(slider) {
        if (!slider) return;
        const min = parseFloat(slider.min) || 0;
        const max = parseFloat(slider.max) || 100;
        const val = parseFloat(slider.value) || 0;
        const pct = ((Math.min(Math.max(val, min), max) - min) / (max - min)) * 100;
        slider.style.setProperty('--progress', pct + '%');
    }

    function gatherOptions() {
        if (!isDetailMode) return {};
        return {
            spouseCredit: toggleSpouse?.checked || false,
            studentCredit: toggleStudent?.checked || false,
            disabilityDegree: selectDisability ? parseInt(selectDisability.value, 10) : 0,
            contractType: selectContract?.value || 'hpp',
            // Slidery jsou v ročních částkách → dělíme 12 pro měsíční výpočet
            mortgageInterest: sliderMortgage ? Math.round(parseInt(sliderMortgage.value, 10) / 12) : 0,
            lifeInsurance: sliderLifeIns ? Math.round(parseInt(sliderLifeIns.value, 10) / 12) : 0,
            pensionDeduction: sliderPension ? Math.round(parseInt(sliderPension.value, 10) / 12) : 0,
            donationsMonthly: sliderDonations ? Math.round(parseInt(sliderDonations.value, 10) / 12) : 0,
        };
    }

    function updateDashboard() {
        if (!sliderGross || !sliderChildren) return;

        const gross = parseInt(sliderGross.value, 10);
        const children = parseInt(sliderChildren.value, 10);
        const options = gatherOptions();
        const r = calculateWageCore(gross, children, options);

        const mult = isYearly ? 12 : 1;

        // Labely sliderů
        if (valGross) valGross.textContent = formatCurrency(gross);
        if (valChildren) valChildren.textContent = children === 0 ? '0 dětí' : children === 1 ? '1 dítě' : (children <= 4 ? children + ' děti' : children + ' dětí');

        // Labely podrobných sliderů (roční částky)
        if (valMortgage) valMortgage.textContent = formatCurrency(parseInt(sliderMortgage?.value || 0, 10)) + '/rok';
        if (valLifeIns) valLifeIns.textContent = formatCurrency(parseInt(sliderLifeIns?.value || 0, 10)) + '/rok';
        if (valPension) valPension.textContent = formatCurrency(parseInt(sliderPension?.value || 0, 10)) + '/rok';
        if (valDonations) valDonations.textContent = formatCurrency(parseInt(sliderDonations?.value || 0, 10)) + '/rok';

        // KPI
        if (kpiSupergross) kpiSupergross.textContent = formatCurrency(r.superGross * mult);
        if (kpiTaken) kpiTaken.textContent = formatCurrency(r.taken * mult);
        if (kpiNet) kpiNet.textContent = formatCurrency(r.net * mult);
        if (kpiEffRate) kpiEffRate.textContent = (r.effectiveRate * 100).toFixed(1) + ' %';

        updateBreakdownBar(r, mult);
        updateDetailTable(r, mult);
        updateContractNote(gross, options.contractType);
    }

    function updateBreakdownBar(r, mult) {
        const bar = document.getElementById('wage-breakdown-bar');
        if (!bar) return;

        const total = r.superGross * mult;
        if (total <= 0) return;

        const segments = [
            { label: 'Soc. firma', value: r.emperSoc * mult, color: '#ef4444' },
            { label: 'Zdrav. firma', value: r.emperHlt * mult, color: '#f97316' },
            { label: 'Soc. vy', value: r.empeeSoc * mult, color: '#eab308' },
            { label: 'Zdrav. vy', value: r.empeeHlt * mult, color: '#a855f7' },
            { label: 'Daň', value: Math.max(0, r.taxAfterCredits * mult), color: '#6366f1' },
            { label: 'Čistá mzda', value: r.net * mult, color: '#4CAF50' },
        ];

        bar.innerHTML = '';
        segments.forEach(seg => {
            if (seg.value <= 0) return;
            const pct = (seg.value / total) * 100;
            const el = document.createElement('div');
            el.className = 'wage-bar-segment';
            el.style.width = pct + '%';
            el.style.background = seg.color;
            
            // Vnitřní label segmentu
            let innerHtml = '';
            if (pct > 8) {
                innerHtml = `<span class="wage-bar-label">${seg.label}</span><span class="wage-bar-value">${formatCurrency(seg.value)}</span>`;
            }
            
            // Tooltip při najetí
            innerHtml += `
            <div class="calc2-tooltip-content wage-seg-tooltip">
                <div class="calc2-tooltip-title" style="color: ${seg.color}">${seg.label}</div>
                Částka: <strong>${formatCurrency(seg.value)}</strong><br/>
                <span style="font-size: 0.8rem; opacity: 0.7;">Tvoří ${pct.toFixed(1)} % z celkových nákladů firmy</span>
            </div>`;
            
            el.innerHTML = innerHtml;
            bar.appendChild(el);
        });
    }

    function updateDetailTable(r, mult) {
        const table = document.getElementById('wage-detail-table');
        if (!table) return;

        const f = (v) => formatCurrency(v * mult);
        const taxAfter = Math.max(0, r.taxAfterCredits);

        // Rozklad slev na dani
        let creditRows = '';
        creditRows += `<div class="bdt-row bdt-row--sub"><span>Základní sleva</span><span>−${f(r.creditBasic)}</span></div>`;
        if (r.creditChildren > 0) creditRows += `<div class="bdt-row bdt-row--sub"><span>Sleva na děti</span><span>−${f(r.creditChildren)}</span></div>`;
        if (r.creditSpouse > 0) creditRows += `<div class="bdt-row bdt-row--sub"><span>Sleva na manželku</span><span>−${f(r.creditSpouse)}</span></div>`;
        if (r.creditStudent > 0) creditRows += `<div class="bdt-row bdt-row--sub"><span>Sleva studenta</span><span>−${f(r.creditStudent)}</span></div>`;
        if (r.creditDisability > 0) creditRows += `<div class="bdt-row bdt-row--sub"><span>Sleva na invaliditu</span><span>−${f(r.creditDisability)}</span></div>`;

        const taxDetailClass = taxDetailOpen ? '' : ' bdt-collapsed';

        table.innerHTML = `
            <div class="bdt-section">
                <div class="bdt-row"><span>Hrubá mzda ze smlouvy</span><span>${f(r.gross)}</span></div>
                <div class="bdt-row" style="color: #ef4444;"><span>+ Sociální pojištění (firma 24,8 %)</span><span>${f(r.emperSoc)}</span></div>
                <div class="bdt-row" style="color: #f97316;"><span>+ Zdravotní pojištění (firma 9 %)</span><span>${f(r.emperHlt)}</span></div>
                <div class="bdt-row bdt-row--total" style="color: var(--accent-gold);"><span>= Celkové náklady firmy</span><span>${f(r.superGross)}</span></div>
            </div>

            <div class="bdt-section">
                <div class="bdt-row" style="color: #eab308;"><span>− Sociální pojištění (vy 7,1 %)</span><span>${f(r.empeeSoc)}</span></div>
                <div class="bdt-row" style="color: #a855f7;"><span>− Zdravotní pojištění (vy 4,5 %)</span><span>${f(r.empeeHlt)}</span></div>

                <div class="bdt-row bdt-row--expandable" id="tax-expand-btn" style="color: #6366f1;">
                    <span>− Daň z příjmu (po slevách) <span class="bdt-chevron${taxDetailOpen ? ' bdt-chevron--open' : ''}">&#9660;</span></span>
                    <span>${f(taxAfter)}</span>
                </div>

                <div class="bdt-expandable${taxDetailClass}">
                    <div class="bdt-row bdt-row--sub"><span>Záloha na daň (15 %${r.taxBeforeCredits > r.gross * 0.15 + 1 ? ' + 23 %' : ''})</span><span>${f(r.taxBeforeCredits)}</span></div>
                    ${creditRows}
                    <div class="bdt-row bdt-row--sub bdt-row--total"><span>Celkem slevy</span><span>−${f(r.totalCredits)}</span></div>
                </div>

                <div class="bdt-row bdt-row--total bdt-row--result"><span>= Čistá mzda na účet</span><span>${f(r.net)}</span></div>
            </div>
        `;

        // Expand/collapse daňový detail
        const expandBtn = document.getElementById('tax-expand-btn');
        if (expandBtn) {
            expandBtn.addEventListener('click', () => {
                taxDetailOpen = !taxDetailOpen;
                updateDetailTable(r, mult);
            });
        }
    }

    function updateContractNote(gross, contractType) {
        if (!contractNote) return;
        const w = marketData.wage;

        if (!contractType || contractType === 'hpp' || !isDetailMode) {
            contractNote.style.display = 'none';
            return;
        }

        contractNote.style.display = 'block';

        if (contractType === 'dpp') {
            if (gross <= w.dppThreshold) {
                contractNote.textContent = `Pod ${formatCurrency(w.dppThreshold)}/měs. neplatíte odvody — vše je čistý příjem.`;
                contractNote.style.color = '#4CAF50';
            } else {
                contractNote.textContent = `Nad ${formatCurrency(w.dppThreshold)}/měs. se DPP zdaňuje stejně jako HPP.`;
                contractNote.style.color = 'var(--accent-gold)';
            }
        } else if (contractType === 'dpc') {
            if (gross <= w.dpcThreshold) {
                contractNote.textContent = `Pod ${formatCurrency(w.dpcThreshold)}/měs. neplatíte odvody.`;
                contractNote.style.color = '#4CAF50';
            } else {
                contractNote.textContent = `Nad ${formatCurrency(w.dpcThreshold)}/měs. se DPČ zdaňuje stejně jako HPP.`;
                contractNote.style.color = 'var(--accent-gold)';
            }
        }
    }

    // Event listenery — základní
    [sliderGross, sliderChildren].filter(Boolean).forEach(el => {
        updateSliderProgress(el);
        ['input', 'change'].forEach(evt => el.addEventListener(evt, () => {
            updateSliderProgress(el);
            updateDashboard();
        }));
    });

    // Event listenery — podrobné
    [sliderMortgage, sliderLifeIns, sliderPension, sliderDonations].filter(Boolean).forEach(el => {
        updateSliderProgress(el);
        ['input', 'change'].forEach(evt => el.addEventListener(evt, () => {
            updateSliderProgress(el);
            updateDashboard();
        }));
    });

    [toggleSpouse, toggleStudent].filter(Boolean).forEach(el => {
        el.addEventListener('change', updateDashboard);
    });

    [selectDisability, selectContract].filter(Boolean).forEach(el => {
        el.addEventListener('change', updateDashboard);
    });

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
