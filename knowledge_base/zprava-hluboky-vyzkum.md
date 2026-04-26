# Monerio knowledge base: český finanční a realitní trh

## Kontext a metodika
PT, níže máš „parametrickou“ knowledge base pro kalkulačky a dashboardy (stav k **2. 4. 2026**, časové pásmo Evropa/Praha). Je psaná tak, aby z ní šly přímo vytáhnout:
- **konstanty** (např. správní poplatky, limity LTV/DTI/DSTI),
- **defaulty** (např. průměrné sazby, průměrné ceny, dlouhodobé tempo růstu),
- **hranice/range** pro validaci vstupů (např. min/max sazby, LTV limity),
- **update cadence** (měsíčně / kvartálně / ročně podle toho, jak zdroje publikují data).

Zdroje jsou co nejvíc „primární“: entity["organization","Česká národní banka","central bank czechia"] pro sazby/limity a komentáře finanční stability, entity["organization","Česká bankovní asociace","czech banking association"] pro hypoteční tržní statistiku (Hypomonitor), entity["organization","Český statistický úřad","national statistics office czechia"] pro cenové a inflační statistiky, entity["organization","Ministerstvo financí České republiky","finance ministry czechia"] pro cenovou mapu nájemního bydlení a některé dluhopisové/statistické výstupy, entity["organization","Finanční správa České republiky","tax administration czechia"] pro daňovou agendu a entity["organization","Český úřad zeměměřický a katastrální","cadastral authority czechia"] pro katastrální poplatky. citeturn32view0turn28view3turn29view5turn33view0turn34view0turn21view1turn35search3

## Hypoteční a úvěrový trh
Nejpraktičtější “default” pro hypoteční kalkulačky je **realizovaná průměrná sazba nových hypoték** (ne nabídkový marketing). Podle Hypomonitoru **v únoru 2026**:  
- průměrná realizovaná sazba nových hypoték ~ **4,46 % p.a.**  
- objem skutečně nových hypoték bez refinancování **29,7 mld. Kč**  
- průměrná výše nové hypotéky **4,63 mil. Kč** (implikuje i default pro „typickou“ velikost úvěru v UI) citeturn32view0

Makroobezřetnostní nastavení pro kalkulačku dostupnosti hypotéky je teď v praxi kombinace:
- **LTV (loan-to-value)**: závazná horní hranice **80 %**, resp. **90 % pro žadatele mladší 36 let** pořizující vlastní bydlení; nad limit jen „na výjimku“. citeturn28view3  
- **DTI**: závazná horní hranice aktuálně není; doporučená hranice je **8× roční čistý příjem** (pro “varovný” režim kalkulačky). citeturn29view1  
- **DSTI**: závazná horní hranice aktuálně není; doporučená hranice je **40 %** (podíl všech měsíčních splátek na čistém měsíčním příjmu). citeturn29view5  

### Investiční hypotéky a zpřísnění od 1. dubna 2026
Pro scénáře „kupuju další byt na pronájem“ je zásadní změna: ČNB doporučila u investičních hypoték uplatňovat **LTV 70 % a DTI 7**, s platností **od 1. 4. 2026**. Současně je důležité, jak ČNB investiční hypotéku definuje: jde o hypotéku na **třetí a další obytnou nemovitost** nebo na nemovitost **určenou k pronájmu**. citeturn31view0turn31view4  

Tohle je pro engine zásadní, protože to mění:
- minimální vlastní kapitál (downpayment) z typických 10–20 % na **30 %**,
- “strop” zadlužení (DTI 7) pro tuto kategorii. citeturn31view0turn31view4  

### Poplatky a transakční náklady
Pro účely kalkulaček se vyplatí držet poplatky jako samostatné parametry (uživatel je často chce přepsat):

