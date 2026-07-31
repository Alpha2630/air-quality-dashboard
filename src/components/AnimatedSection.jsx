import { motion } from 'framer-motion';

export default function AnimatedSection({ children, delay = 0, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}