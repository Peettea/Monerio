# Monerio Knowledge Base – Penze, DPS a DIP (III. pilíř) 2026

> **Účel dokumentu:** Podkladová knowledge base pro interaktivní finanční kalkulačky a dashboardy webu Monerio – oblast důchodového spoření, státem podporovaných produktů (DPS, DIP) a struktury I.–III. penzijního pilíře. Stav ke dni **dubna 2026**.

***

## 1. Makro kontext – Proč penzijní kalkulačky vůbec dávají smysl

### 1.1 Náhradový poměr a mezera v příjmu

Státní starobní důchod (I. pilíř) pokrývá jen část předchozího příjmu. Celkový náhradový poměr v ČR dosáhl v roce 2025 přibližně **47%** průměrné hrubé mzdy. Výpočet se vztahuje na průměrnou hrubou mzdu – lidé s nadprůměrnými příjmy mají náhradový poměr výrazně nižší (kolem 30–35% čistého příjmu). Odborníci odhadují, že při plánovaných změnách důchodové reformy náhradový poměr postupně klesne pod 40%.[^1][^2]

**Klíčová fakta pro kalkulačky:**

| Ukazatel | Hodnota | Zdroj |
|----------|---------|-------|
| Průměrný starobní důchod 2025 | **14 200 Kč/měsíc** | ČSSZ[^3] |
| Celkový náhradový poměr (hrubý) | **~47%** | Freedom FS[^1] |
| Čistý náhradový poměr (u průměrné mzdy) | **~60%** | CERGE-EI[^2] |
| Počet důchodců ČR (2025) | **2,8 milionu** (27% populace) | ČSÚ[^3] |
| Počet pracujících na 1 důchodce | **2,2 pracující** (klesá) | APS ČR[^4] |

### 1.2 Důchodová reforma a věk odchodu do důchodu

Od 1. ledna 2025 platí nový zákon o postupném zvyšování důchodového věku na **67 let**. Zákon rovněž zavádí zohlednění odpracovaných směn – odpracování 4 400 směn umožní odchod do důchodu o 30 kalendářních měsíců dříve.[^5]

**Konstanty pro kalkulačky:**
- `REPLACEMENT_RATIO_GROSS`: 0,47 (47%)
- `REPLACEMENT_RATIO_NET_AVG`: 0,60 (60%)
- `AVG_PENSION_2025`: 14200 Kč/měsíc
- `RETIREMENT_AGE_TARGET`: 67 (výhledový věk)
- `PENSION_GAP_PCT_RECOMMENDED`: 0,53 (doporučené doplnění na 100% příjmu = 53% z příjmu mimo státní důchod)

***

## 2. Doplňkové penzijní spoření (DPS) – III. pilíř

DPS (doplňkové penzijní spoření) je hlavní státem podporovaný nástroj III. důchodového pilíře. V červenci 2024 prošlo zásadní reformou parametrů státní podpory.

### 2.1 Státní příspěvek – platné parametry od 1. 7. 2024

Stát přispívá **20% z vlastního měsíčního příspěvku účastníka**, a to v rozmezí 500–1 700 Kč. Pod 500 Kč stát nepřispívá vůbec.[^6][^7]

| Měsíční příspěvek účastníka | Státní příspěvek (od 1. 7. 2024) | Výnos státního příspěvku ročně |
|-----------------------------|----------------------------------|-------------------------------|
| Pod 500 Kč | 0 Kč | 0 Kč |
| 500 Kč | 0 Kč (minimální příspěvek, ale pod 20% pásmem) | 0 Kč |
| 500 Kč (přesně) | 0 Kč (min. 500 Kč, ale příspěvek se počítá od 500 Kč → 0 Kč) | – |
| 600 Kč | 20 Kč (20% z 100 Kč nad 500 Kč) | 240 Kč |
| 1 000 Kč | 100 Kč (20% z 500 Kč nad 500 Kč) | 1 200 Kč |
| 1 700 Kč | **340 Kč (maximum)** | **4 080 Kč** |
| Nad 1 700 Kč | Stále 340 Kč (max. strop) | 4 080 Kč |

*Stát přispívá 20% z částky nad 500 Kč, max. 340 Kč měsíčně (= 4 080 Kč ročně).*[^7][^6]

Důchodci (pobíratelé starobního důchodu) na státní příspěvek **nemají nárok** od 1. 7. 2024.[^6]

