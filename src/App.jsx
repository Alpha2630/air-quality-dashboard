import { useEffect, useState, useCallback } from 'react';
import { Container, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { useAirQualityData } from './hooks/useAirQualityData';
import HeroSection from './components/HeroSection';
import DataSourcePanel from './components/DataSourcePanel';
import HourlyChartSection from './components/HourlyChartSection';
import CityRanking from './components/CityRanking';
import CorrelationSection from './components/CorrelationSection';
import SeverityGauge from './components/SeverityGauge';
import Navbar from './components/Navbar';
import ArcReactorRing from './components/ArcReactorRing';

export default function App() {
  const { stats, sourceLabel, loading, error, loadDemo, loadCSV } = useAirQualityData();
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    loadDemo();
  }, [loadDemo]);

  // Intersection Observer pour suivre la section active au scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    const sectionIds = ['hero', 'hourly', 'ranking', 'correlation', 'footer'];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [stats]);

  const scrollToSection = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', bgcolor: '#060B16' }}>
      {/* Navbar fixe */}
      <Navbar activeSection={activeSection} onNavigate={scrollToSection} />

      {/* Contenu principal, décalé pour éviter la navbar */}
      <Box component="main" sx={{ pt: '64px' }}>
        {/* Anneaux décoratifs */}
        <Box
          sx={{
            position: 'fixed',
            top: '15%',
            left: '-80px',
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
            bottom: '10%',
            right: '-80px',
            opacity: 0.05,
            pointerEvents: 'none',
            zIndex: 0,
            display: { xs: 'none', lg: 'block' },
          }}
        >
          <ArcReactorRing size={340} />
        </Box>

        {/* Sections avec id pour la navigation */}
        <Box id="hero">
          <HeroSection stats={stats} />
        </Box>

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

          <Box id="hourly">
            <HourlyChartSection stats={stats} />
          </Box>
          <Box id="ranking">
            <CityRanking stats={stats} />
          </Box>
          <Box id="correlation">
            <CorrelationSection stats={stats} />
          </Box>

          {stats && (
            <Box id="footer">
              <SeverityGauge
                pctAlert={stats.pctAlert}
                nRows={stats.nRows}
                cities={stats.cities}
                minDate={stats.minDate}
                maxDate={stats.maxDate}
                coveragePct={stats.coveragePct}
              />
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
}