module.exports = {
  content: ['./src/**/*.{astro,html,js,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'on-surface': '#1b1c1c',
        'on-primary': '#ffffff',
        'secondary-container': '#81f1f8',
        'surface-container-low': '#f5f3f3',
        'outline-variant': '#c1c8c7',
        'surface-container': '#efeded',
        'surface': '#fbf9f8',
        'primary': '#000d0d',
        'secondary': '#00696e',
        'primary-container': '#002626',
        'surface-variant': '#e4e2e2',
        'surface-dim': '#dbdad9',
        'surface-container-high': '#e9e8e7',
        'background': '#fbf9f8',
        'surface-container-lowest': '#ffffff',
        'inverse-surface': '#303030',
        'on-surface-variant': '#414848',
        'primary-fixed': '#c5eae9',
        'surface-container-highest': '#e4e2e2',
      },
      borderRadius: {
        DEFAULT: '0.25rem', lg: '0.5rem', xl: '0.75rem', full: '9999px',
      },
      fontFamily: { sans: ['Inter'] },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