### 2.2 Daňový odpočet DPS

Příspěvky na DPS přesahující 1 700 Kč/měsíc si účastník může odečíst od základu daně z příjmů, až do výše **48 000 Kč ročně** v součtu za všechny daňově podporované produkty spoření na stáří (DPS + DIP + vybrané životní pojištění + pojištění dlouhodobé péče).[^8][^9][^10]

Daňový odpočet začíná od příspěvku **1 700 Kč měsíčně** (pod tuto hranici jde státní příspěvek, nad ní jde daňový odpočet). Maximum odpočtu u DPS samotného je tedy **5 700 Kč/měsíc** (resp. 68 400 Kč ročně), ale společný limit celé kategorie je 48 000 Kč ročně.[^11]

| Využití | Maximální roční úspora |
|---------|----------------------|
| Státní příspěvek (max.) | **4 080 Kč** |
| Daňová úspora z odpočtu 48 000 Kč × 15% | **7 200 Kč** |
| **Celková možná státní podpora ročně** | **11 280 Kč** |

### 2.3 Příspěvek zaměstnavatele na DPS

Zaměstnavatel může přispívat na DPS zaměstnance libovolně – příspěvky jsou pro zaměstnavatele **daňově uznatelný náklad** v plné výši a pro zaměstnance jsou osvobozeny od daně z příjmů i od odvodů na sociální a zdravotní pojištění do **50 000 Kč ročně** (souhrnně za DPS + DIP + vybrané životní pojistky).[^12][^11]

Průměrný příspěvek zaměstnavatele na DPS (historická data): přibližně **800–1 200 Kč/měsíc**.[^13]

Od **1. ledna 2026** platí nový zákon č. 324/2025 Sb. o povinném příspěvku zaměstnavatele – platí pro zaměstnance v rizikových profesích kategorie 3 (chlad, horko, vibrace, fyzická zátěž).[^14][^15]

### 2.4 Podmínky výběru z DPS

Výběr bez sankcí (zachování daňových výhod) je možný při splnění obou podmínek:
- Dosažení věku **60 let**
- Délka spoření **minimálně 5 let** (60 měsíců od uzavření smlouvy)[^6]

Předčasný výběr = **vrácení státních příspěvků** za posledních 10 let + zdanění výnosů jako ostatní příjem.[^6]

**Konstanty pro kalkulačky:**
```javascript
const DPS = {
  // Státní příspěvek
  stateContribMinInput: 500,       // Kč/měsíc – minimální vklad pro příspěvek
  stateContribRate: 0.20,          // 20 % z částky nad 500 Kč
  stateContribMax: 340,            // Kč/měsíc – maximum státního příspěvku
  stateContribMaxAnnual: 4080,     // Kč/rok
  stateContribOptimalInput: 1700,  // Kč/měsíc – pro maximální státní příspěvek

  // Daňový odpočet
  taxDeductionSharedLimit: 48000,  // Kč/rok – sdílený limit DPS+DIP+pojistky
  taxDeductionMaxSaving15pct: 7200, // Kč/rok – úspora při 15% sazbě
  taxDeductionMaxSaving23pct: 11040, // Kč/rok – úspora při 23% sazbě
  taxDeductionThreshold: 1700,     // Kč/měsíc – od kdy se odpočítává
  taxDeductionMaxMonthly: 5700,    // Kč/měsíc – max. odpočitatelný příspěvek

  // Příspěvek zaměstnavatele
  employerContribExemptLimit: 50000, // Kč/rok – osvobozeno od daně a odvodů
  employerContribAvgTypical: 1000,   // Kč/měsíc – typický průměr

  // Výběr
  withdrawalMinAge: 60,
  withdrawalMinMonths: 60,         // 5 let spoření

  // Celková podpora ročně
  totalStateSupportMax: 11280,     // 4 080 státní + 7 200 daňová úspora
};
```

***

## 3. Dlouhodobý Investiční Produkt (DIP)

DIP byl zaveden od **1. ledna 2024** jako alternativa k DPS s větší investiční svobodou. Do konce H1 2025 jej využívalo přes **170 000 Čechů**.[^16]

### 3.1 Co je DIP a jak funguje

DIP je „schránka" (daňový režim) umožňující investovat do regulovaných instrumentů na stáří s daňovou podporou. Oproti DPS nabízí podstatně širší škálu investic:[^16]