- **Správní poplatek za návrh na vklad do katastru**: **2 000 Kč** za přijetí návrhu na zahájení řízení o povolení vkladu (položka 120). citeturn35search3turn35search10  
- **Odhad nemovitosti**: v praxi často **0 Kč v akci / v rámci produktu** (banky to umí „dát zdarma“, typicky marketingově), ale reálně existují i ceníkové hodnoty (často několik tisíc Kč). Jako důkaz praxe „odhad zdarma“: Česká spořitelna uvádí, že poplatky nejsou žádné a odhad poskytuje zdarma; Raiffeisenbank v kampani zmiňuje odhad v hodnotě **5 900 Kč** zdarma. citeturn25search5turn25search20  
- **Provize realitní kanceláře** (pokud jde přes RK): běžně se v ČR uvádí **cca 3–6 %**, často **4–5 %**, dle médií a tržní praxe. citeturn26search1  

## Ceny nemovitostí a nájemné
### Cenové hladiny a meziroční změny
Pro “defaultní” cenové hladiny do kalkulaček (např. předvyplnění ceny za m² a rychlé sanity checky) jsou dobře použitelné roční průměry ČSÚ za rok 2024:
- průměrná cena bytu v ČR: **63 521 Kč/m²**, v entity["city","Praha","capital of czechia"] **115 889 Kč/m²**  
- průměrná cena rodinného domu v ČR: **51 867 Kč/m²**, v Praze **106 753 Kč/m²**  
- úhrnný meziroční index cen nemovitostí 2024: **104,3**; byty **+6,0 %**, rodinné domy **+1,0 %** citeturn33view0  

### Dlouhodobé tempo růstu cen bytových nemovitostí
Pro “10letý trend” je nejčistší použít oficiální index cen bytových nemovitostí (HPI) s bází **2015 = 100**. Z dat za **Q4 2025** vychází, že:
- index HPI dosáhl **254,1** (Q4 2025), tj. ceny bytových nemovitostí jsou přibližně **o 154 % výš** než průměr roku 2015,  
- implikovaný nominální CAGR 2015→2025 vychází zhruba **~9,8 % p.a.** (výpočet z indexu),  
- meziročně (Q4 2025 vs Q4 2024) index vzrostl přibližně o **~10,4 %** (výpočet z indexu). citeturn24search9turn24search0  

Pro krátkodobější “momentum” je užitečný i kontext ČNB: v článku z léta 2025 uvádí, že **v 1. čtvrtletí 2025** index cen bytových nemovitostí meziročně vzrostl o **10 %** (nové byty **13 %**, starší **9,3 %**). citeturn24search7  

image_group{"layout":"carousel","aspect_ratio":"16:9","query":["Praha bytové domy ulice","české rezidenční nemovitosti bytový dům","satelitní pohled Praha rezidenční čtvrť"],"num_per_query":1}

### Nájemné vůči cenám nemovitostí
Pro modely “rent vs buy” je nejdůležitější mít:
1) **zdroj nájemného** (ideálně pravidelně aktualizovaný a regionální),  
2) konzistentní **cenovou hladinu** nemovitostí.

Cenová mapa nájemního bydlení MF:
- zobrazuje nájemné za m² pro referenční byt (nezahrnuje vybavení, balkon apod.; cílově „referenční“ standard),  
- je aktualizovaná **4× ročně** a publikovaná do **45 dnů po skončení čtvrtletí**,  
- pracuje s údaji o nově uzavíraných nájmech (ne se stávajícími smlouvami). citeturn21view1turn22view5  

Pro potřeby defaultu (bez regionální volby) se dá z této mapy odvodit “typické” nájemné za m². Prakticky se vyplatí držet v engine aspoň 4 velikostní kategorie (1+kk/1+1 … 4+ pokoje), protože nájemné za m² má se velikostí tendenci klesat.

Aby šlo rovnou modelovat poměr nájmu k ceně, můžeš použít hrubý výnos (gross rental yield):

- **gross_yield ≈ (měsíční_nájem_m2 × 12) / cena_m2**

