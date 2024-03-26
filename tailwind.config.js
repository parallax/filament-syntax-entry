const preset = require('./vendor/filament/filament/tailwind.config.preset')

module.exports = {
    presets: [preset],
    content: [
        './resources/views/**/*.blade.php',
        './vendor/filament/**/*.blade.php',
        './resources/css/**/*.css',
    ],
    safelist: [
        /syntax-entry-.+/,
        /hl-.+/
    ]
}
