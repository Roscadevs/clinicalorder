import { useRef, type ReactNode } from 'react';
import './SpotlightCard.css';

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  /** Color del foco que sigue al cursor. Por defecto: primary con alpha. */
  spotlightColor?: string;
}

/**
 * Tarjeta con efecto de foco (spotlight) que sigue el cursor.
 * Componente de ReactBits adaptado a TS y a la paleta de marca.
 */
const SpotlightCard = ({
  children,
  className = '',
  spotlightColor = 'rgba(147, 101, 79, 0.15)',
}: SpotlightCardProps) => {
  const divRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = divRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--mouse-x', `${x}px`);
    el.style.setProperty('--mouse-y', `${y}px`);
    el.style.setProperty('--spotlight-color', spotlightColor);
  };

  return (
    <div ref={divRef} onMouseMove={handleMouseMove} className={`card-spotlight ${className}`}>
      {children}
    </div>
  );
};

export default SpotlightCard;
