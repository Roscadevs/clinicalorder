import React from 'react';
import { cn } from '../../utils/cn';
// Importamos el SVG como texto crudo para inyectarlo inline y que herede
// `currentColor` (un <img src> no permite heredar el color del contexto).
import isotipo from '../../assets/logo/isotipo.svg?raw';
import isotipoTexto from '../../assets/logo/isotipo_texto.svg?raw';

interface LogoProps {
  /** 'mark' = solo isotipo (símbolo). 'full' = isotipo + texto. */
  variant?: 'mark' | 'full';
  className?: string;
  /** Etiqueta accesible del logo. */
  title?: string;
}

/**
 * Logo de la marca renderizado inline para heredar `currentColor`.
 * Controlá el color con una clase de texto (ej. `text-white`, `text-sand-900`)
 * y el tamaño con width/height en className.
 */
export const Logo: React.FC<LogoProps> = ({
  variant = 'mark',
  className,
  title = 'Clínica Dra. Valeria Gómez',
}) => (
  <span
    role="img"
    aria-label={title}
    className={cn('inline-flex items-center justify-center [&>svg]:w-full [&>svg]:h-full', className)}
    dangerouslySetInnerHTML={{ __html: variant === 'full' ? isotipoTexto : isotipo }}
  />
);
