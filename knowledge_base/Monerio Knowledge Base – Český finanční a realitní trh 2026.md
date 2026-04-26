# Monerio Knowledge Base – Český finanční a realitní trh 2026

> **Účel dokumentu:** Podkladová knowledge base pro interaktivní finanční kalkulačky a dashboardy webu Monerio. Data jsou strukturována jako fixní konstanty, výchozí hodnoty a hraniční meze připravené pro implementaci do engine.js. Stav ke dni **dubna 2026**.

***

## 1. Hypoteční a úvěrový trh

### 1.1 Aktuální úrovně hypotečních sazeb

Průměrná úroková sazba nových hypoték v ČR se po výrazném poklesu stabilizovala a tvoří nový rovnovážný stav trhu. Průměrná hodnota za celý rok 2025 dosáhla **4,58%** (ČBA Hypomonitor), zatímco v roce 2024 to bylo 5,07%. Swiss Life Hypoindex ukázal ke konci ledna 2026 hodnotu **4,94%**.[^1][^2][^3]

**Tabulka 1 – Průměrné nabídkové sazby hypoték, leden 2026 (Swiss Life Hypoindex)**

| Fixace | do 80% LTV | nad 80% LTV |
|--------|------------|-------------|
| 1 rok | 4,95% | 5,29% |
| 3 roky | 4,61% | 4,97% |
| 5 let | 4,83% | 5,18% |
| 10 let | 5,37% | 5,69% |

*Zdroj: Swiss Life Hypoindex, leden 2026*[^2]

Únor 2026 potvrdil stabilizaci – průměr zůstal na **4,93%**, přičemž u tříletých fixací klesly sazby na **4,54%** a desetileté fixace naopak zdražily na průměr **5,52%**. Nejnižší dostupná sazba na trhu v únoru 2026 klesla pod psychologickou hranici 4% – Moneta Money Bank nabídla **3,99%** u ročních a tříletých fixací. Historické minimum bylo 1,95% v lednu 2021 a maximum 5,98% v prosinci 2022.[^4][^5][^1]

**Konstanty pro kalkulačku (engine.js):**
- `DEFAULT_RATE`: 4,58% (průměr 2025)
- `CURRENT_RATE`: 4,93% (Swiss Life Hypoindex únor 2026)
- `RATE_MIN_HISTORICAL`: 1,95% (leden 2021)
- `RATE_MAX_HISTORICAL`: 5,98% (prosinec 2022)
- `RATE_RANGE_2026_LOW`: 4,5% | `RATE_RANGE_2026_HIGH`: 5,0%

### 1.2 Podmínky ČNB pro poskytování hypoték (LTV, DTI, DSTI)

ČNB stanovuje závazné limity ukazatele LTV (loan-to-value), zatímco ukazatele DTI a DSTI jsou od roku 2023 **deaktivovány** – banky bonitu hodnotí individuálně.[^6][^7]

| Ukazatel | Žadatel do 36 let | Žadatel nad 36 let | Závaznost |
|----------|------------------|-------------------|-----------|
| LTV (max.) | 90% | 80% | Závazný limit |
| DTI (poměr dluhu k příjmu) | individuální | individuální | Pouze doporučení |
| DSTI (splátky/příjem) | individuální | individuální | Pouze doporučení |

**Speciální pravidlo pro investiční hypotéky (od 1. dubna 2026)**:[^8][^4]
- „Investiční hypotéka" = 3. a další nemovitost nebo nemovitost určená k pronájmu
- LTV max. **70%**
- DTI max. **7×** ročního příjmu (oproti standardnímu doporučení 8×)

**Konstanty pro kalkulačku:**
- `LTV_MAX_DEFAULT`: 0,80 (80%)
- `LTV_MAX_YOUNG`: 0,90 (pro věk ≤ 36 let)
- `LTV_MAX_INVESTMENT`: 0,70 (od 1.4.2026, investiční)
- `DTI_ADVISORY_STANDARD`: 8
- `DTI_ADVISORY_INVESTMENT`: 7

### 1.3 Poplatky spojené s hypotékou a koupí nemovitosti

Při pořízení nemovitosti na hypotéku jsou relevantní tyto poplatky:[^9][^10]

| Poplatek | Výše | Poznámka |
|----------|------|----------|
| Vklad zástavního práva do katastru | 2 000 Kč (1 600 Kč online) | Správní poplatek |
| Sjednání hypotéky (banka) | 2 000–5 000 Kč | Většina bank nabízí zdarma |
| Odhad nemovitosti – byt | 3 000–6 500 Kč | Bankovní odhadce |
| Odhad nemovitosti – RD/pozemek | 5 000–10 000 Kč | Soudní znalec |
| Vedení hypotéky (měsíčně) | 0–150 Kč | Většina bank 0 Kč |
| Realitní provize | 2–7% z kupní ceny | Při nákupu přes RK |
| Pojištění nemovitosti (ročně) | 1 500–5 500 Kč | Závisí na hodnotě |
| Dohlídka stavby/rekonstrukce | ~1 500 Kč/návštěva | Při postupném čerpání |

**Konstanty pro kalkulačku:**
- `CADASTRE_FEE`: 2000 Kč
- `MORTGAGE_ORIGINATION_FEE_LOW`: 0 Kč | `MORTGAGE_ORIGINATION_FEE_HIGH`: 5000 Kč
- `PROPERTY_APPRAISAL_APARTMENT_LOW`: 3000 Kč | `PROPERTY_APPRAISAL_APARTMENT_HIGH`: 6500 Kč
- `REALTOR_FEE_LOW`: 0,02 | `REALTOR_FEE_HIGH`: 0,07 (jako koeficient z kupní ceny)

