module.exports = {
  purge: {
    enabled: true,
    content: ['./dist/index.html', './dist/js/*.js']
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: [
    "responsive",
    "group-hover",
    "focus-within",
    "first",
    "last",
    "odd",
    "even",
    "hover",
    "focus",
    "active",
    "visited",
    "disabled"
  ],
  plugins: [],
};