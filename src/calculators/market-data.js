export const marketData = {
  // Makro / Inflace
  inflationBase: 0.016, // 1.6% (KB: Q2 2026 prev)

  // Hypotéky / Trh
  mortgageRateAverage: 0.0450, // 4.50% (KB: hypo_rate_default)
  mortgageRateRealized: 0.0446, // 4.46% realized avg dle ČBA 02/2026
  monerioMortgageDiscount: -0.005, // -0.5% internal advantage
  propertyAppreciationPa: 0.06, // 6.00% (KB: property_appreciation_p_a)
  rentGrowthPa: 0.07, // 7.0% (KB: forecast 6-9%, midpoint)
  brokerCommissionRate: 0.0484, // 4.84% (KB: broker_commission_rate)
  katastrFee: 2000, // 2000 per vklad (KB: katastr_fee)
  appraisalFee: 4000, // 4000 (KB: appraisal_fee_default)
  consumerLoanRate: 0.0802, // 8.02% (KB)

  // Fixační sazby (ČBA, leden 2026)
  fixationRate1yr: 0.0495,
  fixationRate3yr: 0.0461,
  fixationRate5yr: 0.0483,
  fixationRate10yr: 0.0537,

  // Regionální data (ČSÚ/ČBA, Q1 2026)
  regions: {
    praha: { label: 'Praha', avgPrice: 8000000, pricePerM2: 150819, avgRent: 22100 },
    brno:  { label: 'Brno',  avgPrice: 7400000, pricePerM2: 120574, avgRent: 17200 },
    cr:    { label: 'Průměr ČR', avgPrice: 5300000, pricePerM2: 72000, avgRent: 16200 },
  },

  // Růst cen prognóza 2026
  propertyGrowthForecast: { low: 0.05, mid: 0.065, high: 0.08 },
  rentGrowthForecast: { low: 0.06, high: 0.09 },

  // Transakční náklady
  realtorFeeDefault: 0.03, // 3% odhad
  propertyInsuranceAvg: 3500, // Kč/rok

  // LTV & DTI (ČNB)
  ltvMaxStandard: 0.80,
  ltvMaxYoung: 0.90, // do 36 let
  ltvMaxInvest: 0.70, // investicni (od 1.4.2026)
  dtiMaxInvest: 7.00,
  dtiMaxStandard: 8.00,
  dstiMax: 0.40, // 40% doporučení

  // Daně
  taxDeductionRate: 0.15, // 15%
  taxDeductionLimit: 150000, // 150k pro smlouvy od 2021
  taxDeductionMaxSaving: 22500, // 150k * 15%

  // Penze, DPS a DIP (z 2026 KB)
  dps: {
    stateSupportMinTotal: 500,
    stateSupportOptimal: 1700, // Max for state support
    stateSupportMaxYearly: 4080, // 340 * 12
    taxDeductionThreshold: 1700,
  },
  dip: {
    taxDeductionMaxYearly: 48000,
    employerContribMaxYearly: 50000,
    taxRate: 0.15,
  },

  // Investice
  savingsAccountRate: 0.03, // 3.0% avg
  investmentGrowthNominal: 0.08, // 8% avg global equities

  // ── Mzdové sazby 2026 ──────────────────────
  wage: {
    year: 2026,
    employeeSocial: 0.071,          // 6.5% důchod + 0.6% nemocenské (konsolidační balíček 2024)
    employeeHealth: 0.045,          // 4.5%
    employerSocial: 0.248,          // 24.8%
    employerHealth: 0.090,          // 9.0%
    taxRate15: 0.15,
    taxRate23: 0.23,
    taxLimitMonthly: 146901,        // 3× průměrná mzda 2026 (~48 967 Kč)
    basicCredit: 2570,              // Základní sleva na poplatníka (měsíční)
    childCredits: [1267, 1860, 2320], // 1./2./3.+ dítě
    minGrossForBonus: 11200,        // ½ minimální mzdy — podmínka pro daňový bonus
    // Podrobný režim:
    spouseCredit: 2070,             // Sleva na manželku (příjem < 68 000 Kč/rok)
    disabilityCredits: [210, 420, 1345], // I./II./III. stupeň invalidity
    studentCredit: 335,             // Sleva na studenta
    dppThreshold: 10000,            // DPP: pod tímto bez odvodů
    dpcThreshold: 4000,             // DPČ: pod tímto bez odvodů
    lifeInsuranceMaxYearly: 24000,  // Max odpočet životní pojištění
    mortgageInterestMaxYearly: 150000, // Max odpočet úroků z hypotéky
    donationsMinPct: 0.02,          // Min 2% základu daně
    donationsMinAbs: 1000,          // nebo min 1 000 Kč
    donationsMaxPct: 0.30,          // Max 30% základu daně
  },

  // ── Důchodové a nemocenské redukční hranice 2026 ────────
  pension: {
    year: 2026,
    reductionLimit1: 21546,
    reductionLimit2: 195868,
    reductionCoeff1: 0.99,          // Novinka 2026: 1. hranice na 99 %
    reductionCoeff2: 0.26,
    basicAmount: 4900,
    percentPerYear: 0.015,          // 1.5% za rok pojištění
    defaultInsuranceYears: 45,
    retirementAge: 67,              // Cílový věk odchodu od 2025
    widowPercent: 0.50,             // 50% z procentní výměry z invalidity III. stupně
    orphanPercent: 0.40,            // 40% z procentní výměry z invalidity III. stupně
  },

  sickness: {
    year: 2026,
    reductionLimit1_daily: 1466,    // První redukční hranice denního vyměřovacího základu (DVZ)
    reductionLimit2_daily: 2199,    // Druhá redukční hranice DVZ
    reductionLimit3_daily: 4397,    // Třetí redukční hranice DVZ
    reductionCoeff1: 0.90,          // Z DVZ do 1. hranice se započte 90 %
    reductionCoeff2: 0.60,          // Z DVZ mezi 1. a 2. hranicí se započte 60 %
    reductionCoeff3: 0.30,          // Z DVZ mezi 2. a 3. hranicí se započte 30 %
    sicknessRate: 0.60,             // Základní sazba nemocenské od 15. do 30. dne (60 % z redukovaného DVZ)
  },
};

export function formatCurrency(value) {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    maximumFractionDigits: 0
  }).format(value);
}

export function formatPercentage(value) {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'percent',
    maximumFractionDigits: 2
  }).format(value);
}

// Convert numbers like '6 000 000' to 6000000
export function parseInput(str) {
  const val = str.replace(/[^\d]/g, '');
  return parseInt(val, 10) || 0;
}
