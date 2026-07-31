import { Card } from '@mui/material';
import { motion } from 'framer-motion';

export default function GlowCard({ children, glowOnHover = true, ...props }) {
  return (
    <motion.div
      whileHover={
        glowOnHover
          ? {
              boxShadow: '0 0 28px rgba(0,144,255,0.22), 0 0 8px rgba(0,200,232,0.16)',
              borderColor: 'rgba(0,144,255,0.4)',
              y: -2,
            }
          : {}
      }
      transition={{ duration: 0.25 }}
      style={{ borderRadius: 16 }}
    >
      <Card
        {...props}
        sx={{
          backgroundColor: '#0D1525',
          border: '1px solid #192539',
          borderRadius: 4,
          p: 3,
          transition: 'border-color 0.25s ease',
          ...props.sx,
        }}
      >
        {children}
      </Card>
    </motion.div>
  );
}