### 1.4 Spotřebitelské úvěry

Index spotřebitelských úvěrů Broker Consulting dosáhl v prosinci 2025 hodnoty **6,43%**, nejnižší za posledních 46 měsíců. Rok 2025 začal na 7,63% a postupně klesal.[^11]

- `CONSUMER_LOAN_RATE_DEFAULT`: 6,5% (aproximace Q1 2026)
- `CONSUMER_LOAN_RATE_RANGE_LOW`: 5,5% | `CONSUMER_LOAN_RATE_RANGE_HIGH`: 9,5%

***

## 2. Ceny nemovitostí a „Cost of Inaction" modelování

### 2.1 Průměrné ceny nemovitostí (stav 2025–2026)

| Region / Typ | Cena za m² | Průměrná cena bytu |
|-------------|-----------|-------------------|
| Praha – celkem (2025) | ~138 000 Kč/m² | >8 mil. Kč |
| Praha (únor 2026) | 150 819 Kč/m² | – |
| Praha 1 – centrum | až 189 000 Kč/m² | – |
| Brno (2025) | ~108 000 Kč/m² | ~7,4 mil. Kč |
| Brno (únor 2026) | 120 574 Kč/m² | – |
| ČR průměr (konec 2025) | ~63 000–80 000 Kč/m² | ~5,3 mil. Kč |
| Krajská města mimo Prahu | ~80 000–96 000 Kč/m² | – |

*Zdroj: RealityMIX, HypoNaMíru, Reality Vencovský*[^12][^13][^14]

50% bytů se stále prodává **pod hranicí 4 mil. Kč**, průměr je tažen dražšími segmenty.[^12]

### 2.2 Historické tempo růstu cen nemovitostí (10 let)

Ceny bytů v ČR vzrostly za poslední dekádu (2013–2023) o průměrných **80%** (ČSÚ). Roční tempa růstu:[^15]

| Období | Průměrný roční růst | Poznámka |
|--------|--------------------|-----------------------|
| 2010–2016 | ~3,5% ročně | Pomaleji, stabilizace |
| 2017–2019 | ~10,7% ročně | Zrychlení |
| 2020 | +8,0% | Pandemická poptávka |
| 2021 | +22,2% (byty) | Historický rekord |
| 2022 | +16,0% (byty) | Vrchol |
| 2023 | -5,8% (byty) | Korekce (vysoké sazby) |
| 2024 | +10,7% (průměr) | Silné oživení |
| 2025 | +10,8% (průměr) | Rekordní aktivita |
| Prognóza 2026 | +5–8% | Mírné zpomalení |

*Zdroje: ČSÚ, HypoNaMíru, prodejchytre.cz*[^16][^17][^18]

Průměrné cena bytu v ČR: 2013 ~30 000 Kč/m², 2023 ~54 000 Kč/m², 2025 ~63 000–80 000 Kč/m² (regionálně).[^15]

**Konstanty pro kalkulačku:**
- `PROPERTY_GROWTH_RATE_CONSERVATIVE`: 0,05 (5% ročně – dolní pásmo)
- `PROPERTY_GROWTH_RATE_BASE`: 0,07 (7% ročně – střed pásma)
- `PROPERTY_GROWTH_RATE_OPTIMISTIC`: 0,10 (10% ročně – historický trend 2017–2025)
- `PROPERTY_GROWTH_RATE_LAST_10Y_AVG`: 0,075 (odhadovaný průměr 2015–2025)

### 2.3 „Cost of Inaction" – kvantifikace ztráty z odkladu nákupu

Základní logika: každý rok odkladu koupě nemovitosti znamená, že cílová nemovitost zdraží o průměrné tempo růstu trhu, zatímco kupující platí nájemné a přichází o kapitálový zisk.

**Modelový příklad – byt v Praze v hodnotě 8 000 000 Kč (2025):**

| Odklad | Odhadovaná cena (7% ročně) | Nárůst ceny | Ekvivalent nájmu (22 100 Kč/měs.) |
|--------|---------------------------|-------------|----------------------------------|
| 1 rok | 8 560 000 Kč | +560 000 Kč | 265 200 Kč |
| 2 roky | 9 155 120 Kč | +1 155 120 Kč | 530 400 Kč |
| 3 roky | 9 795 978 Kč | +1 795 978 Kč | 795 600 Kč |
| 5 let | 11 224 974 Kč | +3 224 974 Kč | 1 326 000 Kč |

*Kalkulace: vlastní výpočet na základě průměrného tempa růstu 7% ročně a průměrného nájmu v Praze.*[^19][^12]

Pro celou ČR při průměrné ceně 5 300 000 Kč a 7% ročním růstu:

| Odklad | Nárůst ceny nemovitosti | Souhrn zaplacené nájem (16 200 Kč/měs.) | Celková oportunní ztráta |
|--------|------------------------|----------------------------------------|------------------------|
| 1 rok | +371 000 Kč | 194 400 Kč | ~565 400 Kč |
| 3 roky | +1 190 000 Kč | 583 200 Kč | ~1 773 200 Kč |
| 5 let | +2 128 000 Kč | 972 000 Kč | ~3 100 000 Kč |

