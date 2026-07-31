import { useRef } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { MdUpload, MdAutoAwesome } from 'react-icons/md';

export default function DataSourcePanel({ onLoadDemo, onLoadCSV, sourceLabel, loading, error }) {
  const fileInputRef = useRef(null);

  return (
    <Box
      sx={{
        backgroundColor: '#000000',
        border: '1px solid rgba(255, 255, 255, 0.7)',
        borderRadius: '16px',
        p: { xs: 2.5, md: 3.5 },
        mb: 4,
        boxShadow: '0 0 30px rgba(255, 255, 255, 0.04)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 3,
          flexWrap: 'wrap',
        }}
      >
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5, color: '#F8FAFC' }}>
            Charger les données
          </Typography>
          <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: 13 }}>
            Dépose ton fichier clean/air_quality_clean.csv, ou lance une démo avec des données
            simulées.
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontFamily: '"IBM Plex Mono", monospace',
              mt: 1,
              display: 'block',
              color: error ? '#FF5C4A' : '#00C8A0',
            }}
          >
            {loading ? 'Chargement…' : error ? error : sourceLabel || 'Aucune donnée chargée.'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          {loading && <CircularProgress size={22} sx={{ color: '#F8FAFC' }} />}
          <Button
            variant="outlined"
            startIcon={<MdAutoAwesome />}
            onClick={onLoadDemo}
            disabled={loading}
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: '#F8FAFC',
              '&:hover': { borderColor: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.05)' },
            }}
          >
            Démo
          </Button>
          <Button
            variant="contained"
            startIcon={<MdUpload />}
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            sx={{
              backgroundColor: '#FFFFFF',
              color: '#000000',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.85)' },
            }}
          >
            Charger CSV
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) onLoadCSV(file);
              e.target.value = '';
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}