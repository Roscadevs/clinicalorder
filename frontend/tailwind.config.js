/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Escaneo de clases de Tailwind en componentes React
  ],
  theme: {
    extend: {
      colors: {
        /* ================================================================
         * PALETA DE MARCA
         * Tonos cálidos (café / beige) mapeados a roles semánticos.
         * Todos los tokens leen de CSS variables (definidas en index.css)
         * para permitir theming en un solo lugar.
         * ================================================================ */

        // Color principal de marca (toffee-brown). Botones, links, acentos.
        primary: {
          50: 'hsl(28, 23%, 95%)',
          100: 'hsl(28, 23%, 89%)', // ~ dust-grey
          200: 'hsl(26, 33%, 82%)',
          300: 'hsl(26, 33%, 68%)', // ~ tan
          400: 'hsl(30, 22%, 62%)', // ~ khaki-beige
          500: 'hsl(19, 30%, 44%)', // ~ toffee-brown (base)
          600: 'hsl(19, 28%, 39%)',
          700: 'hsl(19, 26%, 34%)', // ~ coffee-bean
          800: 'hsl(19, 26%, 27%)',
          900: 'hsl(19, 27%, 20%)',
          DEFAULT: 'hsl(19, 30%, 44%)',
        },

        // Colores literales de la paleta, por si se necesitan nominalmente.
        tan: '#C9AB94',
        'khaki-beige': '#B39D87',
        'toffee-brown': '#93654F',
        'dust-grey': '#E9E2DC',
        'coffee-bean': '#6C4E40',

        // Neutros cálidos (reemplazan a slate). Fondos, bordes, texto.
        sand: {
          50: '#FBF9F7',
          100: '#F4EFEA',
          200: '#E9E2DC', // dust-grey
          300: '#D8CCC1',
          400: '#B39D87', // khaki-beige
          500: '#9A8571',
          600: '#7C6A59',
          700: '#5F5145',
          800: '#443A31',
          900: '#2C251F',
        },

        // ---- Colores semánticos de ESTADO (armonizados con la paleta cálida) ----
        // Verde apagado / oliva para "confirmado / éxito".
        success: {
          50: '#F1F4EC',
          100: '#DFE7D2',
          500: '#6B7F4F',
          600: '#5A6B42',
          700: '#495636',
          DEFAULT: '#5A6B42',
        },
        // Ámbar terroso para "pendiente / retención / aviso".
        warning: {
          50: '#FBF3E6',
          100: '#F5E2C4',
          500: '#C08A3E',
          600: '#A5722E',
          700: '#845A24',
          DEFAULT: '#C08A3E',
        },
        // Terracota / rojo apagado para "cancelado / error".
        danger: {
          50: '#F9ECEA',
          100: '#F1D4CF',
          500: '#B15442',
          600: '#984435',
          700: '#7A362A',
          DEFAULT: '#B15442',
        },
        // Azul apagado para "atendido / informativo".
        info: {
          50: '#EAF0F2',
          100: '#CEDDE2',
          500: '#5B7C8A',
          600: '#496673',
          700: '#3A525C',
          DEFAULT: '#5B7C8A',
        },
      },

      fontFamily: {
        // Cuerpo / lectura general (fuente OpenType de marca) con fallback sans.
        sans: ['"Brand Sans"', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        // Títulos / display (fuente TrueType elegante) con fallback serif.
        display: ['"Brand Display"', 'ui-serif', 'Georgia', 'Cambria', '"Times New Roman"', 'serif'],
      },

      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },

      boxShadow: {
        soft: '0 1px 2px 0 rgba(68, 58, 49, 0.04), 0 2px 8px -2px rgba(68, 58, 49, 0.08)',
        card: '0 2px 4px -1px rgba(68, 58, 49, 0.06), 0 6px 16px -4px rgba(68, 58, 49, 0.10)',
        lift: '0 8px 24px -6px rgba(68, 58, 49, 0.18)',
      },
    },
  },
  plugins: [],
}
