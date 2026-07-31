import { useEffect } from 'react';
import { Container, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { useAirQualityData } from './hooks/useAirQualityData';
import HeroSection from './components/HeroSection';
import DataSourcePanel from './components/DataSourcePanel';
import HourlyChartSection from './components/HourlyChartSection';
import CityRanking from './components/CityRanking';
import CorrelationSection from './components/CorrelationSection';
import SeverityGauge from './components/SeverityGauge';
import ArcReactorRing from './components/ArcReactorRing';

export default function App() {
  const { stats, sourceLabel, loading, error, loadDemo, loadCSV } = useAirQualityData();

  useEffect(() => {
    loadDemo();
  }, [loadDemo]);

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      {/* Anneaux décoratifs globaux */}
      <Box
        sx={{
          position: 'fixed',
          top: '10%',
          left: '-100px',
          opacity: 0.06,
          pointerEvents: 'none',
          zIndex: 0,
          display: { xs: 'none', lg: 'block' },
        }}
      >
        <ArcReactorRing size={280} />
      </Box>
      <Box
        sx={{
          position: 'fixed',
          bottom: '15%',
          right: '-80px',
          opacity: 0.05,
          pointerEvents: 'none',
          zIndex: 0,
          display: { xs: 'none', lg: 'block' },
        }}
      >
        <ArcReactorRing size={340} />
      </Box>

      {/* Hero section en pleine largeur, collé au fond spatial */}
      <HeroSection stats={stats} />

      {/* Contenu principal centré */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Box sx={{ mt: 5, mb: 2 }}>
            <DataSourcePanel
              onLoadDemo={loadDemo}
              onLoadCSV={loadCSV}
              sourceLabel={sourceLabel}
              loading={loading}
              error={error}
            />
          </Box>
        </motion.div>

        <HourlyChartSection stats={stats} />
        <CityRanking stats={stats} />
        <CorrelationSection stats={stats} />

        {stats && (
          <SeverityGauge
            pctAlert={stats.pctAlert}
            nRows={stats.nRows}
            cities={stats.cities}
            minDate={stats.minDate}
            maxDate={stats.maxDate}
            coveragePct={stats.coveragePct}
          />
        )}
      </Container>
    </Box>
  );
}