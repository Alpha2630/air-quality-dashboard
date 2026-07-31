import { Box, Typography } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { POLLUTANTS } from '../utils/stats';
import AnimatedSection from './AnimatedSection';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function corrColor(v) {
  // v in [-1, 1] → bleu foncé (négatif) → neutre → cyan (positif)
  const neg = [0, 104, 180];   // bleu
  const pos = [0, 200, 232];    // cyan
  const mid = [25, 45, 75];     // bleu foncé neutre
  let c1, c2, f;
  if (v < 0) {
    c1 = mid;
    c2 = neg;
    f = -v;
  } else {
    c1 = mid;
    c2 = pos;
    f = v;
  }
  const r = Math.round(c1[0] + (c2[0] - c1[0]) * f);
  const g = Math.round(c1[1] + (c2[1] - c1[1]) * f);
  const b = Math.round(c1[2] + (c2[2] - c1[2]) * f);
  return `rgb(${r},${g},${b})`;
}

function Heatmap({ corr }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '56px repeat(9, 1fr)',
        gap: '3px',
        fontFamily: '"IBM Plex Mono", monospace',
        fontSize: '10px',
      }}
    >
      <Box />
      {POLLUTANTS.map((p) => (
        <Box
          key={'top-' + p}
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            pb: 0.5,
            color: '#94A3B8',
            fontSize: '9.5px',
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
          }}
        >
          {p}
        </Box>
      ))}
      {POLLUTANTS.map((p1) => (
        <Box key={'row-' + p1} sx={{ display: 'contents' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              pr: 0.8,
              color: '#94A3B8',
              fontSize: '9.5px',
            }}
          >
            {p1}
          </Box>
          {POLLUTANTS.map((p2) => {
            const v = corr[p1][p2];
            return (
              <Box
                key={`${p1}-${p2}`}
                sx={{
                  aspectRatio: '1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                  backgroundColor: corrColor(v),
                  color: '#0D1525',
                  fontWeight: 600,
                  fontSize: '9px',
                }}
                title={`${p1} / ${p2} : ${v.toFixed(2)}`}
              >
                {v.toFixed(2)}
              </Box>
            );
          })}
        </Box>
      ))}
    </Box>
  );
}

export default function CorrelationSection({ stats }) {
  if (!stats) return null;

  const drop =
    stats.parisWeekdayNO2
      ? ((stats.parisWeekdayNO2 - stats.parisWeekendNO2) / stats.parisWeekdayNO2) * 100
      : 0;

  return (
    <AnimatedSection delay={0.2}>
      <Box component="section" sx={{ py: 6, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 3, flexWrap: 'wrap', gap: 1.5 }}>
          <Typography variant="h2" sx={{ fontSize: '1.6rem', color: '#F8FAFC' }}>
            Pourquoi l'ozone, et pas le trafic
          </Typography>
          <Typography variant="body2" sx={{ color: '#94A3B8', maxWidth: '38ch', textAlign: 'right' }}>
            Deux lectures complémentaires du même jeu de données.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' },
            gap: 3,
          }}
        >
          {/* Heatmap */}
          <Box
            sx={{
              backgroundColor: '#000000',
              border: '1px solid rgba(255, 255, 255, 0.7)',
              borderRadius: '16px',
              p: { xs: 2.5, md: 3 },
              boxShadow: '0 0 30px rgba(255, 255, 255, 0.04)',
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5, color: '#F8FAFC' }}>
              Corrélation entre polluants et AQI
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8', mb: 2.5, fontSize: 12.5 }}>
              L'ozone (O3) domine très largement — le NO2, lié au trafic, est même corrélé négativement.
            </Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <Heatmap corr={stats.corr} />
            </Box>
          </Box>

          {/* Weekday chart */}
          <Box
            sx={{
              backgroundColor: '#000000',
              border: '1px solid rgba(255, 255, 255, 0.7)',
              borderRadius: '16px',
              p: { xs: 2.5, md: 3 },
              boxShadow: '0 0 30px rgba(255, 255, 255, 0.04)',
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5, color: '#F8FAFC' }}>
              Paris fait exception
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8', mb: 2, fontSize: 12.5 }}>
              Seule ville où le trafic routier a un effet net et mesurable.
            </Typography>

            <Box
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 2,
                p: 2,
                mb: 2.5,
                fontSize: 13,
                color: '#CBD5E1',
              }}
            >
              À Paris, le NO2 chute de{' '}
              <strong style={{ color: '#00C8E8' }}>{drop.toFixed(0)}%</strong> le week-end (
              {stats.parisWeekdayNO2?.toFixed(2)} → {stats.parisWeekendNO2?.toFixed(2)} µg/m³) — la
              seule ville où le lien avec le trafic routier est net.
            </Box>

            <Box sx={{ height: 220 }}>
              <Bar
                data={{
                  labels: stats.weekdayByCity.map((d) => d.city),
                  datasets: [
                    {
                      label: 'Semaine',
                      data: stats.weekdayByCity.map((d) => d.semaine),
                      backgroundColor: '#0090FF',
                      borderRadius: 4,
                    },
                    {
                      label: 'Week-end',
                      data: stats.weekdayByCity.map((d) => d.weekend),
                      backgroundColor: '#00C8A0',
                      borderRadius: 4,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { labels: { color: '#F8FAFC', font: { size: 11.5 } } },
                    tooltip: { backgroundColor: '#000000', borderColor: 'rgba(255, 255, 255, 0.3)', borderWidth: 1 },
                  },
                  scales: {
                    x: { ticks: { color: '#F8FAFC', font: { size: 10.5 } }, grid: { display: false } },
                    y: {
                      title: { display: true, text: 'NO2 (µg/m³)', color: '#94A3B8', font: { size: 11 } },
                      ticks: { color: '#F8FAFC' },
                      grid: { color: 'rgba(255, 255, 255, 0.08)' },
                    },
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </AnimatedSection>
  );
}