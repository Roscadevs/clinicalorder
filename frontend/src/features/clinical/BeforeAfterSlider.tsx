import React, { useState, useRef } from 'react'; // React hooks
import { Sliders } from 'lucide-react'; // Iconos

interface BeforeAfterSliderProps {
  beforeImage?: string;
  afterImage?: string;
  beforeLabel?: string;
  afterLabel?: string;
}

/**
 * Visor Comparativo Táctil Antes / Después con soporte nativo de gestos touch para celulares.
 */
export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage = 'https://images.unsplash.com/photo-1512290900672-1f486cf81f72?auto=format&fit=crop&w=800&q=80',
  afterImage = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
  beforeLabel = 'Antes (Día 1)',
  afterLabel = 'Después (Día 30)',
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(pos);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    updatePosition(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
        <div>
          <h3 className="font-bold text-slate-800 text-xs sm:text-sm flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-teal-600" />
            <span>Visor Comparativo Clínico "Antes y Después"</span>
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-500">
            Arrastra el divisor táctil con el dedo para contrastar la evolución estética de la piel.
          </p>
        </div>
        <span className="text-[11px] sm:text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
          {Math.round(sliderPosition)}%
        </span>
      </div>

      {/* Contenedor del Slider Táctil */}
      <div
        ref={containerRef}
        className="relative w-full aspect-[4/3] max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-md select-none cursor-ew-resize border border-slate-200 touch-none"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={(e) => updatePosition(e.touches[0].clientX)}
        onTouchMove={handleTouchMove}
      >
        {/* Imagen DESPUÉS (Fondo completo) */}
        <img
          src={afterImage}
          alt="Post-tratamiento"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
        <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 bg-teal-900/85 backdrop-blur-sm text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl shadow pointer-events-none">
          {afterLabel}
        </div>

        {/* Imagen ANTES (Recortada por el ancho del slider) */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={beforeImage}
            alt="Pre-tratamiento"
            className="absolute inset-0 w-full h-full object-cover max-w-none"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 bg-slate-900/85 backdrop-blur-sm text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl shadow">
            {beforeLabel}
          </div>
        </div>

        {/* Línea Divisoria Vertical con Tirador Táctil Ergonómico de 44px */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-ew-resize flex items-center justify-center pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="w-11 h-11 sm:w-9 sm:h-9 rounded-full bg-white text-slate-800 shadow-xl flex items-center justify-center border-2 border-teal-600 ring-4 ring-black/10 active:scale-110 transition-transform">
            <Sliders className="w-4 h-4 text-teal-600 rotate-90" />
          </div>
        </div>
      </div>
    </div>
  );
};
