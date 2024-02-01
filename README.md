# Add a Filament infolist entry for syntax highlighting.

[![Latest Version on Packagist](https://img.shields.io/packagist/v/parallax/filament-syntax-entry.svg?style=flat-square)](https://packagist.org/packages/parallax/filament-syntax-entry)
[![GitHub Tests Action Status](https://img.shields.io/github/actions/workflow/status/parallax/filament-syntax-entry/run-tests.yml?branch=main&label=tests&style=flat-square)](https://github.com/parallax/filament-syntax-entry/actions?query=workflow%3Arun-tests+branch%3Amain)
[![GitHub Code Style Action Status](https://img.shields.io/github/actions/workflow/status/parallax/filament-syntax-entry/fix-php-code-style-issues.yml?branch=main&label=code%20style&style=flat-square)](https://github.com/parallax/filament-syntax-entry/actions?query=workflow%3A"Fix+PHP+code+style+issues"+branch%3Amain)
[![Total Downloads](https://img.shields.io/packagist/dt/parallax/filament-syntax-entry.svg?style=flat-square)](https://packagist.org/packages/parallax/filament-syntax-entry)



This is where your description should go. Limit it to a paragraph or two. Consider adding a small example.

## Installation

You can install the package via composer:

```bash
composer require parallax/filament-syntax-entry
```

You can publish and run the migrations with:

```bash
php artisan vendor:publish --tag="filament-syntax-entry-migrations"
php artisan migrate
```

You can publish the config file with:

```bash
php artisan vendor:publish --tag="filament-syntax-entry-config"
```

Optionally, you can publish the views using

```bash
php artisan vendor:publish --tag="filament-syntax-entry-views"
```

This is the contents of the published config file:

```php
return [
];
```

## Usage

```php
$filamentSyntaxEntry = new Parallax\FilamentSyntaxEntry();
echo $filamentSyntaxEntry->echoPhrase('Hello, Parallax!');
```

## Testing

```bash
composer test
```

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information on what has changed recently.

## Contributing

Please see [CONTRIBUTING](.github/CONTRIBUTING.md) for details.

## Security Vulnerabilities

Please review [our security policy](../../security/policy) on how to report security vulnerabilities.

## Credits

- [Parallax](https://github.com/parallax)
- [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
