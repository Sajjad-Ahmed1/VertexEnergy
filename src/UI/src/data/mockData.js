// Mock data — simulates live SCADA / historian feed
// In production this would be replaced by real API calls

export const ASSETS = [
  {
    id: 'PUMP-101',
    name: 'Centrifugal Pump A',
    type: 'Pump',
    location: 'Unit 3 — Upstream',
    status: 'nominal',
    uptime: 99.7,
    lastSync: new Date().toISOString(),
    tags: [
      { id: 'PT-101', name: 'Inlet Pressure',    value: 48.2, unit: 'bar',  status: 'nominal'  },
      { id: 'FT-101', name: 'Flow Rate',          value: 320,  unit: 'm³/h', status: 'nominal'  },
      { id: 'TT-101', name: 'Bearing Temp',       value: 72.1, unit: '°C',  status: 'warning'  },
      { id: 'VT-101', name: 'Vibration',          value: 4.2,  unit: 'mm/s',status: 'nominal'  },
    ],
  },
  {
    id: 'PUMP-102',
    name: 'Centrifugal Pump B',
    type: 'Pump',
    location: 'Unit 3 — Upstream',
    status: 'critical',
    uptime: 81.2,
    lastSync: new Date().toISOString(),
    tags: [
      { id: 'PT-102', name: 'Inlet Pressure',    value: 12.4, unit: 'bar',  status: 'critical' },
      { id: 'FT-102', name: 'Flow Rate',          value: 89,   unit: 'm³/h', status: 'critical' },
      { id: 'TT-102', name: 'Bearing Temp',       value: 118.6,unit: '°C',  status: 'critical' },
      { id: 'VT-102', name: 'Vibration',          value: 14.7, unit: 'mm/s',status: 'critical' },
    ],
  },
  {
    id: 'VLV-201',
    name: 'Control Valve — Main Line',
    type: 'Valve',
    location: 'Unit 5 — Downstream',
    status: 'warning',
    uptime: 96.1,
    lastSync: new Date().toISOString(),
    tags: [
      { id: 'POS-201', name: 'Position',          value: 62,   unit: '%',   status: 'warning'  },
      { id: 'PT-201',  name: 'Upstream Pressure', value: 55.0, unit: 'bar', status: 'nominal'  },
      { id: 'PT-202',  name: 'Downstream Press',  value: 31.2, unit: 'bar', status: 'warning'  },
    ],
  },
  {
    id: 'TK-301',
    name: 'Storage Tank Alpha',
    type: 'Tank',
    location: 'Tank Farm — Section A',
    status: 'nominal',
    uptime: 100,
    lastSync: new Date().toISOString(),
    tags: [
      { id: 'LT-301', name: 'Level',              value: 78.4, unit: '%',   status: 'nominal'  },
      { id: 'TT-301', name: 'Product Temp',       value: 42.0, unit: '°C',  status: 'nominal'  },
      { id: 'PT-301', name: 'Tank Pressure',      value: 1.03, unit: 'bar', status: 'nominal'  },
    ],
  },
  {
    id: 'COMP-401',
    name: 'Gas Compressor #1',
    type: 'Compressor',
    location: 'Compression Station',
    status: 'nominal',
    uptime: 98.5,
    lastSync: new Date().toISOString(),
    tags: [
      { id: 'PT-401', name: 'Suction Pressure',  value: 15.6, unit: 'bar', status: 'nominal'  },
      { id: 'PT-402', name: 'Discharge Pressure', value: 82.1, unit: 'bar', status: 'nominal'  },
      { id: 'TT-401', name: 'Discharge Temp',    value: 88.4, unit: '°C',  status: 'nominal'  },
      { id: 'SP-401', name: 'Speed',             value: 2980, unit: 'RPM', status: 'nominal'  },
    ],
  },
  {
    id: 'HTR-501',
    name: 'Process Heater H-501',
    type: 'Heater',
    location: 'Unit 7 — Processing',
    status: 'warning',
    uptime: 93.4,
    lastSync: new Date().toISOString(),
    tags: [
      { id: 'TT-501', name: 'Outlet Temp',       value: 312.8, unit: '°C', status: 'warning'  },
      { id: 'FT-501', name: 'Fuel Gas Flow',     value: 1240,  unit: 'kg/h',status: 'nominal' },
      { id: 'AT-501', name: 'O₂ Excess',         value: 2.1,   unit: '%',  status: 'warning'  },
    ],
  },
];