Pokud jako cenový základ vezmeš průměrnou cenu bytu v ČR (63 521 Kč/m²) a nájemné pro střední velikost bytu (typicky 3 pokoje, např. ~70 m²), vychází hrubý „nájem/cena“ řádově jednotky procent. Cenová hladina (ČSÚ) a rychlejší růst cen bytových nemovitostí (HPI) ukazují, že bez odpovídajícího růstu nájmů má yield tendenci být v dražších lokalitách nižší. citeturn33view0turn24search9turn22view5  

## Cost of Inaction model
“Cost of inaction” v realitách je typicky kombinace dvou věcí:
- **dražší vstupní cena** (nemovitost zdraží),
- **dražší kapitálová potřeba** (při LTV limitu roste nutný vlastní vklad),
a často i
- **mezitím placené nájemné** (pokud uživatel bydlí v nájmu).

### Minimální jádro modelu
Pro nemovitost s cenou `P0`, tempem růstu cen `g` a odkladem `t` let:

- budoucí cena: `P(t) = P0 × (1+g)^t`  
- navýšení ceny: `ΔP = P(t) − P0`  
- navýšení vlastních zdrojů při limitu LTV: `ΔEquity ≈ (1−LTV) × ΔP`

Proto je pro ČR hodně důležité mít v modelu správně **LTV limit** (80 % / 90 % pro <36 let u vlastního bydlení) a pro investiční hypotéky zvlášť (70 % od 1. 4. 2026). citeturn28view3turn31view0  

### Číselný příklad pro UI
Příklad: byt dnes `P0 = 5 000 000 Kč`. Varianta růstu cen:
- konzervativní 3 % p.a.
- střední 6 % p.a.
- historická reference z HPI (cca 9,8 % p.a. dle 2015–2025 indexu)

Navýšení kupní ceny (mil. Kč) při odkladu:

| Scénář růstu | 1 rok | 2 roky | 3 roky | 4 roky | 5 let |
|---|---:|---:|---:|---:|---:|
| 3 % | 0,15 | 0,30 | 0,46 | 0,63 | 0,80 |
| 6 % | 0,30 | 0,62 | 0,96 | 1,31 | 1,69 |
| ~9,8 % (HPI 2015–2025) | 0,49 | 1,03 | 1,61 | 2,26 | 2,97 |

Z toho rovnou plyne “dodatečný vlastní kapitál”:
- při **LTV 80 %**: ~20 % z těchto částek,
- při **LTV 90 %** (mladší <36 pro vlastní bydlení): ~10 %,
- při **LTV 70 %** (investiční hypotéka): ~30 %. citeturn24search9turn28view3turn31view0  

### Inflace jako druhá složka “nečinnosti”
Inflace ti do modelu vstupuje dvěma způsoby:
- eroze kupní síly úspor (pokud uživatel “šetří” na akontaci),
- růst nájmů a některých položek bydlení.

V únoru 2026 byla meziroční inflace (CPI) **1,4 %**, 12měsíční průměrná míra inflace **2,2 %**; nájemné za bydlení (v CPI) meziročně **+6,1 %** a imputované nájemné (náklady vlastnického bydlení) **+5,1 %**. citeturn34view0  

Prakticky: pokud chceš “cost of inaction” udělat srozumitelný, doporučuju v UI ukázat minimálně dvě křivky:
- **cena nemovitosti** při odkladu (scénář g),
- **potřebná akontace** (scénář g + LTV limit),
a volitelně:
- **nájemné** (scénář růstu nájemného, např. z CPI nebo z nájemní mapy MF).

## Inflace, spoření a investice
### Aktuální inflace jako default pro “reálné výnosy”
Pro přepočet nominálních výnosů na reálné je nejpraktičtější mít v engine dvě inflace:
- `inflation_yoy` (aktuální meziroční) – pro “teď a tady”
- `inflation_avg12m` (průměrná 12měsíční míra) – pro “vyhlazené” výpočty

