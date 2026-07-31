import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import AnimatedSection from './AnimatedSection';

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

export default function CityRanking({ stats }) {
  if (!stats) return null;

  return (
    <AnimatedSection delay={0.15}>
      <Box component="section" sx={{ py: 6, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 3, flexWrap: 'wrap', gap: 1.5 }}>
          <Typography variant="h2" sx={{ fontSize: '1.6rem', color: '#F8FAFC' }}>
            Classement des villes
          </Typography>
          <Typography variant="body2" sx={{ color: '#94A3B8', maxWidth: '36ch', textAlign: 'right' }}>
            AQI moyen sur la période, échelle OpenWeatherMap 1 (Good) à 5 (Very Poor).
          </Typography>
        </Box>

        <Box
          sx={{
            backgroundColor: '#000000',
            border: '1px solid rgba(255, 255, 255, 0.7)',
            borderRadius: '16px',
            p: { xs: 2.5, md: 3.5 },
            boxShadow: '0 0 30px rgba(255, 255, 255, 0.04)',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {stats.ranking.map((r, i) => {
              const pct = (r.mean / 5) * 100;
              const color = cityColor(r.city, i);
              return (
                <Box
                  key={r.city}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '130px 1fr 70px',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: '0.92rem', color: '#F8FAFC' }}>
                    {i + 1}. {r.city}
                  </Typography>
                  <Box
                    sx={{
                      height: 22,
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: i * 0.08, ease: 'easeOut' }}
                      style={{
                        height: '100%',
                        borderRadius: '5px',
                        background: `linear-gradient(90deg, ${color}, ${color}88)`,
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: '"IBM Plex Mono", monospace',
                      fontSize: '0.88rem',
                      textAlign: 'right',
                      color: '#CBD5E1',
                    }}
                  >
                    {r.mean.toFixed(2)}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </AnimatedSection>
  );
}