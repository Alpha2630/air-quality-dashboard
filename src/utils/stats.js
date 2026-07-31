function mean(arr) {
  return arr.reduce((a, b) => a + b, 0) / (arr.length || 1);
}

export function pearson(x, y) {
  const n = x.length;
  const mx = mean(x);
  const my = mean(y);
  let num = 0,
    dx2 = 0,
    dy2 = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - mx;
    const dy = y[i] - my;
    num += dx * dy;
    dx2 += dx * dx;
    dy2 += dy * dy;
  }
  const denom = Math.sqrt(dx2 * dy2);
  return denom === 0 ? 0 : num / denom;
}

export const POLLUTANTS = ['co', 'no', 'no2', 'o3', 'so2', 'pm2_5', 'pm10', 'nh3', 'aqi'];

export function computeStats(rows) {
  rows.forEach((r) => {
    if (!r.__dt) {
      r.__dt = new Date(r.datetime_utc);
      r.__hour = r.__dt.getUTCHours();
      r.__dow = r.__dt.getUTCDay();
      r.__weekend = r.__dow === 0 || r.__dow === 6;
    }
  });

  const cities = Array.from(new Set(rows.map((r) => r.city))).sort();

  // Hourly avg per city
  const hourly = {};
  cities.forEach((c) => {
    hourly[c] = new Array(24).fill(0).map(() => ({ sum: 0, n: 0 }));
  });
  rows.forEach((r) => {
    const bucket = hourly[r.city][r.__hour];
    bucket.sum += r.aqi;
    bucket.n += 1;
  });
  const hourlySeries = {};
  cities.forEach((c) => {
    hourlySeries[c] = hourly[c].map((b) => (b.n ? b.sum / b.n : null));
  });

  // Ranking
  const ranking = cities
    .map((c) => {
      const vals = rows.filter((r) => r.city === c).map((r) => r.aqi);
      return { city: c, mean: mean(vals) };
    })
    .sort((a, b) => b.mean - a.mean);

  // Correlation matrix
  const corr = {};
  POLLUTANTS.forEach((p1) => {
    corr[p1] = {};
    POLLUTANTS.forEach((p2) => {
      const x = rows.map((r) => +r[p1]);
      const y = rows.map((r) => +r[p2]);
      corr[p1][p2] = pearson(x, y);
    });
  });

  // Paris weekday/weekend NO2
  const parisRows = rows.filter((r) => r.city === 'Paris');
  const parisWeekdayNO2 = mean(parisRows.filter((r) => !r.__weekend).map((r) => r.no2));
  const parisWeekendNO2 = mean(parisRows.filter((r) => r.__weekend).map((r) => r.no2));

  // Weekday/weekend NO2 per city
  const weekdayByCity = cities.map((c) => {
    const cr = rows.filter((r) => r.city === c);
    return {
      city: c,
      semaine: mean(cr.filter((r) => !r.__weekend).map((r) => r.no2)),
      weekend: mean(cr.filter((r) => r.__weekend).map((r) => r.no2)),
    };
  });

  // Severity
  const pctAlert = (rows.filter((r) => r.aqi >= 4).length / rows.length) * 100;

  // Coverage
  const times = rows.map((r) => r.__dt.getTime());
  const minT = Math.min(...times);
  const maxT = Math.max(...times);
  const theoreticalHours = Math.round((maxT - minT) / 3600000) + 1;
  const rowsPerCity = mean(cities.map((c) => rows.filter((r) => r.city === c).length));
  const coveragePct = (rowsPerCity / theoreticalHours) * 100;

  return {
    cities,
    hourlySeries,
    ranking,
    corr,
    parisWeekdayNO2,
    parisWeekendNO2,
    weekdayByCity,
    pctAlert,
    coveragePct,
    nRows: rows.length,
    minDate: new Date(minT),
    maxDate: new Date(maxT),
  };
}