Pro únor 2026: **1,4 % yoy** a **2,2 % průměrná míra**. citeturn34view0  

### Spoření a “cash” (reálná nula je normální)
ČNB v komentáři k úrokovým sazbám MFI uvádí (pro domácnosti) mj.:
- vklady s dohodnutou splatností: **2,93 %**
- jednodenní vklady: **1,44 %**
- vklady na běžných účtech: **0,13 %** citeturn36search3  

Z toho jde snadno udělat defaultní reálný výnos:
- při nominálu 2,93 % a inflaci 2,2 % je reálný výnos řádově **~0,7 % p.a.** (orientačně; záleží na zvolené inflaci). citeturn36search3turn34view0  

### Státní dluhopisy
Pro “bezrizikový” baseline v CZK se hodí výnos 10letého státního dluhopisu (sekundární trh). OECD definuje dlouhodobé sazby jako výnosy desetiletých vládních dluhopisů, odvozené z cen na finančních trzích. citeturn36search6  

Datový bod (OECD přes FRED): průměrný výnos 10Y pro ČR byl **Q4 2025: 4,57164 %**. citeturn36search2  

Orientační reálný výnos (při inflaci 2,2 %): řádově **~2,3 % p.a.** (jen ilustrace reálného přepočtu; pro simulace je lepší držet zvlášť nominální výnos a inflaci). citeturn36search2turn34view0  

### Akcie
Pro dlouhodobé defaulty (když uživatel nevybere konkrétní portfolio) je užitečné opřít se o historické studie:
- Podle UBS Global Investment Returns Yearbook (shrnutí) měly globální akcie od roku 2000 anualizovaný **reálný výnos ~3,5 %** a “equity premium” vůči cash ~**4,3 %**. citeturn36search0turn36search8  
- Pro velmi dlouhý horizont (125 let) uvádí shrnutí z prostředí akademické instituce (Cambridge), že anualizované reálné výnosy byly cca **5,2 % pro světové akcie**, **1,7 % pro dluhopisy** a **0,5 % pro bills** (1900–2024). citeturn36search12  

Do kalkulačky se to typicky promítne jako:
- `equities_real_return_default` (např. 3,5–5 %),
- `bonds_real_return_default` (např. 1–2 %),
- `cash_real_return_default` (např. 0–1 %),
s tím, že UI musí jasně označit, že jde o **historické reference, ne garanci**.

## Daňové a legislativní parametry
### Odpočet úroků z úvěru na bydlení
Pro české kalkulačky čistého cashflow po zdanění je odpočet úroků hodně znát (typicky u vyšších sazeb a v prvních letech splácení).

Klíčový parametr je limit nezdanitelné části:
- pro bytovou potřebu obstaránou od **1. 1. 2021** se pracuje s limitem **150 000 Kč** (logika a limit jsou popsané v návazných materiálech finanční správy / legislativních dokumentech). citeturn35search4turn35search0  
- zároveň v praxi pořád existuje režim “starých” úvěrů s historickým limitem **300 000 Kč** – typicky řešeno jako přechodový režim dle data obstarání bytové potřeby (viz vysvětlující materiál). citeturn35search0  

Pro engine je nejbezpečnější držet:
- `mortgage_interest_deduction_limit_pre2021 = 300000`
- `mortgage_interest_deduction_limit_from2021 = 150000`
a rozhodovat podle `acquisition_date` (ne podle data refinancování), protože refinancování samo o sobě obvykle nemění režim (přesné posouzení je ale věc konkrétní situace a zákonných podmínek). citeturn35search0  

### Daň z nemovitých věcí
Do kalkulaček je vhodné promítnout minimálně:
- že přiznání se podává **do 31. ledna** zdaňovacího období (příklad: koupím v roce 2025 → přiznání na rok 2026). citeturn35search16  
- že **koeficienty** (a tím i výsledná daň) jsou z velké části věcí obce – klíčový nástroj je místní koeficient a jeho varianty. citeturn35search2turn35search6  
- že existuje oficiální služba pro **vyhledání koeficientů** pro výpočet daně, kterou lze použít jako datový vstup (nebo aspoň jako referenci pro UI). citeturn35search9  

