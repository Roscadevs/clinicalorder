import React from 'react';
import { motion } from 'motion/react';

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * Envoltorio que aplica un fundido (fade + leve desplazamiento) al montar
 * cada vista, suavizando el cambio entre rutas.
 */
export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
  >
    {children}
  </motion.div>
);
