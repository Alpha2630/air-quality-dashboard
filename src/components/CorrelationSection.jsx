import { Box, Typography } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { POLLUTANTS } from '../utils/stats';
import AnimatedSection from './AnimatedSection';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Fonction de couleur pour la heatmap (inchangée)
function corrColor(v) {
  const neg = [0, 104, 180];
  const pos = [0, 200, 232];
  const mid = [25, 45, 75];
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

// Composant Heatmap responsive
function Heatmap({ corr }) {
  return (
    <Box
      sx={{
        display: 'grid',
        // Sur mobile : la colonne de labels prend 36px, sur tablette+ : 56px
        // Les 9 colonnes de données se partagent l'espace restant avec un minimum de 20px
        gridTemplateColumns: {
          xs: '36px repeat(9, minmax(20px, 1fr))',
          sm: '48px repeat(9, minmax(24px, 1fr))',
          md: '56px repeat(9, 1fr)',
        },
        gap: '2px',
        fontFamily: '"IBM Plex Mono", monospace',
        fontSize: '10px',
        overflowX: 'auto', // déjà présent, permet de scroller horizontalement si nécessaire
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {/* Cellule vide en haut à gauche */}
      <Box />

      {/* En-têtes de colonnes */}
      {POLLUTANTS.map((p) => (
        <Box
          key={'top-' + p}
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            pb: 0.5,
            color: '#94A3B8',
            fontSize: { xs: '7px', sm: '8px', md: '9.5px' },
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
          }}
        >
          {p}
        </Box>
      ))}

      {/* Lignes de la heatmap */}
      {POLLUTANTS.map((p1) => (
        <Box key={'row-' + p1} sx={{ display: 'contents' }}>
          {/* Label de ligne */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              pr: 0.5,
              color: '#94A3B8',
              fontSize: { xs: '7px', sm: '8px', md: '9.5px' },
            }}
          >
            {p1}
          </Box>

          {/* Cellules de données */}
          {POLLUTANTS.map((p2) => {
            const v = corr[p1][p2];
            return (
              <Box
                key={`${p1}-${p2}`}
                sx={{
                  aspectRatio: '1', // garde les cellules carrées
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                  backgroundColor: corrColor(v),
                  color: '#0D1525',
                  fontWeight: 600,
                  fontSize: { xs: '7px', sm: '8px', md: '9px' },
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
      <Box
        component="section"
        sx={{
          py: { xs: 4, sm: 6 },
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          px: { xs: 1, sm: 0 }, // petit padding horizontal pour éviter le collage sur les bords du mobile
        }}
      >
        {/* En-tête */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            mb: 3,
            flexWrap: 'wrap',
            gap: 1.5,
            px: { xs: 1, sm: 0 },
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.3rem', sm: '1.6rem' },
              color: '#F8FAFC',
            }}
          >
            Pourquoi l'ozone, et pas le trafic
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#94A3B8',
              maxWidth: '38ch',
              textAlign: { xs: 'left', sm: 'right' },
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
            }}
          >
            Deux lectures complémentaires du même jeu de données.
          </Typography>
        </Box>

        {/* Grille des deux cartes */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' },
            gap: 3,
            px: { xs: 0, sm: 0 },
          }}
        >
          {/* Carte Heatmap */}
          <Box
            sx={{
              backgroundColor: '#000000',
              border: '1px solid rgba(255, 255, 255, 0.7)',
              borderRadius: '16px',
              p: { xs: 2, sm: 3 },
              boxShadow: '0 0 30px rgba(255, 255, 255, 0.04)',
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                mb: 0.5,
                color: '#F8FAFC',
                fontSize: { xs: '0.95rem', sm: '1rem' },
              }}
            >
              Corrélation entre polluants et AQI
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#94A3B8',
                mb: 2.5,
                fontSize: { xs: '11px', sm: '12.5px' },
              }}
            >
              L'ozone (O3) domine très largement — le NO2, lié au trafic, est même corrélé
              négativement.
            </Typography>
            {/* Heatmap avec défilement horizontal intégré */}
            <Box sx={{ overflowX: 'auto', pb: 1 }}>
              <Heatmap corr={stats.corr} />
            </Box>
          </Box>

          {/* Carte Paris + graphique */}
          <Box
            sx={{
              backgroundColor: '#000000',
              border: '1px solid rgba(255, 255, 255, 0.7)',
              borderRadius: '16px',
              p: { xs: 2, sm: 3 },
              boxShadow: '0 0 30px rgba(255, 255, 255, 0.04)',
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                mb: 0.5,
                color: '#F8FAFC',
                fontSize: { xs: '0.95rem', sm: '1rem' },
              }}
            >
              Paris fait exception
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#94A3B8',
                mb: 2,
                fontSize: { xs: '11px', sm: '12.5px' },
              }}
            >
              Seule ville où le trafic routier a un effet net et mesurable.
            </Typography>

            <Box
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 2,
                p: 1.5,
                mb: 2.5,
                fontSize: { xs: '12px', sm: '13px' },
                color: '#CBD5E1',
              }}
            >
              À Paris, le NO2 chute de{' '}
              <strong style={{ color: '#00C8E8' }}>{drop.toFixed(0)}%</strong> le week-end (
              {stats.parisWeekdayNO2?.toFixed(2)} → {stats.parisWeekendNO2?.toFixed(2)} µg/m³) — la
              seule ville où le lien avec le trafic routier est net.
            </Box>

            <Box
              sx={{
                height: { xs: 180, sm: 220 },
                position: 'relative',
              }}
            >
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
                    legend: {
                      labels: {
                        color: '#F8FAFC',
                        font: { size: 10 },
                        boxWidth: 12,
                      },
                    },
                    tooltip: {
                      backgroundColor: '#000000',
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      borderWidth: 1,
                    },
                  },
                  scales: {
                    x: {
                      ticks: {
                        color: '#F8FAFC',
                        font: { size: 10 },
                      },
                      grid: { display: false },
                    },
                    y: {
                      title: {
                        display: true,
                        text: 'NO2 (µg/m³)',
                        color: '#94A3B8',
                        font: { size: 10 },
                      },
                      ticks: { color: '#F8FAFC', font: { size: 9 } },
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