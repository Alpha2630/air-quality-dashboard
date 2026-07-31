import { Box, Typography } from '@mui/material';
import {
  MdAir,
  MdLocationCity,
  MdWarningAmber,
  MdCloudQueue,
} from 'react-icons/md';
import { FaReact } from 'react-icons/fa';
import SpaceBackground from './SpaceBackground';
import ArcReactorRing from './ArcReactorRing';
import AnimatedSection from './AnimatedSection';

function StatBadge({ icon: Icon, value, label }) {
  return (
    <Box sx={{ borderLeft: '2px solid rgba(148, 163, 184, 0.2)', pl: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <Icon size={16} color="#4A7BD4" />
        <Typography
          variant="h6"
          sx={{
            fontFamily: '"IBM Plex Mono", monospace',
            color: '#6A9BEA',
            fontWeight: 600,
          }}
        >
          {value}
        </Typography>
      </Box>
      <Typography variant="caption" sx={{ color: '#64748B', fontSize: 11 }}>
        {label}
      </Typography>
    </Box>
  );
}

export default function HeroSection({ stats }) {
  const topCity = stats?.ranking?.[0];
  const o3Corr = stats?.corr?.['o3']?.['aqi'] ?? '—';

  return (
    <Box
      component="header"
      sx={{
        py: { xs: 6, md: 9 },
        position: 'relative',
        overflow: 'hidden',
        // Pas de fond, pas de bordure : le fond spatial fait tout
      }}
    >
      {/* Fond spatial pleine largeur */}
      <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <SpaceBackground primaryColor="#4A7BD4" accentColor="#7C3AED" />
      </Box>

      {/* Anneau décoratif Arc Reactor en haut à droite */}
      <Box
        sx={{
          position: 'absolute',
          top: -40,
          right: -60,
          opacity: 0.2,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        <ArcReactorRing size={280} />
      </Box>

      {/* Contenu du Hero */}
      <Box sx={{ position: 'relative', zIndex: 1, px: { xs: 3, md: 6 } }}>
        <AnimatedSection>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <FaReact
              size={18}
              color="#4A7BD4"
              style={{ filter: 'drop-shadow(0 0 6px #1E3A8A)' }}
            />
            <Typography
              variant="caption"
              sx={{
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#6A9BEA',
                fontWeight: 500,
              }}
            >
              Surveillance qualité de l'air — Paris · Lyon · Marseille ·
              Toulouse · Nice
            </Typography>
          </Box>

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '1.8rem', sm: '2.4rem', md: '3.2rem' },
              lineHeight: 1.08,
              maxWidth: '18ch',
              mb: 2.5,
              color: '#F8FAFC',
            }}
          >
            L'air se dégrade l'après-midi,{' '}
            <Box component="em" sx={{ fontStyle: 'italic', color: '#7C3AED' }}>
              pas
            </Box>{' '}
            aux heures de pointe.
          </Typography>

          <Typography
            variant="body1"
            sx={{
              maxWidth: '56ch',
              mb: 4,
              fontSize: '1.05rem',
              lineHeight: 1.6,
              color: '#94A3B8',
            }}
          >
            Sur avril–juillet 2026, l'indicateur le plus corrélé à la qualité de
            l'air n'est pas le trafic routier : c'est{' '}
            <strong style={{ color: '#F8FAFC' }}>l'ozone</strong>, un polluant
            qui se forme sous l'effet du soleil et culmine en milieu
            d'après-midi. Les villes méditerranéennes en paient le prix le plus
            fort.
          </Typography>

          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', mt: 3 }}>
            <StatBadge
              icon={MdCloudQueue}
              value={typeof o3Corr === 'number' ? o3Corr.toFixed(2) : o3Corr}
              label="corrélation O3 / AQI"
            />
            <StatBadge
              icon={MdLocationCity}
              value={topCity?.city ?? '—'}
              label="ville la plus exposée"
            />
            <StatBadge
              icon={MdWarningAmber}
              value={stats ? stats.pctAlert.toFixed(1) + '%' : '—'}
              label="du temps en alerte (Poor+)"
            />
            <StatBadge
              icon={MdAir}
              value={stats ? stats.coveragePct.toFixed(1) + '%' : '—'}
              label="couverture des données"
            />
          </Box>
        </AnimatedSection>
      </Box>
    </Box>
  );
}