import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

/** PrimeVue 4 theme derived from the canonical HSE Projects Studio reference. */
const HseCloudPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#f1f5fa',
      100: '#e3eaf4',
      200: '#c7d5e7',
      300: '#a2b8d2',
      400: '#6684ad',
      500: '#102b52',
      600: '#0d2547',
      700: '#0b203e',
      800: '#091b35',
      900: '#07172d',
      950: '#051123',
    },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '#fbfdff',
          100: '#f5f8fc',
          200: '#edf2f7',
          300: '#dfe7f1',
          400: '#b7c6d8',
          500: '#8a99ad',
          600: '#6b7b91',
          700: '#506178',
          800: '#183d68',
          900: '#10233f',
          950: '#0e2a4d',
        },
      },
      dark: {
        surface: {
          0: '#ffffff',
          50: '#f5f8fc',
          100: '#dfe7f1',
          200: '#b7c9dc',
          300: '#8faccc',
          400: '#7592b2',
          500: '#36516c',
          600: '#294662',
          700: '#183d68',
          800: '#102f58',
          900: '#0e2a4d',
          950: '#091d36',
        },
      },
    },
    formField: {
      paddingX: '0.75rem',
      paddingY: '0.625rem',
      borderRadius: '11px',
      focusRing: {
        width: '3px',
        style: 'solid',
        color: 'rgba(16, 43, 82, 0.12)',
        offset: '0',
      },
    },
  },
  components: {
    button: {
      root: { borderRadius: '0.75rem', gap: '0.5rem', paddingX: '0.9375rem' },
    },
    card: { root: { borderRadius: '1.125rem' } },
    dialog: { root: { borderRadius: '1.125rem' } },
    datatable: {
      headerCell: { background: '#f8fbff', color: '#506178' },
      row: { background: '#ffffff', color: '#10233f', hoverBackground: '#f8fbff' },
    },
  },
})

export default HseCloudPreset
