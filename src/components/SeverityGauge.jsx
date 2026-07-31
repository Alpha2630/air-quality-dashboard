import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import AnimatedSection from './AnimatedSection';

export default function SeverityGauge({ pctAlert, nRows, cities, minDate, maxDate, coveragePct }) {
  const clamped = Math.min(Math.max(pctAlert || 0, 0), 100);
  const circumference = 251.2;
  const offset = circumference - circumference * (clamped / 100);
  const isHigh = clamped > 15;

  const fmt = (d) => (d ? d.toISOString().slice(0, 10) : '—');

  return (
    <AnimatedSection delay={0.3}>
      <Box
        component="footer"
        sx={{
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '16px',
          py: 8,
          px: { xs: 3, md: 5 },
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '220px 1fr' },
          gap: 4,
          alignItems: 'center',
        }}
      >
        {/* Gauge */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ position: 'relative', width: 200, height: 120 }}>
            <svg width="200" height="120" viewBox="0 0 200 120">
              {/* Background arc */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="#192539"
                strokeWidth="16"
                strokeLinecap="round"
              />
              {/* Filled arc */}
              <motion.path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke={isHigh ? '#FF5C4A' : '#00C8A0'}
                strokeWidth="16"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                whileInView={{ strokeDashoffset: offset }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                style={{ filter: isHigh ? 'drop-shadow(0 0 8px #FF5C4A)' : 'drop-shadow(0 0 8px #00C8A0)' }}
              />
            </svg>
            <Typography
              sx={{
                position: 'absolute',
                bottom: 10,
                left: '50%',
                transform: 'translateX(-50%)',
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: isHigh ? '#FF5C4A' : '#00C8A0',
              }}
            >
              {clamped.toFixed(2)}%
            </Typography>
          </Box>
          <Typography
            variant="caption"
            sx={{ color: 'text.disabled', textAlign: 'center', mt: 1, maxWidth: '22ch' }}
          >
            du temps mesuré en qualité d'air Poor ou Very Poor — le vrai enjeu est la surveillance
            préventive, pas la gestion de crise.
          </Typography>
        </Box>

        {/* Info */}
        <Box>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1.5, lineHeight: 1.6 }}>
            Ce tableau de bord accompagne le projet DONNEES2 (pipeline de collecte automatisé, 5
            villes, warehouse en modélisation dimensionnelle) et son volet individuel IA1 (analyse
            exploratoire, cas d'usage santé publique).
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.disabled', mb: 1.5, lineHeight: 1.6 }}>
            Source des données : OpenWeatherMap Air Pollution API. L'AQI est exprimé sur l'échelle
            OpenWeatherMap 1–5 (1 = Good, 5 = Very Poor).
          </Typography>
          <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 2, mt: 2 }}>
            <Typography variant="caption" sx={{ color: 'text.disabled', fontFamily: '"IBM Plex Mono", monospace' }}>
              {(nRows || 0).toLocaleString('fr-FR')} lignes · {cities?.length || 0} villes ·{' '}
              {fmt(minDate)} → {fmt(maxDate)} · couverture {(coveragePct || 0).toFixed(1)}%
            </Typography>
          </Box>
        </Box>
      </Box>
    </AnimatedSection>
  );
}