**Konstanty pro Cost of Inaction kalkulačku:**
- `COI_GROWTH_RATE_DEFAULT`: 0,07 (7%)
- `AVG_RENT_PRAGUE`: 22100 Kč/měsíc
- `AVG_RENT_BRNO`: 17200 Kč/měsíc
- `AVG_RENT_CR`: 16200 Kč/měsíc
- `REINVESTMENT_RATE_SAVINGS`: 0,035 (3,5% – spořicí účet alternativa)

### 2.4 Poměr nájmu k ceně nemovitosti (Gross Rental Yield)

Ukazatel udává, kolik procent kupní ceny se ročně vrátí formou nájemného.[^20]

| Lokalita | Gross Yield (hrubý) | Poznámka |
|----------|---------------------|----------|
| Praha | 3,0–4,0% | Nízký výnos, vysoká cena |
| Brno | 3,8–4,8% | Střední segment |
| Ostrava | 4,5–5,5% | Lepší yield, nižší ceny |
| ČR průměr | ~4,0–5,0% | Regionálně proměnlivý |

Čistý výnos (Net Yield) po odečtení daní, správy a oprav: typicky o **1,5–2 procentní body nižší** než hrubý.[^20]

**Konstanty:**
- `GROSS_YIELD_PRAGUE_LOW`: 0,03 | `GROSS_YIELD_PRAGUE_HIGH`: 0,04
- `GROSS_YIELD_BRNO_LOW`: 0,038 | `GROSS_YIELD_BRNO_HIGH`: 0,048
- `GROSS_YIELD_CR_DEFAULT`: 0,045
- `NET_YIELD_DISCOUNT`: 0,015 (srážka na náklady)

***

## 3. Investice, spoření a inflace

### 3.1 Historická a aktuální míra inflace ČR

Kompletní tabulka průměrné roční inflace (ČSÚ, zdroj):[^21]

| Rok | Průměrná roční inflace |
|-----|----------------------|
| 2015 | 0,3% |
| 2016 | 0,7% |
| 2017 | 2,5% |
| 2018 | 2,1% |
| 2019 | 2,8% |
| 2020 | 3,2% |
| 2021 | 3,8% |
| 2022 | 15,1% |
| 2023 | ~10,7% (prosinec) |
| 2024 | 2,4% |
| 2025 | 2,5% |
| 2026 únor (meziroč.) | 1,4% |

Prognóza ČNB pro 2026: průměrná roční inflace **1,6%** (základní prognóza), Ministerstvo financí odhaduje **2,1%**. Inflační cíl ČNB je 2%.[^22][^23][^24]

Dlouhodobý průměr inflace ČR za 25 let (1998–2022): **3,08% ročně** (geometrický průměr).[^25]

**Konstanty pro kalkulačku:**
- `INFLATION_CURRENT`: 0,014 (1,4% – únor 2026 meziroční)
- `INFLATION_FORECAST_2026`: 0,016 (prognóza ČNB)
- `INFLATION_TARGET_CNB`: 0,02 (2%)
- `INFLATION_AVG_25Y`: 0,031 (3,1%)
- `INFLATION_AVG_10Y`: 0,047 (průměr 2015–2025, vč. covidového šoku)

### 3.2 Reálná míra zhodnocení – spořicí účty

Spořicí účty v březnu 2026 nabízejí sazby v rozmezí 2,6–4,0%:[^26][^27][^28]

| Typ | Sazba (jaro 2026) | Podmínky |
|-----|------------------|----------|
| Nejlepší podmíněné účty | 4,0–4,06% | Investice, doporučení, platby kartou |
| Bezpodmínečné top sazby | 3,0–3,5% | Základní nabídka |
| Průměrné spořicí účty | 2,5–3,0% | Běžné podmínky |
| Vklady s výpovědní lhůtou | ~1,69% | ČNB statistika únor 2026 |

ČNB základní repo sazba: **4,0%** (snížena z 4,25% v listopadu 2025).[^29]

**Reálná míra zhodnocení** = nominální sazba − inflace:
- Spořicí účet 3,5% − 1,6% inflace 2026 = +1,9% reálně (kladné!)
- Historicky 2022–2023: spořicí účty -10% reálně při 15% inflaci

**Konstanty:**
- `SAVINGS_RATE_TOP`: 0,04 (4,0% – nejlepší podmíněná sazba)
- `SAVINGS_RATE_DEFAULT`: 0,035 (3,5% – realistická bezpodmínečná sazba)
- `SAVINGS_RATE_STANDARD`: 0,025 (2,5% – průměr)
- `CNB_BASE_RATE`: 0,04 (4,0%)

### 3.3 Státní dluhopisy ČR

| Produkt | Výnos (p.a.) | Poznámka |
|---------|-------------|----------|
| Proti-inflační dluhopis 2022–2028 (ISIN CZ0001006332) | 2,495% | Výnosové období 2025[^30] |
| Proti-inflační dluhopis 2020–2026 (ISIN CZ0001005821) | 2,995% | Výnosové období 2025[^31] |
| 10letý státní dluhopis (tržní výnos) | ~4,13% | Konec 2024, tržní data[^32] |

**Konstanty:**
- `GOVT_BOND_10Y_YIELD`: 0,0413 (4,13%)
- `ANTI_INFLATION_BOND_YIELD_2025`: 0,025 (2,5%)
- `ANTI_INFLATION_BOND_YIELD_APPROX`: CPI + 0% (výnos = inflace)

### 3.4 Akciový trh – PX Index Praha

