import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

/** PrimeVue 4 theme derived from the canonical HSE Projects Studio reference. */
const HseCloudPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#eef5ff',
      100: '#dce9ff',
      200: '#bfd5ff',
      300: '#94b8ff',
      400: '#5a8dff',
      500: '#246bfe',
      600: '#1f65f6',
      700: '#174fca',
      800: '#183d68',
      900: '#0e2a4d',
      950: '#0b2341',
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
      borderRadius: '0.6875rem',
      focusRing: {
        width: '3px',
        style: 'solid',
        color: 'rgba(36, 107, 254, 0.10)',
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
