module.exports = {
  purge: {
    content: ['./src/**/*.{js,jsx,ts,tsx,html}'],
    safelist: [/data-theme$/, /^btn-.*/, /^text-.*/],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      xs: '412px',
    },
    extend: {
      screens: {
        landscape: { raw: '(orientation: landscape)' },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
    require('@rvxlab/tailwind-plugin-ios-full-height'),
  ],
  daisyui: {
    themes: [
      {
        agentmate: {
          primary: '#193777',
          'primary-focus': '#3A61B5',
          'primary-content': '#ffffff',

          secondary: '#8CBAE5',
          'secondary-focus': '#CADFF3',
          'secondary-content': '#ffffff',

          accent: '#9467DE',
          'accent-focus': '#C9B2EE',
          'accent-content': '#ffffff',

          neutral: '#3d4451',
          'neutral-focus': '#2a2e37',
          'neutral-content': '#ffffff',

          'base-100': '#ffffff',
          'base-200': '#f9fafb',
          'base-300': '#d1d5db',
          'base-content': '#1f2937',

          info: '#2094f3',
          success: '#199759',
          warning: '#ff9900',
          error: '#f22510',
        },
      },
      'light',
    ],
  },
}