// ── Alarms ────────────────────────────────────────────────────
export const ALARMS = [
  {
    id: 'ALM-0042',
    priority: 'critical',
    tag: 'TT-102',
    asset: 'PUMP-102',
    assetName: 'Centrifugal Pump B',
    description: 'Bearing temperature exceeds critical limit (118.6°C > 110°C)',
    timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    acknowledged: false,
  },
  {
    id: 'ALM-0041',
    priority: 'critical',
    tag: 'PT-102',
    asset: 'PUMP-102',
    assetName: 'Centrifugal Pump B',
    description: 'Inlet pressure below minimum operating threshold (12.4 bar < 20 bar)',
    timestamp: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
    acknowledged: false,
  },
  {
    id: 'ALM-0040',
    priority: 'warning',
    tag: 'TT-101',
    asset: 'PUMP-101',
    assetName: 'Centrifugal Pump A',
    description: 'Bearing temperature approaching high limit (72.1°C, limit 80°C)',
    timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    acknowledged: true,
  },
  {
    id: 'ALM-0039',
    priority: 'warning',
    tag: 'TT-501',
    asset: 'HTR-501',
    assetName: 'Process Heater H-501',
    description: 'Outlet temperature deviation from setpoint (+12.8°C)',
    timestamp: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
    acknowledged: false,
  },
  {
    id: 'ALM-0038',
    priority: 'warning',
    tag: 'PT-202',
    asset: 'VLV-201',
    assetName: 'Control Valve — Main Line',
    description: 'Downstream pressure drop detected (31.2 bar, setpoint 38 bar)',
    timestamp: new Date(Date.now() - 47 * 60 * 1000).toISOString(),
    acknowledged: true,
  },
];

// ── Telemetry time-series (last 24h, 30-min intervals) ────────
function generateSeries(base, variance, points = 48) {
  return Array.from({ length: points }, (_, i) => {
    const t = new Date(Date.now() - (points - i) * 30 * 60 * 1000);
    return {
      time: t.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      value: +(base + (Math.random() - 0.5) * variance * 2).toFixed(2),
    };
  });
}

export const TELEMETRY_SERIES = {
  'PT-101': { label: 'Inlet Pressure',  unit: 'bar',  data: generateSeries(48, 3),    color: '#22D3EE' },
  'FT-101': { label: 'Flow Rate',       unit: 'm³/h', data: generateSeries(320, 25),  color: '#3FB950' },
  'TT-101': { label: 'Bearing Temp',    unit: '°C',   data: generateSeries(71, 4),    color: '#E3B341' },
  'TT-102': { label: 'Bearing Temp B',  unit: '°C',   data: generateSeries(100, 15),  color: '#F85149' },
};

// ── KPI summary ────────────────────────────────────────────────
export const KPI_SUMMARY = {
  totalAssets:      ASSETS.length,
  assetsOnline:     ASSETS.filter(a => a.status !== 'offline').length,
  criticalAlarms:   ALARMS.filter(a => a.priority === 'critical' && !a.acknowledged).length,
  warningAlarms:    ALARMS.filter(a => a.priority === 'warning'  && !a.acknowledged).length,
  avgUptime:        +(ASSETS.reduce((s, a) => s + a.uptime, 0) / ASSETS.length).toFixed(1),
  activeDigitalTwins: 4,
};
