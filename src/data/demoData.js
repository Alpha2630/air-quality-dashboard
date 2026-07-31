const CITY_CONFIGS = [
  { city: 'Paris', bias: 0, weekdayBoost: 0.9 },
  { city: 'Lyon', bias: -0.1, weekdayBoost: 0.5 },
  { city: 'Marseille', bias: 0.55, weekdayBoost: 0.1 },
  { city: 'Toulouse', bias: -0.25, weekdayBoost: 0.1 },
  { city: 'Nice', bias: 0.7, weekdayBoost: 0.1 },
];

export function generateDemoData() {
  const rows = [];
  const start = new Date('2026-04-01T00:00:00Z');

  for (let h = 0; h < 24 * 60; h++) {
    const dt = new Date(start.getTime() + h * 3600 * 1000);
    const hourOfDay = dt.getUTCHours();
    const dow = dt.getUTCDay();
    const isWeekend = dow === 0 || dow === 6;
    const ozoneBump = Math.max(0, 1 - Math.pow((hourOfDay - 15) / 4, 2)) * 1.6;

    CITY_CONFIGS.forEach((c) => {
      const trafficBump = isWeekend ? 0 : c.weekdayBoost;
      const noise = ((Math.sin(h * 0.037 + c.bias * 3) + 1) / 2) * 0.4;
      const aqiRaw = 1.6 + c.bias + ozoneBump * 0.5 + noise;
      const aqi = Math.min(5, Math.max(1, Math.round(aqiRaw)));
      const no2 = Math.max(0.1, 1.1 + trafficBump * 1.3 + Math.random() * 0.3);

      rows.push({
        city: c.city,
        country: 'France',
        lat: 0,
        lon: 0,
        timestamp: Math.floor(dt.getTime() / 1000),
        datetime_utc: dt.toISOString(),
        aqi,
        co: 130 + Math.random() * 20,
        no: Math.random() * 0.3,
        no2,
        o3: 60 + ozoneBump * 22 + Math.random() * 8,
        so2: 0.3 + Math.random() * 0.4,
        pm2_5: 2 + Math.random() * 4 + c.bias * 2,
        pm10: 3 + Math.random() * 4 + c.bias * 2,
        nh3: 2 + Math.random() * 1.5,
      });
    });
  }
  return rows;
}