## Parametry pro engine.js
Níže je návrh, jak to rozumně zabalit pro engine (konstanty + dynamika + ranges). Kód je záměrně „verbose“, aby sis to mohl rovnou překlopit do produkční struktury.

```js
/**
 * Monerio – CZ finance & real estate parameters
 * As-of date: 2026-04-02 (Europe/Prague)
 *
 * Notes:
 * - Values are defaults for simulation; user inputs should override.
 * - Keep both "current" and "smooth" (12m avg) inflation for real-return calculations.
 * - Store rates as decimals (e.g., 0.0446 = 4.46% p.a.).
 */
export const CZ_PARAMS = {
  meta: {
    asOfDate: "2026-04-02",
    locale: "cs-CZ",
    currency: "CZK",
    timeZone: "Europe/Prague",
  },

  // --- Mortgage market (defaults) ---
  mortgage: {
    // Market default: realized average rate of newly originated mortgages (monthly)
    rateDefault: 0.0446,

    // Common constraints for UI validation
    rateMin: 0.01,
    rateMax: 0.15,

    // Typical maturity assumptions
    maturityYearsDefault: 30,
    maturityYearsMin: 1,
    maturityYearsMax: 35,

    // Borrowing constraints (macroprudential)
    ltv: {
      // Standard own-occupancy ceiling
      maxDefault: 0.80,
      // Young borrower (<36) own-occupancy ceiling
      maxYoungDefault: 0.90,
      // Investment mortgage recommended ceiling (3rd+ property / rental purpose)
      maxInvestmentDefault: 0.70,
    },

    dti: {
      // Recommended DTI ceiling in CZ (general)
      recommendedMax: 8,
      // Investment mortgage recommended ceiling
      recommendedMaxInvestment: 7,
    },

    dsti: {
      // Recommended DSTI ceiling (general)
      recommendedMax: 0.40,
    },

    fees: {
      // Appraisal fee is often zero in campaigns; keep a conservative default and allow override
      appraisalFeeDefault: 5000,
      appraisalFeeMin: 0,
      appraisalFeeMax: 15000,

      // Cadastral filing fee for entry proposal ("návrh na vklad")
      cadastralEntryFee: 2000,

      // Real estate brokerage commission (if applicable)
      brokerageCommissionRateDefault: 0.045,
      brokerageCommissionRateMin: 0.03,
      brokerageCommissionRateMax: 0.06,

      // VAT on brokerage (only if broker is VAT payer and commission is quoted excl. VAT)
      vatRateStandard: 0.21,
    },
  },

  // --- Consumer credit (defaults) ---
  consumerCredit: {
    // If you model consumer loans, keep as a separate default from mortgage rates
    // (Use a conservative band, because product rates vary widely by scoring/features)
    rateDefault: 0.0825,
    rateMin: 0.03,
    rateMax: 0.30,
  },

  // --- Inflation (CPI) ---
  inflation: {
    yoyDefault: 0.014,       // current yoy CPI
    avg12mDefault: 0.022,    // 12m average CPI inflation
    min: -0.02,
    max: 0.20,

    // Rent inflation proxy from CPI component
    rentYoyDefault: 0.061,
  },

  // --- Real estate prices (levels and indices) ---
  realEstate: {
    pricePerM2: {
      // Annual average transaction price levels (apartment / house)
      apartmentCzDefault: 63521,
      apartmentPragueDefault: 115889,
      houseCzDefault: 51867,
      housePragueDefault: 106753,
    },

    // House Price Index (HPI) based growth proxy
    // Keep both a "recent yoy" and "long-run CAGR" for scenario modelling
    hpi: {
      baseYear: 2015,
      indexBase: 100,
      // From HPI index 2015=100 to 2025 Q4 ≈ 254.1 => ~9.8% nominal CAGR (approx.)
      longRunCagrDefault: 0.0977,
      longRunCagrMin: 0.00,
      longRunCagrMax: 0.15,
    },
  },

  // --- Savings / bonds / equities (expected returns for simulations) ---
  returns: {
    cash: {
      // Use CNB household deposit rates as a conservative baseline
      nominalDefault: 0.0293,
      nominalMin: 0.0,
      nominalMax: 0.10,
    },

    govtBonds: {
      // Use 10Y government bond yield as nominal anchor (quarterly / monthly average)
      nominal10YDefault: 0.0457,
      nominalMin: 0.0,
      nominalMax: 0.12,
    },

    equities: {
      // Long-run real equity return reference range (global history)
      realDefault: 0.045,
      realMin: -0.05,
      realMax: 0.12,
    },
  },

  // --- Tax & deductions ---
  tax: {
    mortgageInterestDeduction: {
      // Annual caps (CZK)
      capPre2021: 300000,
      capFrom2021: 150000,
    },
    propertyTax: {
      // Property tax is municipality- and property-specific; keep a placeholder for UI,
      // but prefer computing from area * rates * coefficients when you add full module.
      enabled: true,
    },
  },

  // --- Update cadence guidance (for your data pipeline) ---
  updateCadence: {
    mortgageRate: "monthly",
    consumerCreditRate: "monthly",
    inflation: "monthly",
    rentData: "quarterly",
    housePriceIndex: "quarterly",
    transactionPriceLevels: "annually",
    cadastralFee: "rarely",
    taxRules: "as_legislation_changes",
  },
};
```