- Spořicí účty a termínované vklady
- Akcie a dluhopisy obchodované na burze (vč. zahraničních)
- Podílové fondy (ETF, investiční fondy)
- Deriváty pro měnové/úrokové zajištění[^16]

Klíčová výhoda: **Žádná garance nezáporného výnosu** (na rozdíl od transformovaných penzijních fondů), a tím pádem možnost investovat agresivněji a dosáhnout vyšší výnosnosti.[^16]

### 3.2 Daňové podmínky DIP

| Parametr | Hodnota |
|---------|---------|
| Daňový odpočet vlastních příspěvků | Až **48 000 Kč ročně** (sdílený limit s DPS) |
| Maximální roční daňová úspora (15%) | **7 200 Kč** |
| Příspěvek zaměstnavatele osvobozený | Až **50 000 Kč ročně** (sdílený limit s DPS) |

Podmínky pro čerpání daňové podpory (pravidlo „**120/60**"):[^17][^10]
- Vázací doba: **minimálně 10 let** (120 měsíců) od uzavření DIP
- Věk výběru: **nejdříve 60 let**
- Při porušení: **zpětné dodanění** všech uplatněných daňových úlev + sankce

Zaměstnanec a zaměstnavatel společně mohou ušetřit ročně na odvodech a daních při plném využití DIP:
- Zaměstnanec: až 7 200 Kč/rok (odpočet 48 000 Kč × 15%)
- Zaměstnanec: příspěvek zaměstnavatele 50 000 Kč × 15% DPFO = 7 500 Kč (ušetřeno na dani)
- Zaměstnavatel: ušetří odvody SZP z 50 000 Kč = cca 16 750 Kč[^12]

**Konstanty pro kalkulačky:**
```javascript
const DIP = {
  launchDate: '2024-01-01',
  taxDeductionSharedLimit: 48000,  // Kč/rok – sdílený limit s DPS
  taxSavingMax15pct: 7200,         // Kč/rok
  taxSavingMax23pct: 11040,        // Kč/rok
  employerContribExemptLimit: 50000, // Kč/rok – sdílený limit s DPS
  lockupYears: 10,                 // min. 10 let vázací doba
  lockupMonths: 120,
  minWithdrawalAge: 60,
  penaltyOnBreak: true,            // zpětné zdanění při porušení podmínek
};
```

### 3.3 DPS vs. DIP – srovnání pro kalkulačky

| Kritérium | DPS (III. pilíř) | DIP (od 2024) |
|-----------|-----------------|---------------|
| Státní příspěvek | Ano (až 340 Kč/měs.) | **Ne** |
| Daňový odpočet (sdílený limit) | Ano (48 000 Kč/rok) | Ano (48 000 Kč/rok) |
| Příspěvek zaměstnavatele | Ano (limit 50 000 Kč) | Ano (limit 50 000 Kč) |
| Investiční svoboda | Omezená (fondy penzijní spol.) | Velmi vysoká (akcie, ETF, dluhopisy) |
| Garance nezáporného výnosu | Ano (transformované fondy) | **Ne** |
| Vázací doba pro výhody | 5 let + věk 60 | 10 let + věk 60 |
| Průměrný výnos 2025 (dynamický) | ~14,2% (účastnické fondy) | dle volby instrumentů |
| Průměrný výnos 2025 (konzervativní) | ~2,6% | dle volby |
| Vhodné pro | Konzervativní střadatele | Aktivní investory |

***

## 4. Výnosy penzijních fondů

### 4.1 Účastnické fondy DPS (nové penzijko) – výsledky 2025

Prakticky všechny účastnické fondy DPS skončily v roce 2025 v plusu a většina překonala inflaci.[^18]

| Typ fondu | Průměrný výnos 2025 | Nejvýkonnější (2025) |
|-----------|--------------------|--------------------|
| **Dynamické (akciové)** | **~14,2–16,5%** | NN Růstový +25,9% |
| Vyvážené (smíšené) | ~7–10% | Conseq Globální akciový +23,4% |
| Konzervativní (dluhopisové) | **~2,6%** | ČS Dynamický +17% |

*Zdroj: Freedom Financial Services, analýza 36 účastnických fondů, leden 2026*[^19][^18]

Dynamické fondy zaměřené na akcie vyspělých trhů profitovaly z růstu S&P 500 (+17% v 2025), NASDAQ (+20%) a PX indexu (+50%).[^18]

**Výsledky dynamických fondů za více let:**
- 2023: průměr +20,64%[^20]
- 2024: průměr +12,55%[^20]
- 2025: průměr +16,5%[^20]

### 4.2 Transformované fondy (staré penzijní připojištění) – výsledky 2024

Transformované fondy (do nichž nelze nově vstoupit od roku 2013) jsou ze zákona povinny vykazovat **nezáporné zhodnocení**, ale jsou omezeny na konzervativní investice.[^21]

| Penzijní společnost | Zhodnocení 2024 |
|--------------------|----------------|
| Conseq | 5,31% |
| Česká spořitelna | 2,57% |
| KB | 2,22% |
| Allianz | 2,38% |
| Generali | 2,09% |
| ČSOB | 2,04% |
| Uniqa | 1,46% |
| NN | 0,81% |
| **Průměr vážený** | **2,11%** |

*Zdroj: Freedom Financial Services / APS ČR, výsledky za rok 2024*[^22][^21]

**Kritický pohled:** Reálné zhodnocení transformovaných fondů za 12 let (2013–2024) po odečtení inflace dosáhlo v průměru **záporných 25%**. Transformované fondy jsou tedy vhodné pouze pro lidi, kteří nutně potřebují garanci nezáporného nominálního výnosu.[^22]

### 4.3 Investiční výnosy – doporučené konstanty pro engine.js

```javascript
const PENSION_FUND_RETURNS = {
  // Účastnické fondy DPS (nové penzijko)
  dynamicFundAvg2025: 0.142,       // 14,2 % průměr dynamické
  dynamicFundAvg3Y: 0.165,         // průměr 2023–2025
  balancedFundAvg2025: 0.085,      // vyvážené fondy (odhad)
  conservativeFundAvg2025: 0.026,  // 2,6 % konzervativní

  // Transformované fondy (staré penzijko – jen pro srovnání)
  transformedFundAvg2024: 0.0211,  // 2,11 % průměr 2024
  transformedFundReal12Y: -0.25,   // -25 % reálně za 12 let

  // Dlouhodobé orientační výnosy pro kalkulačky
  pensionConservativeLongTerm: 0.030,  // 3 % ročně (konzervativní scénář)
  pensionBalancedLongTerm: 0.060,      // 6 % ročně (vyvážený scénář)
  pensionDynamicLongTerm: 0.080,       // 8 % ročně (dynamický scénář, historický průměr globálních akcií)
  indexFundLongTerm: 0.07,             // 7 % ročně (globální index, S&P 500 průměr)
};
```

***

## 5. Komplexní daňová optimalizace – souhra DPS + DIP

### 5.1 Kombinace produktů – maximální využití výhod

Limit 48 000 Kč ročně pro daňový odpočet a limit 50 000 Kč pro příspěvek zaměstnavatele jsou **sdílené** pro všechny daňově podporované produkty spoření na stáří.[^9][^10]

**Optimální strategie pro zaměstnance (příklad):**

| Produkt | Vlastní vklad/rok | Státní příspěvek/rok | Daňová úspora (15%) |
|---------|------------------|---------------------|---------------------|
| DPS (1 700 Kč/měs.) | 20 400 Kč | **4 080 Kč** | 2 910 Kč (z odpočtu nad 20 400 Kč) |
| DIP (doplnění do 48 000 Kč) | 27 600 Kč | 0 Kč | 4 290 Kč |
| **Celkem** | **48 000 Kč** | **4 080 Kč** | **7 200 Kč** |

Celková „státní dotace" = **11 280 Kč ročně** (4 080 + 7 200).[^8]

Při příspěvku zaměstnavatele 50 000 Kč ročně na DIP nebo DPS ušetří zaměstnanec dalších cca **7 500 Kč ročně** na dani z příjmů + ušetří odvody SZP.

### 5.2 Srovnání efektivity – státní podpora jako výnos

Vložení 1 700 Kč/měsíc (20 400 Kč/rok) do DPS s plným využitím státního příspěvku:
- Státní příspěvek: 4 080 Kč → výnos ze státní podpory = **20,0% z vlastního vkladu**
- Daňová úspora: do 7 200 Kč → záleží na výši vkladu nad 20 400 Kč
- Tato garantovaná „dotace" je bezrizikový výnos a vyplatí se vždy čerpat jako první[^23][^8]

**Konstanty pro kalkulačky:**
```javascript
const PENSION_TAX_OPTIMIZATION = {
  // Sdílený limit
  sharedDeductionLimit: 48000,        // Kč/rok

  // Efektivní „výnos" státního příspěvku při optimálním vkladu 1 700 Kč/měs.
  stateContribYieldOnOptimalInput: 0.20, // 20 % (340 / 1 700)
  stateContribYieldOnMaxAllowed: 0.167,  // 16,7 % (340 / (1 700 + 300 přebytek))

  // Zaměstnavatel
  employerContribSharedLimit: 50000,  // Kč/rok
  employerContribTaxFreeForEmployee: true,
  employerContribSocialHealthSavingRate: 0.335, // 33,5 % ušetřeno na odvodech (pro zaměstnavatele)
};
```

***

## 6. Přehled I. a II. pilíře (kontext pro kalkulačky)

### 6.1 I. pilíř – Státní průběžný systém (PAYG)

| Parametr | Hodnota |
|----------|---------|
| Sazba důchodového pojištění (zaměstnanec) | 6,5% hrubé mzdy |
| Sazba důchodového pojištění (zaměstnavatel) | 21,5% hrubé mzdy |
| Celková sazba | 28% hrubé mzdy |
| Průměrný starobní důchod 2025 | 14 200 Kč/měs.[^3] |
| Východní věk (generace do 1973) | 65 let |
| Východní věk (generace od 1973+) | postupně na 67 let[^5] |

### 6.2 II. pilíř – Dobrovolný fondový pilíř

II. pilíř byl v ČR zrušen v roce 2016. V současnosti neexistuje státem provozovaný fondový pilíř. Ekvivalentem je DPS (III. pilíř) nebo DIP.

```javascript
const PENSION_PILLARS = {
  // I. pilíř
  employeePensionInsuranceRate: 0.065,   // 6,5 %
  employerPensionInsuranceRate: 0.215,   // 21,5 %
  totalPensionInsuranceRate: 0.28,       // 28 %
  avgPension2025: 14200,                 // Kč/měsíc
  retirementAgeDefault: 65,
  retirementAgeTarget2026plus: 67,

  // II. pilíř
  secondPillarExists: false,             // zrušen 2016

  // Náhradový poměr
  replacementRatioGross: 0.47,
  replacementRatioNet: 0.60,
};
```

***

## 7. Modelování důchodového deficitu – doporučené parametry pro engine.js

Pro kalkulačky „Kolik mi chybí do důchodu" nebo „Kolik si musím spořit" je třeba propojit tyto parametry:

```javascript
const RETIREMENT_CALCULATOR_DEFAULTS = {
  // Vstupní předpoklady
  retirementAge: 65,               // výchozí věk odchodu
  lifeExpectancy: 82,              // střední délka života ČR (muži 79, ženy 84)
  retirementDuration: 17,          // průměrná délka pobírání důchodu (roky)

  // Inflace
  inflationLongTerm: 0.025,        // 2,5 % dlouhodobý předpoklad

  // Výnos fondů (scénáře)
  returnConservative: 0.03,
  returnBalanced: 0.06,
  returnDynamic: 0.08,

  // Státní důchod
  replacementRatio: 0.47,          // 47 % hrubé mzdy → státní důchod
  avgPension: 14200,               // Kč/měsíc výchozí

  // Doporučené spoření (% příjmu)
  recommendedSavingRateLow: 0.05,  // 5 % – minimální
  recommendedSavingRateStandard: 0.10, // 10 % – doporučeno odborníky
  recommendedSavingRateHigh: 0.15, // 15 % – pro vyšší příjmy

  // DPS optimální příspěvek
  dpsOptimalMonthly: 1700,         // Kč – pro max. státní příspěvek
  dpsOptimalAnnual: 20400,

  // DIP doplněk do limitu
  dipTopUpToLimit: 27600,          // 48 000 - 20 400 = 27 600 Kč/rok
};
```

***

## 8. Dynamické vs. fixní parametry – přehled

| Parametr | Typ | Frekvence aktualizace |
|----------|-----|-----------------------|
| Státní příspěvek DPS (výše a pravidla) | Legislativní | Při změně zákona |
| Limit daňového odpočtu (48 000 Kč) | Legislativní | Při změně ZDP |
| Příspěvek zaměstnavatele (limit 50 000 Kč) | Legislativní | Při změně ZDP |
| Výnosy účastnických fondů (roční) | Dynamický | Ročně (APS ČR, leden) |
| Výnosy transformovaných fondů | Dynamický | Ročně (APS ČR, jaro) |
| Průměrný důchod | Semi-dynamický | Čtvrtletně (ČSSZ) |
| Náhradový poměr | Semi-dynamický | Ročně (MPSV, MFČR) |
| Důchodový věk (reformní schéma) | Fixní (legislativní) | Při novelizaci |
| DPS podmínky výběru (60 let / 60 měsíců) | Fixní | Při změně zákona |
| DIP podmínky výběru (60 let / 120 měsíců) | Fixní | Při změně zákona |
| Sazby odvodů I. pilíře (6,5% / 21,5%) | Fixní | Při změně zákona |

***

*Zdroje: ČSSZ (cssz.cz), Ministerstvo financí ČR (mf.gov.cz), Asociace penzijních společností ČR (apscr.cz), MPSV (mpsv.cz), Freedom Financial Services, CERGE-EI (idea.cerge-ei.cz), Penize.cz, Rozbitéprasátko.cz, iFund.cz – stav duben 2026.*

---

## References

1. [Náhradový poměr – proč na něm záleží a jak mu rozumět?](https://www.freedom.cz/blog/nahradovy-pomer) - Jedině tu, že v České republice je celkový náhradový poměr 47 % a že bude klesat a obecně, že důchod...

2. [[PDF] Penzijní spoření se státní podporou v České republice](https://idea.cerge-ei.cz/files/IDEA_Studie_4_2020_III_duchodovy_pilir/files/extfile/IDEA_Studie_4_2020_III_duchodovy_pilir.pdf) - do důchodu ukazuje čistý náhradový poměr v okamžiku odchodu do důchodu. U průměrného českého seniora...

3. [Kolik je v Česku důchodců? Aktuální čísla a trendy stárnutí ...](https://mladiduchem.cz/kolik-je-v-cesku-duchodcu-aktualni-cisla-a-trendy-starnuti-populace) - V Česku je přes 2,8 milionu důchodců - každý pátý občan. Zjistěte, kolik jich je, kde žijí, kolik do...

4. [Náhradový poměr je tristní, na důchod si spořte! | APS ČR](https://apscr.cz/aktuality/nahradovy-pomer-je-tristni-na-duchod-si-sporte) - Náhradový poměr v ČR, tedy rozdíl příjmu za ekonomicky aktivního života a státního starobního důchod...

5. [Důchodová reforma - Česká správa sociálního zabezpečení](https://www.cssz.cz/duchodova-reforma)

6. [Penzijní spoření 2026: Novinky, státní příspěvky a nevýhody.](https://rozbiteprasatko.cz/penzijni-sporeni/) - Pro nárok na státní příspěvek musí účastník přispívat alespoň 500 Kč měsíčně (do 1. 7. 2024 stačilo ...

7. [Jak v roce 2026 stát podporuje penzijní spoření?](https://www.csob-penze.cz/faq/jaka-bude-vyse-statnich-prispevku-na-penzijko-v-roce-2024/) - Maximální výše státního příspěvku se zvyšuje na 340 Kč za měsíc. Nejvyšší státní příspěvek 340 Kč mě...

8. [Kolik vám na penzi může přispět stát? - Česká spořitelna](https://financnezdravejsi.csas.cz/cs/resim-budoucnost/kolik-vam-na-penzi-muze-prispet-stat) - Maximální státní příspěvek ve výši 340 korun měsíčně získáte, pokud budete spořit 1 700 korun měsíčn...

9. [DIP: TOP 10 otázek o dlouhodobém investování - ČSOB Pojišťovna](https://www.csobpoj.cz/blog/zivotni-pojisteni-dlouhodoby-investicni-produkt) - Dlouhodobý investiční produkt (DIP) je účet, který si můžete založit pro daňově zvýhodněné investová...

10. [Dlouhodobý investiční produkt a daňová podpora produktů spoření ...](https://mf.gov.cz/cs/financni-trh/ochrana-spotrebitele/aktuality/2024/dlouhodoby-investicni-produkt-a-danova-podpora-pro-54732) - Za jakých podmínek si lze u DIP uplatnit odpočet od základu daně? · 10 letech (tj. 120 měsících) od ...

11. [Odpočet daní u DPS - Orbi](https://www.orbi.cz/radce/odpocet-dani-u-dps) - Využijte daňové výhody penzijního spoření. Zjistěte, jak ušetřit až 7 200 Kč ročně na daních.

12. [Dlouhodobý investiční produkt (DIP) – pravidla, daně a srovnání](https://ifund.cz/blog/dlouhodoby-investicni-produkt) - V případě, že by investor podmínky porušil, hrozí zpětné dodanění daňové výhody – tedy navrácení daň...

13. [Počet účastníků doplňkového penzijního spoření přesáhl půl milionu](https://apscr.cz/aktuality/pocet-ucastniku-doplnkoveho-penzijniho-sporeni-presahl-500000) - Celkem si v některém z fondů penzijních společností spořilo na důchod 4,543 milionu účastníků, z toh...

14. [Povinný příspěvek zaměstnavatele na produkty spoření na stáří](https://www.zdravotnickeodbory.cz/aktuality/povinny-prispevek-zamestnavatele-na-produkty-sporeni-na-stari/) - Dne 3. 9. 2025 byl ve Sbírce zákonů a mezinárodních smluv zveřejněn zákon č. 324/2025 Sb., o povinné...

15. [Povinné spoření pro vybrané rizikové profese - MPSV](https://www.mpsv.cz/povinne-sporeni-pro-vybrane-rizikove-profese) - Zaměstnavatelé mají nově povinnost přispívat na penzijní spoření zaměstnancům, jejichž práce spadá d...

16. [DIP už má přes 170 000 Čechů. Ale co to vlastně je?](https://www.rozumimepenezum.cz/dip-uz-ma-pres-170-000-cechu-ale-co-to-vlastne-je/) - Dlouhodobý investiční produkt je státem podporovaný nástroj pro spoření. Jeho cílem je motivovat k d...

17. [Dlouhodobý investiční produkt (DIP) a jeho daňové (ne)výhody](https://www.pkfapogeo.cz/blog/7317/dlouhodoby-investicni-produkt-dip-a-jeho-danove-nevyhody) - Základní podmínkou je „120/60“, čímž se rozumí, že dlouhodobý investiční produkt je možné vypovědět ...

18. [Kolik vydělaly penzijní fondy? Porovnání výnosů za rok 2025](https://www.penize.cz/doplnkove-penzijni-sporeni/479585-kolik-vydelaly-penzijni-fondy-porovnani-vynosu-za-rok-2025) - Jak zhodnotily peníze na stáří jednotlivé fondy v loňském roce a jaké jsou jejich dlouhodobé výsledk...

19. [Výsledky účastnických fondů PS za rok 2025 - Lukáš Prášek](https://www.lukasprasek.cz/blog/vysledky-ucastnickych-fondu-ps-za-rok-2025) - Výkonnost účastnických fondů byla v roce 2025 mírně slabší oproti 2024; dynamické strategie slavily ...

20. [Srovnání: Jak se dařilo penzijním fondům v roce 2025 - Novinky.cz](https://www.novinky.cz/clanek/ekonomika-prehledne-vetsina-penzijnich-fondu-loni-zabodovala-nektere-ale-kvuli-dolaru-zaostaly-za-ocekavanim-40558122) - Většina účastnických penzijních fondů loni porazila inflaci, u některých mohli lidé zhodnotit své pe...

21. [Kolik vydělalo vaše penzijní připojištění? Tady je nové ...](https://www.penize.cz/penzijni-pripojisteni/469882-kolik-vydelalo-vase-penzijni-pripojisteni-tady-je-nove-porovnani) - Fondy starého „penzijka“ připsaly loni střadatelům v průměru 2,11 procenta, nejvýkonnější fond pak p...

22. [Jakého zhodnocení dosáhlo vaše penzijní připojištění v ...](https://m.finparada.cz/8815-Zebricek-transformovanych-fondu-2024.aspx)

23. [Do penze s miliony. Kolik budete mít, když budete 30 let správně spořit](https://www.seznamzpravy.cz/clanek/ekonomika-finance-do-penze-s-miliony-kolik-budete-mit-kdyz-budete-30-let-spravne-sporit-295553) - Stát na doplňkové penzijní spoření přispívá až od vašeho měsíčního vkladu ve výši 500 korun. Výše př...

