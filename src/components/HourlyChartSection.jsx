import { useState, useMemo, useCallback } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { RiskBandPlugin } from './RiskBandPlugin';
import AnimatedSection from './AnimatedSection';
import { StarfieldCanvas } from './SpaceBackground';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const CITY_COLORS = {
  Nice:      '#00E5FF',  // cyan électrique
  Marseille: '#448AFF',  // bleu vif
  Lyon:      '#7C4DFF',  // violet (rappel de l'accent couleur)
  Paris:     '#40C4FF',  // bleu clair saturé
  Toulouse:  '#90CAF9',  // bleu pastel (bon contraste sur fond noir)
};
const FALLBACK = ['#0066CC', '#0090FF', '#00B8D4', '#5B9EFF', '#7E9EC8'];

function cityColor(city, idx) {
  return CITY_COLORS[city] || FALLBACK[idx % FALLBACK.length];
}

export default function HourlyChartSection({ stats }) {
  const [activeSet, setActiveSet] = useState(() => new Set(stats?.cities || []));

  const toggleCity = useCallback((city) => {
    setActiveSet((prev) => {
      const next = new Set(prev);
      if (next.has(city)) next.delete(city);
      else next.add(city);
      return next;
    });
  }, []);

  const chartData = useMemo(() => {
    if (!stats) return null;
    const labels = Array.from({ length: 24 }, (_, h) => h + 'h');
    const datasets = stats.cities.map((c, i) => ({
      label: c,
      data: stats.hourlySeries[c],
      borderColor: cityColor(c, i),
      backgroundColor: cityColor(c, i),
      pointRadius: 3,
      borderWidth: 2.5,
      tension: 0.35,
      spanGaps: true,
      hidden: !activeSet.has(c),
    }));
    return { labels, datasets };
  }, [stats, activeSet]);

  if (!stats) return null;

  return (
    <AnimatedSection delay={0.1}>
      <Box
        component="section"
        sx={{
          py: 6,
          px: { xs: 2, md: 4 },
          borderBottom: '1px solid rgba(148, 163, 184, 0.08)',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#080B12',
          backgroundImage:
            'radial-gradient(ellipse at 50% 0%, rgba(30, 58, 138, 0.15) 0%, transparent 70%), radial-gradient(ellipse at 80% 50%, rgba(30, 58, 138, 0.05) 0%, transparent 50%)',
        }}
      >
        {/* Fond étoilé, derrière tout le contenu de la section */}
        <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <StarfieldCanvas />
        </Box>

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 3, flexWrap: 'wrap', gap: 1.5 }}>
            <Typography variant="h2" sx={{ fontSize: '1.6rem', color: '#F8FAFC' }}>
              La fenêtre à risque, heure par heure
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B', maxWidth: '38ch', textAlign: 'right' }}>
              AQI moyen par heure de la journée (UTC), pour chaque ville. La bande bleutée marque la plage 14h–17h.
            </Typography>
          </Box>

          {/* Carte "nuit" faite à la main : fond noir + bordure blanche, plus de dépendance à GlowCard */}
          <Box
            sx={{
              backgroundColor: '#000000',
              border: '1px solid rgba(255, 255, 255, 0.7)',
              borderRadius: '16px',
              p: { xs: 2.5, md: 3.5 },
              position: 'relative',
              boxShadow: '0 0 30px rgba(255, 255, 255, 0.04)',
            }}
          >
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2.5 }}>
              {stats.cities.map((c, i) => {
                const active = activeSet.has(c);
                const color = cityColor(c, i);
                return (
                  <Chip
                    key={c}
                    label={c}
                    onClick={() => toggleCity(c)}
                    variant={active ? 'filled' : 'outlined'}
                    sx={{
                      backgroundColor: active ? color : 'transparent',
                      borderColor: active ? color : 'rgba(255, 255, 255, 0.3)',
                      color: active ? '#000000' : '#F8FAFC',
                      fontWeight: 600,
                      fontSize: '0.73rem',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: color,
                        backgroundColor: active ? color : 'rgba(255, 255, 255, 0.08)',
                      },
                    }}
                  />
                );
              })}
            </Box>

            <Box sx={{ height: 360, position: 'relative' }}>
              {chartData && (
                <Line
                  data={chartData}
                  plugins={[RiskBandPlugin]}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: { mode: 'index', intersect: false },
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        backgroundColor: '#000000',
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        borderWidth: 1,
                        titleFont: { family: '"IBM Plex Mono", monospace' },
                        bodyFont: { family: '"IBM Plex Mono", monospace', size: 11 },
                      },
                    },
                    scales: {
                      x: {
                        title: { display: true, text: 'Heure (UTC)', color: '#94A3B8', font: { size: 11 } },
                        ticks: { color: '#F8FAFC', font: { size: 10.5 } },
                        grid: { color: 'rgba(255, 255, 255, 0.08)' },
                      },
                      y: {
                        title: { display: true, text: 'AQI moyen', color: '#94A3B8', font: { size: 11 } },
                        ticks: { color: '#F8FAFC', font: { size: 10.5 } },
                        grid: { color: 'rgba(255, 255, 255, 0.08)' },
                      },
                    },
                  }}
                />
              )}
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                mt: 2,
                pt: 2,
                borderTop: '1px dashed rgba(255, 255, 255, 0.2)',
              }}
            >
              <Box sx={{ width: 14, height: 14, borderRadius: '4px', bgcolor: 'rgba(255,255,255,0.1)', border: '1px solid #FFFFFF' }} />
              <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: 13 }}>
                Fenêtre à risque (14h–17h) : pic de formation photochimique de l'ozone, indépendant des heures de pointe du trafic.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </AnimatedSection>
  );
}