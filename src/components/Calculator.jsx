import { useState, useMemo } from 'react';
import {
  Lightbulb, Wind, Refrigerator, Fan, Tv, Monitor, Flame,
  Utensils, Microwave, WashingMachine, Plus, RotateCcw,
  Zap, Calculator as CalcIcon, DollarSign, Sun, Battery,
  BarChart3, Trash2, AlertCircle,
} from 'lucide-react';
import {
  createDefaultAppliances,
  createCustomAppliance,
  calculateResults,
  clamp,
  DEFAULT_RATE,
  COMMON_SYSTEM_SIZES,
  recommendSystemSize,
  APPLIANCE_PRESETS,
} from '@/utils/calculator';

const ICON_MAP = {
  lightbulb: Lightbulb,
  wind: Wind,
  refrigerator: Refrigerator,
  fan: Fan,
  tv: Tv,
  monitor: Monitor,
  flame: Flame,
  utensils: Utensils,
  microwave: Microwave,
  'washing-machine': WashingMachine,
};

function formatNum(n) {
  if (n === 0 || isNaN(n)) return '0';
  if (n < 0.01) return '< 0.01';
  return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

export default function Calculator() {
  const [appliances, setAppliances] = useState(createDefaultAppliances());
  const [rate, setRate] = useState(DEFAULT_RATE);

  const results = useMemo(() => calculateResults(appliances, rate), [appliances, rate]);
  const bestSystem = recommendSystemSize(results.recommendedKw);

  const updateAppliance = (id, field, value) => {
    setAppliances((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        let v = value;
        if (field === 'daysPerMonth') v = clamp(value, 0, 30);
        else if (field === 'hoursPerDay') v = clamp(value, 0, 24);
        else if (field === 'quantity') v = clamp(value, 0, 100);
        else if (field === 'wattage') v = clamp(value, 0, 100000);
        return { ...a, [field]: v };
      })
    );
  };

  const addCustom = () => {
    setAppliances((prev) => [...prev, createCustomAppliance()]);
  };

  const removeAppliance = (id) => {
    setAppliances((prev) => prev.filter((a) => a.id !== id));
  };

  const resetAll = () => {
    setAppliances(createDefaultAppliances());
    setRate(DEFAULT_RATE);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
            <CalcIcon className="w-5 h-5 text-yellow-500" />
            Appliance Inputs
          </h2>
          <div className="flex gap-2">
            <button
              onClick={addCustom}
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-navy-700 text-white hover:bg-navy-800 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add Custom
            </button>
            <button
              onClick={resetAll}
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {appliances.map((app) => {
            const preset = APPLIANCE_PRESETS.find((p) => p.name === app.name);
            const ActualIcon = preset ? ICON_MAP[preset.icon] : Zap;

            return (
              <div
                key={app.id}
                className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center shrink-0">
                    <ActualIcon className="w-4 h-4 text-yellow-600" />
                  </div>
                  {app.isCustom ? (
                    <input
                      type="text"
                      value={app.name}
                      onChange={(e) => updateAppliance(app.id, 'name', e.target.value)}
                      placeholder="Custom appliance name"
                      className="flex-1 px-2 py-1 text-sm font-medium border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  ) : (
                    <span className="flex-1 text-sm font-semibold text-gray-800">
                      {app.name}
                    </span>
                  )}
                  {app.isCustom && (
                    <button
                      onClick={() => removeAppliance(app.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      aria-label="Remove appliance"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <label className="block">
                    <span className="text-xs font-medium text-gray-500">Watts (W)</span>
                    <input
                      type="number"
                      min="0"
                      value={app.wattage}
                      onChange={(e) =>
                        updateAppliance(app.id, 'wattage', parseInt(e.target.value) || 0)
                      }
                      className="w-full mt-0.5 px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-medium text-gray-500">Qty</span>
                    <input
                      type="number"
                      min="0"
                      value={app.quantity}
                      onChange={(e) =>
                        updateAppliance(app.id, 'quantity', parseInt(e.target.value) || 0)
                      }
                      className="w-full mt-0.5 px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-medium text-gray-500">
                      Days/mo (max 30)
                    </span>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={app.daysPerMonth}
                      onChange={(e) =>
                        updateAppliance(app.id, 'daysPerMonth', parseInt(e.target.value) || 0)
                      }
                      className="w-full mt-0.5 px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-medium text-gray-500">
                      Hrs/day (max 24)
                    </span>
                    <input
                      type="number"
                      min="0"
                      max="24"
                      value={app.hoursPerDay}
                      onChange={(e) =>
                        updateAppliance(app.id, 'hoursPerDay', parseInt(e.target.value) || 0)
                      }
                      className="w-full mt-0.5 px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-yellow-500" />
          Results
        </h2>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <label className="block mb-4">
            <span className="text-sm font-medium text-gray-600">
              Rate per unit (Rs)
            </span>
            <input
              type="number"
              min="0"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value) || 0)}
              className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </label>

          <div className="space-y-3">
            <ResultRow
              icon={<Zap className="w-4 h-4" />}
              label="Total Monthly Units"
              value={`${formatNum(results.totalMonthlyKwh)} kWh`}
              highlight
            />
            <ResultRow
              icon={<Sun className="w-4 h-4" />}
              label="Daily Usage"
              value={`${formatNum(results.dailyUsage)} kWh`}
            />
            <ResultRow
              icon={<Zap className="w-4 h-4" />}
              label="Connected Load"
              value={`${formatNum(results.connectedLoad)} W`}
            />
            <ResultRow
              icon={<DollarSign className="w-4 h-4" />}
              label="Est. Monthly Bill"
              value={`Rs ${formatNum(results.estimatedBill)}`}
            />
            <ResultRow
              icon={<Sun className="w-4 h-4" />}
              label="Recommended Solar"
              value={`${formatNum(results.recommendedKw)} kW`}
              highlight
            />
            <ResultRow
              icon={<Battery className="w-4 h-4" />}
              label="550W Panels Needed"
              value={`${results.recommendedPanels} panels`}
              highlight
            />
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg flex gap-2">
            <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700">
              The estimated bill is approximate and does not include actual tariff
              slabs, taxes, or other charges.
            </p>
          </div>
        </div>

        {results.totalMonthlyKwh > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-700 mb-3">
              Appliance-wise Breakdown
            </h3>
            <div className="space-y-2.5">
              {results.breakdown.map((b) => (
                <div key={b.id}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-gray-600 truncate pr-2">
                      {b.name}
                    </span>
                    <span className="text-gray-500 shrink-0">
                      {formatNum(b.monthlyKwh)} kWh ({formatNum(b.percentage)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-300"
                      style={{ width: `${b.barWidth}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-700 mb-3">
            Common System Sizes
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {COMMON_SYSTEM_SIZES.map((s) => (
              <div
                key={s.size}
                className={`p-3 rounded-lg border-2 text-center transition-colors ${
                  bestSystem.kw === s.kw
                    ? 'border-yellow-400 bg-yellow-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="text-lg font-bold text-navy-900">{s.size}</div>
                <div className="text-xs text-gray-500">~{s.panels} panels</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">
            Generation values are estimates, not guarantees. Actual output varies
            by location, weather, and installation quality.
          </p>
        </div>
      </div>
    </div>
  );
}

function ResultRow({ icon, label, value, highlight }) {
  return (
    <div
      className={`flex items-center justify-between py-2 px-3 rounded-lg ${
        highlight ? 'bg-yellow-50' : 'bg-gray-50'
      }`}
    >
      <span className="flex items-center gap-2 text-sm text-gray-600">
        <span className={highlight ? 'text-yellow-600' : 'text-gray-400'}>
          {icon}
        </span>
        {label}
      </span>
      <span
        className={`text-sm font-bold ${
          highlight ? 'text-navy-900' : 'text-gray-700'
        }`}
      >
        {value}
      </span>
    </div>
  );
}
