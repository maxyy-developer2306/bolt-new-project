export const APPLIANCE_PRESETS = [
  { name: 'Lights (LED)', wattage: 24, icon: 'lightbulb' },
  { name: 'Air Conditioner', wattage: 1500, icon: 'wind' },
  { name: 'Refrigerator', wattage: 150, icon: 'refrigerator' },
  { name: 'Fan', wattage: 80, icon: 'fan' },
  { name: 'Television', wattage: 120, icon: 'tv' },
  { name: 'Computer', wattage: 200, icon: 'monitor' },
  { name: 'Iron', wattage: 1000, icon: 'flame' },
  { name: 'Kitchen Appliances', wattage: 1000, icon: 'utensils' },
  { name: 'Microwave Oven', wattage: 1200, icon: 'microwave' },
  { name: 'Washing Machine', wattage: 500, icon: 'washing-machine' },
];

export const DEFAULT_RATE = 50;
export const PEAK_SUN_HOURS = 5;
export const SYSTEM_EFFICIENCY = 0.8;
export const PANEL_WATTAGE = 550;

export function createDefaultAppliances() {
  return APPLIANCE_PRESETS.map((preset, index) => ({
    id: `preset-${index}`,
    name: preset.name,
    wattage: preset.wattage,
    quantity: 1,
    daysPerMonth: 30,
    hoursPerDay: 6,
    isCustom: false,
  }));
}

export function createCustomAppliance() {
  return {
    id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: '',
    wattage: 0,
    quantity: 1,
    daysPerMonth: 30,
    hoursPerDay: 1,
    isCustom: true,
  };
}

export function clamp(value, min, max) {
  if (isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

export function calculateAppliance(appliance) {
  const watts = Number(appliance.wattage) || 0;
  const qty = Number(appliance.quantity) || 0;
  const days = Number(appliance.daysPerMonth) || 0;
  const hours = Number(appliance.hoursPerDay) || 0;

  const monthlyKwh = (watts * qty * days * hours) / 1000;
  const connectedLoad = watts * qty;

  return {
    monthlyKwh,
    connectedLoad,
    dailyKwh: monthlyKwh / 30,
  };
}

export function calculateResults(appliances, ratePerUnit) {
  let totalMonthlyKwh = 0;
  let connectedLoad = 0;
  const breakdown = [];

  for (const app of appliances) {
    const result = calculateAppliance(app);
    totalMonthlyKwh += result.monthlyKwh;
    connectedLoad += result.connectedLoad;
    breakdown.push({
      id: app.id,
      name: app.name || 'Custom Appliance',
      monthlyKwh: result.monthlyKwh,
      connectedLoad: result.connectedLoad,
      dailyKwh: result.dailyKwh,
    });
  }

  const dailyUsage = totalMonthlyKwh / 30;
  const estimatedBill = totalMonthlyKwh * (Number(ratePerUnit) || 0);
  const recommendedKw = dailyUsage / PEAK_SUN_HOURS / SYSTEM_EFFICIENCY;
  const recommendedPanels = Math.ceil(recommendedKw / (PANEL_WATTAGE / 1000));

  const maxKwh = Math.max(...breakdown.map((b) => b.monthlyKwh), 0.001);
  for (const b of breakdown) {
    b.percentage = totalMonthlyKwh > 0 ? (b.monthlyKwh / totalMonthlyKwh) * 100 : 0;
    b.barWidth = maxKwh > 0 ? (b.monthlyKwh / maxKwh) * 100 : 0;
  }

  breakdown.sort((a, b) => b.monthlyKwh - a.monthlyKwh);

  return {
    totalMonthlyKwh,
    dailyUsage,
    connectedLoad,
    estimatedBill,
    recommendedKw,
    recommendedPanels,
    breakdown,
  };
}

export const COMMON_SYSTEM_SIZES = [
  { size: '3 kW', panels: 6, kw: 3 },
  { size: '5 kW', panels: 10, kw: 5 },
  { size: '8 kW', panels: 15, kw: 8 },
  { size: '10 kW', panels: 19, kw: 10 },
];

export function recommendSystemSize(recommendedKw) {
  let best = COMMON_SYSTEM_SIZES[0];
  let minDiff = Math.abs(recommendedKw - best.kw);
  for (const s of COMMON_SYSTEM_SIZES) {
    const diff = Math.abs(recommendedKw - s.kw);
    if (diff < minDiff) {
      minDiff = diff;
      best = s;
    }
  }
  return best;
}
