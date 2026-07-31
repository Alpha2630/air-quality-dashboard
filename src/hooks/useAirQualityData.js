import { useState, useMemo, useCallback } from 'react';
import Papa from 'papaparse';
import { generateDemoData } from '../data/demoData';
import { computeStats } from '../utils/stats';

export function useAirQualityData() {
  const [rows, setRows] = useState([]);
  const [sourceLabel, setSourceLabel] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const stats = useMemo(() => {
    if (!rows.length) return null;
    try {
      return computeStats(rows);
    } catch (e) {
      // eslint-disable-next-line react-hooks/set-state-in-render
      setError(e.message);
      return null;
    }
  }, [rows]);

  const loadDemo = useCallback(() => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      try {
        const data = generateDemoData();
        setRows(data);
        setSourceLabel('Données de démonstration (simulées)');
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    }, 80);
  }, []);

  const loadCSV = useCallback((file) => {
    setLoading(true);
    setError(null);
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const valid = results.data.filter(
          (r) => r.city && r.datetime_utc && r.aqi != null
        );
        if (valid.length === 0) {
          setError(
            'Aucune ligne valide — vérifie les colonnes city, datetime_utc, aqi.'
          );
        } else {
          setRows(valid);
          setSourceLabel(file.name);
        }
        setLoading(false);
      },
      error: (err) => {
        setError('Erreur de lecture CSV : ' + err.message);
        setLoading(false);
      },
    });
  }, []);

  return { rows, stats, sourceLabel, loading, error, loadDemo, loadCSV };
}