Index PX pražské burzy k 1. dubna 2026: **2 553 bodů**. PX od propadu v únoru 2009 (628,5 bodů) roste průměrným ročním tempem **5,2%** (cenový index bez dividend). Na přelomu roku 2025/2026 dosáhl historického maxima nad 2 700 bodů.[^33][^34][^35]

Globálně: S&P 500 v roce 2025 přinesl průměrný výnos 17,4%.[^34]

**Konstanty:**
- `STOCK_RETURN_PX_AVG`: 0,052 (5,2% ročně, cenový index PX od 2009)
- `STOCK_RETURN_GLOBAL_LONG_TERM`: 0,07 (7% ročně – standardní předpoklad pro globální akcie)
- `STOCK_RETURN_SP500_2025`: 0,174 (17,4% – skutečnost 2025)

***

## 4. Daňové a legislativní parametry

### 4.1 Odpočet úroků z hypotéky od základu daně

Úroky z hypotéky snižují základ daně z příjmů fyzických osob jako nezdanitelná část základu daně.[^36][^37][^38]

| Typ hypotéky | Max. roční odpočet | Max. daňová úspora (15%) |
|-------------|-------------------|--------------------------|
| Sjednaná DO 31.12.2020 | **300 000 Kč** | **45 000 Kč/rok** |
| Sjednaná OD 1.1.2021 | **150 000 Kč** | **22 500 Kč/rok** |

**Podmínky nároku:**
- Nemovitost musí sloužit k vlastnímu bydlení (ne podnikání, ne pronájem)
- Odpočet lze uplatnit pouze tehdy, pokud celková daňová povinnost přesáhne slevu na poplatníka (30 840 Kč za rok 2025)[^38]
- Při splácení jen část roku: max. 1/12 ročního limitu za každý měsíc placení
- Od 1.1.2025 možnost odpočtu i pro byty pořízené v bytovém družstvu[^2]

**Konstanty:**
- `MORTGAGE_INTEREST_DEDUCTION_NEW`: 150000 Kč (hypotéky od 2021)
- `MORTGAGE_INTEREST_DEDUCTION_OLD`: 300000 Kč (hypotéky do 2020)
- `TAX_SAVING_NEW_MAX`: 22500 Kč
- `TAX_SAVING_OLD_MAX`: 45000 Kč
- `INCOME_TAX_RATE_STANDARD`: 0,15 (15%)
- `TAXPAYER_DISCOUNT_2025`: 30840 Kč

### 4.2 Daň z nemovitých věcí (2025)

Rok 2024 přinesl plošné zvýšení základní sazby daně o **~80%** oproti roku 2023; toto zvýšení zůstalo v platnosti i pro rok 2025.[^39][^40]

**Klíčové parametry 2025:**
- Inflační koeficient pro 2025: **1,0** (neuplatní se; od roku 2026 se bude automaticky upravovat)[^40]
- Místní koeficient: obce mohou nastavit **0,5 až 5,0** (nové rozmezí), pro zemědělské pozemky max. 1,5[^41][^42]
- Zrušen koeficient 1,5 pro garáže, rekreační stavby a podnikatelské nemovitosti[^42]
- Minimální celková daň za spoluvlastnický podíl: **90 Kč**[^39]
- Splatnost daně do 5 000 Kč: 31. května | nad 5 000 Kč: dvě splátky (31. 5. a 30. 11.)[^40]

**Konstanty:**
- `PROPERTY_TAX_INFLATION_COEFF_2025`: 1.0
- `LOCAL_COEFF_MIN`: 0.5 | `LOCAL_COEFF_MAX`: 5.0
- `LOCAL_COEFF_AGRICULTURAL_MAX`: 1.5
- `PROPERTY_TAX_INCREASE_2024_VS_2023`: 0.80 (80% nárůst základní sazby)

### 4.3 Daň z příjmů z pronájmu

Příjmy z pronájmu jsou zdaňovány jako ostatní příjmy fyzických osob.[^43][^44]

| Základ daně (2025) | Sazba |
|-------------------|-------|
| Do 1 676 052 Kč | 15% |
| Nad 1 676 052 Kč | 23% |

**Výdaje (volba poplatníka):**
- **Skutečné výdaje**: opravy, odpisy, pojistné, úroky z hypotéky na pronajímanou nemovitost, správcovské poplatky
- **Paušální výdaje**: 30% z příjmů z pronájmu (max. 600 000 Kč ročně)

