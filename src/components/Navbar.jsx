import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  MdDashboard,
  MdTimeline,
  MdBarChart,
  MdInsights,
  MdInfo,
  MdMenu,
  MdClose,
} from 'react-icons/md';


const NAV_ITEMS = [
  { id: 'hero', label: 'Accueil', icon: <MdDashboard size={20} /> },
  { id: 'hourly', label: 'Heure par heure', icon: <MdTimeline size={20} /> },
  { id: 'ranking', label: 'Classement', icon: <MdBarChart size={20} /> },
  { id: 'correlation', label: 'Analyse', icon: <MdInsights size={20} /> },
  { id: 'footer', label: 'À propos', icon: <MdInfo size={20} /> },
];

export default function Navbar({ activeSection, onNavigate }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleNavClick = (id) => {
    onNavigate(id);
    if (isMobile) setMobileOpen(false);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: 'rgba(10, 14, 23, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          zIndex: 1300,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 4 } }}>
          {/* Logo */}
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
            onClick={() => handleNavClick('hero')}
          >
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4A7BD4, #7C3AED)',
                boxShadow: '0 0 12px #4A7BD4',
              }}
            />
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Box sx={{ color: '#F8FAFC', fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.2 }}>
                Air Quality
              </Box>
              <Box sx={{ color: '#94A3B8', fontSize: '0.65rem', letterSpacing: '0.05em' }}>
                DASHBOARD
              </Box>
            </Box>
          </Box>

          {/* Liens desktop */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <Box
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      px: 1.5,
                      py: 0.75,
                      borderRadius: '8px',
                      color: isActive ? '#F8FAFC' : '#94A3B8',
                      bgcolor: isActive ? 'rgba(74, 123, 212, 0.2)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.05)',
                        color: '#F8FAFC',
                      },
                      borderBottom: isActive ? '2px solid #4A7BD4' : '2px solid transparent',
                    }}
                  >
                    {item.icon}
                    <Box sx={{ fontSize: '0.8rem', fontWeight: isActive ? 600 : 400 }}>
                      {item.label}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}

          {/* Bouton hamburger mobile */}
          {isMobile && (
            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{ color: '#F8FAFC' }}
            >
              <MdMenu size={24} />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer mobile */}
      {isMobile && (
        <Drawer
          anchor="right"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          PaperProps={{
            sx: {
              width: 250,
              bgcolor: '#0A0E17',
              borderLeft: '1px solid rgba(255,255,255,0.08)',
              pt: 2,
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, mb: 2 }}>
            <IconButton onClick={() => setMobileOpen(false)} sx={{ color: '#94A3B8' }}>
              <MdClose size={20} />
            </IconButton>
          </Box>
          <List>
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <ListItem key={item.id} disablePadding>
                  <ListItemButton
                    onClick={() => handleNavClick(item.id)}
                    sx={{
                      mx: 1,
                      borderRadius: '8px',
                      mb: 0.5,
                      color: isActive ? '#F8FAFC' : '#94A3B8',
                      bgcolor: isActive ? 'rgba(74, 123, 212, 0.2)' : 'transparent',
                    }}
                  >
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Drawer>
      )}
    </>
  );
}