Jak to napojit na zdroje (praktický mapping):
- `mortgage.rateDefault` (4,46 %) a související “typická” hypotéka (4,63 mil.) jsou přímo z Hypomonitoru (měsíční periodicita). citeturn32view0  
- `mortgage.ltv.maxDefault/maxYoungDefault` = 80 % / 90 % dle ČNB. citeturn28view3  
- `mortgage.ltv.maxInvestmentDefault` a `mortgage.dti.recommendedMaxInvestment` (LTV 70 %, DTI 7) platí jako doporučení od 1. 4. 2026 pro investiční hypotéky (3. a další nemovitost / pronájem). citeturn31view0turn31view4  
- `mortgage.dti.recommendedMax` (8) a `mortgage.dsti.recommendedMax` (40 %) vychází z aktuálně doporučených hranic (bez závazné horní hranice). citeturn29view1turn29view5  
- `mortgage.fees.cadastralEntryFee` = 2 000 Kč dle sazeb správních poplatků (položka 120). citeturn35search3turn35search10  
- `mortgage.fees.brokerageCommissionRateDefault` (4,5 %) drž jako default v rozmezí 3–6 % (tržně často 4–5 %). citeturn26search1  
- `inflation.*` (únor 2026) – CPI yoy 1,4 %, průměrná míra inflace 2,2 %; rent inflation proxy 6,1 %. citeturn34view0  
- `realEstate.pricePerM2.*` (roční průměry 2024) přímo dle ČSÚ. citeturn33view0  
- `realEstate.hpi.longRunCagrDefault` je odvozeno z HPI indexu (2015=100 → 2025 Q4 ≈ 254,1). citeturn24search9turn24search0  
- `returns.cash.nominalDefault` (2,93 %) je konzervativní baseline z depozitních sazeb domácností (ČNB). citeturn36search3  
- `returns.govtBonds.nominal10YDefault` (~4,57 %) můžeš držet jako anchor z 10Y výnosu (OECD přes FRED; kvartální průměry). citeturn36search2turn36search6  
- `returns.equities.realDefault` opři o dlouhodobé historické reference (globální reálné výnosy). citeturn36search12turn36search0