Příjmy z pronájmu **nepodléhají odvodu sociálního a zdravotního pojištění** (pokud jde o „pasivní" pronájem, ne podnikání).[^44]

**Konstanty:**
- `RENTAL_INCOME_TAX_RATE_LOW`: 0,15 (15%)
- `RENTAL_INCOME_TAX_RATE_HIGH`: 0,23 (23%)
- `RENTAL_INCOME_TAX_THRESHOLD_2025`: 1676052 Kč
- `RENTAL_EXPENSE_FLAT_RATE`: 0,30 (30% paušál)
- `RENTAL_EXPENSE_FLAT_RATE_MAX`: 600000 Kč

### 4.4 Daň z příjmů fyzických osob – přehled

| Základ daně (2025) | Sazba | Typická aplikace |
|-------------------|-------|-----------------|
| Do 1 676 052 Kč | 15% | Standardní základ |
| Nad 1 676 052 Kč | 23% | Solidární přirážka (de facto) |

Sleva na poplatníka 2025: **30 840 Kč** (2 570 Kč/měsíc).[^38]

***

## 5. Přehled klíčových konstant pro engine.js

Tato sekce shrnuje všechny konstanty v jednom bloku připraveném pro přímé použití:

```javascript
// engine.js – Monerio Knowledge Base (Stav: duben 2026)
// ============================================================

// --- HYPOTEČNÍ SAZBY ---
const MORTGAGE = {
  rateDefault: 0.0458,           // Průměr 2025 (ČBA)
  rateCurrent: 0.0493,           // Únor 2026 (Swiss Life Hypoindex)
  rateMin: 0.0199,               // Historické minimum (leden 2021)
  rateMax: 0.0598,               // Historické maximum (prosinec 2022)
  rateRange2026Low: 0.045,       // Spodní pásmo sazeb 2026
  rateRange2026High: 0.050,      // Horní pásmo sazeb 2026
  // Fixace – průměr leden 2026 (do 80% LTV)
  rate1Y: 0.0495,
  rate3Y: 0.0461,
  rate5Y: 0.0483,
  rate10Y: 0.0537,
};

// --- PODMÍNKY ČNB ---
const LTV = {
  maxStandard: 0.80,             // Max. LTV nad 36 let
  maxYoung: 0.90,                // Max. LTV do 36 let
  maxInvestment: 0.70,           // Max. LTV investiční (od 1.4.2026)
};
const DTI = {
  advisoryStandard: 8,           // Doporučení ČNB (deaktivováno jako závazné)
  advisoryInvestment: 7,         // Doporučení pro investiční hypotéky
};

// --- POPLATKY ---
const FEES = {
  cadastre: 2000,                // Vklad do katastru (Kč)
  cadastreOnline: 1600,          // Online vklad do katastru (Kč)
  mortgageOriginationMin: 0,
  mortgageOriginationMax: 5000,  // Poplatek za sjednání hypotéky (Kč)
  appraisalApartmentMin: 3000,   // Odhad bytu – min.
  appraisalApartmentMax: 6500,   // Odhad bytu – max.
  appraisalHouseMin: 5000,       // Odhad RD – min.
  realtorFeeMin: 0.02,           // Realitní provize – min.
  realtorFeeMax: 0.07,           // Realitní provize – max.
  propertyInsuranceAnnualMin: 1500,
  propertyInsuranceAnnualMax: 5500,
};

// --- SPOTŘEBITELSKÉ ÚVĚRY ---
const CONSUMER_LOAN = {
  rateDefault: 0.065,            // Průměr prosinec 2025
  rateMin: 0.055,
  rateMax: 0.095,
};

// --- CENY NEMOVITOSTÍ ---
const PROPERTY_PRICES = {
  avgPricePerSqmPraha: 150819,   // Kč/m² – únor 2026
  avgPricePerSqmBrno: 120574,    // Kč/m² – únor 2026
  avgPriceBytPraha: 8000000,     // Průměrná cena bytu Praha 2025
  avgPriceBytBrno: 7400000,      // Průměrná cena bytu Brno 2025
  avgPriceBytCR: 5300000,        // Průměrná realizovaná cena bytu ČR konec 2025
  growthRateConservative: 0.05,
  growthRateBase: 0.07,
  growthRateOptimistic: 0.10,
  growthRateAvg10Y: 0.075,
};

// --- NÁJEMNÉ ---
const RENT = {
  avgPraha: 22100,               // Kč/měsíc (Q1 2025)
  avgBrno: 17200,                // Kč/měsíc (Q1 2025)
  avgCR: 16200,                  // Kč/měsíc (Q1 2025)
  avgPricePerSqmCR: 332,         // Kč/m² (Q4 2025, Deloitte)
  avgPricePerSqmPraha: 393,      // Kč/m² (Q1 2025)
  growthForecast2026Low: 0.06,
  growthForecast2026High: 0.09,
  grossYieldPrahaLow: 0.030,
  grossYieldPrahaHigh: 0.040,
  grossYieldBrnoLow: 0.038,
  grossYieldBrnoHigh: 0.048,
  grossYieldCR: 0.045,
};

// --- INFLACE ---
const INFLATION = {
  current: 0.014,                // Únor 2026 meziročně (ČSÚ)
  forecast2026: 0.016,           // Prognóza ČNB 2026
  target: 0.02,                  // Inflační cíl ČNB
  avg2025: 0.025,                // Průměr 2025 (ČSÚ)
  avg2024: 0.024,                // Průměr 2024 (ČSÚ)
  avg10Y: 0.047,                 // Průměr 2015–2025 (vč. energetické krize)
  avg25Y: 0.031,                 // Průměr 1998–2022 (ČSÚ)
  historical: {
    2015: 0.003, 2016: 0.007, 2017: 0.025, 2018: 0.021, 2019: 0.028,
    2020: 0.032, 2021: 0.038, 2022: 0.151, 2023: 0.107, 2024: 0.024, 2025: 0.025,
  },
};

// --- SPOŘENÍ A INVESTICE ---
const SAVINGS = {
  cnbBaseRate: 0.040,            // Základní sazba ČNB (listopad 2025)
  savingsAccountTop: 0.040,      // Nejlepší podmíněná sazba (březen 2026)
  savingsAccountDefault: 0.035,  // Realistická bezpodmínečná sazba
  savingsAccountStandard: 0.025,
  govtBond10Y: 0.0413,           // Výnos 10letého dluhopisu (konec 2024)
  antiInflationBond2025: 0.025,  // Proti-inflační dluhopis
  pxIndexReturnAvg: 0.052,       // PX index průměrný roční výnos od 2009
  globalStockReturnLongTerm: 0.07,
};

// --- DANĚ ---
const TAX = {
  incomeTaxLow: 0.15,
  incomeTaxHigh: 0.23,
  incomeTaxThreshold2025: 1676052,
  taxpayerDiscount2025: 30840,
  mortgageInterestDeductionNew: 150000,   // Hypotéky od 2021
  mortgageInterestDeductionOld: 300000,   // Hypotéky do 2020
  mortgageTaxSavingNewMax: 22500,
  mortgageTaxSavingOldMax: 45000,
  rentalExpenseFlatRate: 0.30,
  rentalExpenseFlatRateMax: 600000,
  propertyTaxInflationCoeff2025: 1.0,
  propertyTaxLocalCoeffMin: 0.5,
  propertyTaxLocalCoeffMax: 5.0,
};
```

***

## 6. Poznámky k dynamickým vs. fixním parametrům

| Parametr | Typ | Frekvence aktualizace |
|----------|-----|-----------------------|
| Hypoteční sazby | Dynamický | Měsíčně (Swiss Life Hypoindex, ČBA) |
| Meziroční inflace | Dynamický | Měsíčně (ČSÚ) |
| Průměrná roční inflace | Aktualizuje se leden | Ročně (ČSÚ) |
| Ceny nemovitostí dle m² | Semi-dynamický | Čtvrtletně (ČSÚ, RealityMIX) |
| Průměrné nájemné | Semi-dynamický | Čtvrtletně (Deloitte Rent Index) |
| LTV limity ČNB | Fixní (regulatorní) | Při změně vyhlášky ČNB |
| Daňové sazby a limity | Fixní (legislativní) | Ročně (zákon o daních z příjmů) |
| Daňové odpočty hypoték | Fixní (legislativní) | Při změně zákona |
| Poplatky za katastr | Fixní (správní) | Při novele správního řádu |
| Spořicí sazby bank | Dynamický | Měsíčně (srovnávací portály) |
| Výnos státních dluhopisů | Dynamický | Dle emisních podmínek |

***

*Zdroje: ČNB (cnb.cz), ČSÚ (csu.gov.cz), Česká bankovní asociace (cbamonitor.cz), Swiss Life Select / Hypoindex (hypoindex.cz), Deloitte Rent Index, Ministerstvo financí ČR (dluhopisy.gov.cz), RealityMIX, HypoNaMíru, Penize.cz, E15.cz, Finance.cz – stav duben 2026.*

---

## References

1. [Průměrná úroková sazba nových hypoték - ČBA Monitor](https://www.cbamonitor.cz/statistika/prumerna-urokova-sazba-novych-hypotek) - Průměrná úroková sazba nových hypoték

2. [Sen o levnějších hypotékách končí. Známe nová čísla z bank](https://www.penize.cz/hypoteky/481681-sen-o-levnejsich-hypotekach-konci-zname-nova-cisla-z-bank) - Průměrná úroková sazba nových hypoték včetně refinancování na začátku nového roku mírně stoupla na 4...

3. [Hypotéky trhají rekordy. Rok 2026 může přinést zklidnění - E15](https://www.e15.cz/finexpert/banky-a-ucty/hypoteky-trhaji-rekordy-rok-2026-muze-prinest-zklidneni-1429481) - Objem hypoték v roce 2025 patří k nejsilnějším v historii. Sazby stagnují, ceny nemovitostí rostou a...

4. [Hypoteční trh zakotvil u pěti procent. Dlouhé fixace ale ...](https://www.penize.cz/uvery-na-bydleni/485221-hypotecni-trh-zakotvil-u-peti-procent-dlouhe-fixace-ale-zdrazuji) - Průměrná sazba hypoték v únoru zůstala na úrovni 4,93 %, potvrdila tak přechod trhu do fáze stabilit...

5. [Přehled aktuálních sazeb hypoték: Po čtvrt roce je na trhu opět ...](https://www.hypoindex.cz/clanky/prehled-aktualnich-sazeb-hypotek-po-ctvrt-roce-je-na-trhu-opet-hypoteka-pod-4/) - Únor 2026 přinesl na hypoteční trh oživení. Po třech měsících se v nabídce bank znovu objevila sazba...

6. [Jak se změnily podmínky pro získání hypotéky](https://www.banky.cz/clanky/podminky-pro-ziskani-hypoteky-se-zmenily-komu-to-pomuze/) - Česká národní banka deaktivovala DSTI jako jedno ze závazných pravidel pro získání hypotéky. Zůstává...

7. [Pravidla a podmínky pro hypotéky 2025](https://www.hyponamiru.cz/nova-pravidla-pro-hypoteky-od-1-4-2022/) - ČNB určuje limity úvěrových ukazatelů, které jsou pro banky závazné. Přečtěte si, jaké podmínky musí...

8. [ČNB chce přísnější limity pro hypotéky na investiční nemovitosti](https://www.penize.cz/hypoteky/482012-cnb-chce-prisnejsi-limity-pro-hypoteky-na-investicni-nemovitosti) - Bankovní rada České národní banky dnes rozhodla, že bankám doporučí přísnější limity LTV a DTI pro t...

9. [Odhad nemovitosti – postup, cena a tipy pro rok 2025](https://jardavcolek.cz/2025/06/10/odhad-nemovitosti-postup-cena-a-tipy-pro-rok-2025/) - Zjisti, jak probíhá odhad nemovitosti, kolik stojí, kdo ho provádí a co ovlivňuje cenu. Praktický př...

10. [Koupě nemovitosti a související náklady a poplatky | Banky.cz](https://www.banky.cz/clanky/koupe-nemovitosti-na-ktere-poplatky-se-pripravit/) - Zjistěte, jaké poplatky vás čekají při koupi nemovitosti. Právní služby, vklad do katastru, odhad ce...

11. [Spotřebitelské úvěry: Jaký byl minulý rok a co přinese ...](https://m.finparada.cz/www.m.finparada.cz/9077-Index-spotrebitelskych-uveru-leden.aspx)

12. [Celkový pohled na ceny bytů v roce 2025 | Reality Josef Vencovský](https://www.realityvencovsky.cz/rezidencni-trh-v-ceske-republice-2025/) - „Český trh s bydlením není přehřátý jako celek. Je výrazně diferencovaný.“

13. [Rezidenční trh v České republice 2025 - toplak.pro reality](https://www.toplak.cz/rezidencni-trh-v-ceske-republice-2025/) - toplak.pro reality - Rezidenční trh v České republice 2025 - Byty

14. [Průměrná cena za 1 m² bytu - Statistika nemovitostí - RealityMIX](https://realitymix.cz/statistika-nemovitosti/byty-prodej-prumerna-cena-za-1m2-bytu.html) - Průměrná cena za 1m2 bytu v katalogu nemovitostí RealityMIX

15. [Vývoj cen nemovitostí v ČR za posledních 10 let: Praha a ...](https://hledasenemovitost.cz/vyvoj-cen-nemovitosti-v-cr-za-poslednich-10-let-praha-a-ostrava-v-cislech/) - Trh s nemovitostmi v České republice prošel za poslední dekádu dramatickými změnami....

16. [Vývoj cen nemovitostí v ČR v letech 2020-2026 - hyponamiru.cz](https://www.hyponamiru.cz/vyvoj-cen-nemovitosti-v-cr/) - Kupujete nemovitost, potřebujete znát cenu, za jakou můžete aktuálně prodat svou nemovitost, nebo si...

17. [Vývoj cen nemovitostí v České republice za posledních 100 let](https://prodejchytre.cz/vyvoj-cen-nemovitosti-cesko-za-100-let/) - Od první republiky přes socialismus až po současnost – realitní trh v Česku prošel obrovskými změnam...

18. [Ceny bytů od konce devadesátých let stouply více než čtyřikrát | e15.cz](https://www.e15.cz/byznys/reality-a-stavebnictvi/ceny-bytu-od-konce-devadesatych-let-stouply-vice-nez-ctyrikrat-1380922) - Byty jsou v Česku stále dražší. Jejich ceny od roku 1998 do konce roku 2019 vzrostly v průměru 4,25k...

19. [Růst nájemného v Praze a Brně v roce 2025: Kde ceny rostou ...](https://www.realityvencovsky.cz/rust-najemneho-v-roce-2025-proc-ceny-stale-rostou-a-kde-nejvice/) - Průměrný měsíční nájem bytu v Praze překročil hranici 22 000 Kč, v Brně se pohybuje nad 17 000 Kč a ...

20. [Průměrný výnos z pronájmu v ČR 2025: Praha vs. zbytek republiky](https://www.investicnikalkulacky.cz/clanky/prumerny-vynos-z-pronajmu-cr-2025) - Výpočet je jednoduchý: (Měsíční nájem × 12) / Kupní cena nemovitosti × 100 . Tento ukazatel nepočítá...

21. [Inflace - druhy, definice, tabulky | Statistika - Český statistický úřad](https://csu.gov.cz/mira_inflace) - Výpis ze zjišťování – míra inflace průměrná roční a meziroční (prosinec/prosinec) – 2025 ... 2011, 2...

22. [Vývoj inflace v ČR 2021 - 2026 - hyponamiru.cz](https://www.hyponamiru.cz/vyvoj-inflace-v-cr/) - Prozkoumejte aktuální i historický vývoj inflace v ČR. Z analýzy od roku 2021 až po předpovědi na ro...

23. [Inflace u 2% cíle - Česká národní banka](https://www.cnb.cz/cs/menova-politika/inflacni-cil/tema-inflace/index.html)

24. [Aktuální prognóza ČNB - Česká národní banka](https://www.cnb.cz/cs/menova-politika/prognoza/)

25. [[PDF] Příloha 5: Tabulka s výpočtem průměrné roční inflace v ČR za 25 let](https://is.vstecb.cz/th/g0h0i/Priloha_5_-_vypocet_prumerne_rocni_inflace_za_25_let.pdf?kod=NKV) - rok. Průměrná roční inflace. 2022. 15,1 %. 2009. 1,0 %. 2021. 3,8 %. 2008. 6,3 %. 2020. 3,2 %. 2007....

26. [Spořicí účty 2026: Srovnání. Aktuální úroky bank v ČR | e15.cz](https://www.e15.cz/sporici-ucty-srovnani) - Který spořicí účet má aktuálně nejvyšší úrok? Jaký je nejlepší? Která banka nabízí nejvyšší sazby př...

27. [Srovnání spořicích účtů v březnu 2026: kdo udržel úrokovou sazbu ...](https://www.finance.cz/clanky/srovnani-sporicich-uctu-v-breznu-2026-kdo-udrzel-urokovou-sazbu-nad-5/) - Úrokové sazby již nejsou tak lákavé jako v minulosti, přesto i v aktuální nabídce lze najít spořicí ...

28. [Nejlepší spořicí účty v novém roce. Jak nepřijít o 4 %](https://www.penize.cz/sporici-ucty/481182-nejlepsi-sporici-ucty-v-novem-roce-jak-neprijit-o-4) - Kam uložit peníze, které dočasně nepotřebujete, ale chcete je mít kdykoliv k dispozici? Máme aktuáln...

29. [Spořicí účty srovnání 2026 – nejvýhodnější spořicí účet - Ušetřeno.cz](https://www.usetreno.cz/sporici-ucty/) - Který spořicí účet vám vydělá nejvíc? Srovnejte si spořicí účty pro rok 2026 a najděte ten nejvýhodn...

30. [Oznámení o výnosu PROTI-INFLAČNÍHO státního dluhopisu České ...](https://www.sporicidluhopisycr.cz/cs/o-dluhopisech/oznameni/oznameni-o-vynosu/oznameni-o-vynosu-proti-inflacniho-statn-1674) - Spořicí státní dluhopisy patří mezi nejbezpečnější způsoby spoření. Dluhopisy ČR mají garanci splace...

31. [Oznámení o výnosu PROTI-INFLAČNÍHO státního ...](https://www.sporicidluhopisycr.cz/cs/o-dluhopisech/oznameni/oznameni-o-vynosu/oznameni-o-vynosu-proti-inflacniho-statn-1672) - Spořicí státní dluhopisy patří mezi nejbezpečnější způsoby spoření. Dluhopisy ČR mají garanci splace...

32. [Výnos státních dluhopisů je nad 4 procenty, stát si půjčuje dráž](https://www.seznamzpravy.cz/clanek/ekonomika-finance-byznys-komodity-dluhopisy-vynos-statnich-dluhopisu-je-nad-4-procenty-stat-si-pujcuje-draz-268297)

33. [Akciové indexy PX na pražské burze](https://www.financevpraxi.cz/finance-indexy-burzy-cennych-papiru-praha) - Cenový a růstový index BCPP, složení báze indexu PX, oborová klasifikace indexu PX, široký index PX-...

34. [Pražská burza dál láme rekordy. Index posílil už pošesté v řadě](https://www.newstream.cz/trhy/prazska-burza-dal-lame-rekordy-index-posilil-uz-poseste-v-rade) - Pražská burza má za sebou další úspěšný týden. V krátkém obchodním období na přelomu roku posílila j...

35. [Index pražské burzy PX - Akcie.cz](https://www.akcie.cz/kurzy-cz/index-px/) - Index pražské burzy PX. Aktuální kurzy i historická data, grafy vývoje.

36. [Úroky z úvěru v daních: jak na odpočet úroků z hypotéky v daňovém ...](https://dostupnyadvokat.cz/blog/uroky-z-uveru-dane) - Vysvětlíme, na jaké úvěry se odpočet vztahuje, jaké podmínky musíte splnit, kolik si můžete odečíst,...

37. [Odpočet úroků hypotéky z daní v roce 2025: Jak ušetřit na ...](https://www.investice.cz/clanek/odpocet-uroku-hypoteky-z-dani-v-roce-2025-jak-usetrit-na-danich-desitky-tisic-korun) - Splácení hypotéky patří mezi největší výdaje českých domácností, ale existuje způsob, jak na něm uše...

38. [Odpočet úroků hypotéky z daní 2026 - hyponamiru.cz](https://www.hyponamiru.cz/odpocet-uroku-hypoteky-z-dani/) - ✅ Přečtěte si, jaké podmínky musíte splnit pro odpočet úroků hypotéky z daní a kde zjistíte výši zap...

39. [O 80 % dražší daň z nemovitých věcí a další změny od 2025!](https://modernipravnik.cz/dane-cs/dan-z-nemovitych-veci-2025/) - Daň z nemovitých věcí se v roce 2025 zdraží! Přečtěte si o lhůtách, novinkách a způsobech, jak daňov...

40. [Daň z nemovitých věcí pro rok 2025: sazby, termíny, ...](https://www.akcniceny.cz/magazin/dan-z-nemovitych-veci-pro-rok-2025-sazby-terminy-kalkulacka-a-prakticke-rady/) - Aktuální informace o dani z nemovitých věcí pro rok 2025: nové sazby, důležité termíny pro podání př...

41. [Změny ve zdanění nemovitých věcí v roce 2025](https://danovky.cz/cs/zmeny-ve-zdaneni-nemovitych-veci-v-roce-2025) - To nejdůležitější o daních, právu a účetnictví v pravidelném informačním servisu KPMG.

42. [Která města zvýšila daň z nemovitostí pro rok 2025 a ...](https://www.podnikatel.cz/clanky/ktera-mesta-zvysila-dan-z-nemovitosti-pro-rok-2025-a-ktera-uz-i-pro-rok-2026/) - Vzhledem ke změně systému koeficientů musela řada měst přijmout novou vyhlášku k dani z nemovitých v...

43. [Daň z pronájmu bytu: Kompletní a aktuální přehled pro rok 2026](https://idealninajemce.cz/radce/dan-z-pronajmu) - Jak se daní příjem z pronájmu v roce 2026? Přehled sazeb, limitů, nákladů i povinnosti podat daňové ...

44. [Kolik je daň z pronájmu bytu a jak ji správně vypočítat - Bezrealitky](https://www.bezrealitky.cz/blog/dan-z-pronajmu) - Přehledně a srozumitelně: kolik činí daň z pronájmu, kdo ji musí platit a jaké výdaje si můžete upla...

