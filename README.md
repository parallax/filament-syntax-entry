# Filament Syntax Entry

[![Latest Version on Packagist](https://img.shields.io/packagist/v/parallax/filament-syntax-entry?style=flat-square)](https://packagist.org/packages/parallax/filament-syntax-entry)  
[![Software License](https://img.shields.io/packagist/l/parallax/filament-syntax-entry?style=flat-square)](LICENSE.md)  
[![Total Downloads](https://img.shields.io/packagist/dt/parallax/filament-syntax-entry?style=flat-square)](https://packagist.org/packages/parallax/filament-syntax-entry)  
![Stars](https://img.shields.io/github/stars/parallax/filament-syntax-entry?style=flat-square)

Add a Filament [infolist entry](https://filamentphp.com/docs/3.x/infolists/entries/getting-started) for themeable server-side syntax highlighting using [tempestphp/highlight](https://github.com/tempestphp/highlight).

![](https://github.com/parallax/filament-syntax-entry/raw/main/assets/filament-syntax-entry.jpg)

## Installation

1. Install the package via composer:

```
composer require parallax/filament-syntax-entry
```

2. Add the plugin's views to your `tailwind.config.js` file.

```js
content: [
    ...
    '<path-to-vendor>/parallax/filament-syntax-entry/resources/**/*.blade.php',
]
```

Optionally, you can publish the views using

```
php artisan vendor:publish --tag="filament-syntax-entry-views"
```

## Upgrading from 1.x

There are a couple of important changes to be aware of when upgrading to version 2.x:

- PHP 8.3 is required for server-side syntax highlighting
- Highlight.js is no longer supported
- Theme selection has been replaced with the ability to create custom themes

## Quickstart

### Add the [Infolist entry](https://filamentphp.com/docs/3.x/infolists/entries/getting-started)

Add the `SyntaxEntry` to the `$infolist->schema()` method.

```php
<?php

namespace App\Filament\Resources;

use Parallax\FilamentSyntaxEntry\SyntaxEntry;

class ProductResource extends Resource
{
    public static function infolist(Infolist $infolist): Infolist
    {
        return $infolist
            ->schema([
                SyntaxEntry::make('metadata'),
            ]);
    }
}
```

### Setting the language

The default language value is set to `json`. To override this value you may use the `language()` method:

```php
SyntaxEntry::make('metadata')
    ->language('json');
```

The following languages are currently available:

- `blade`
- `css`
- `gdscript`
- `html`
- `javascript`
- `json`
- `php`
- `sql`
- `twig`
- `xml`
- `yaml`

### Creating a custom theme

You may override the default theme by using the `theme()` method:

```php
SyntaxEntry::make('metadata')
    ->theme('smudge');
```

This will wrap the syntax component with a custom class like so:

```
syntax-entry-theme-smudge
```

The final step is to follow the [tempestphp/highlight](https://github.com/tempestphp/highlight) documentation on how to create your own theme, and use this in combination with [Filament themes](https://filamentphp.com/docs/3.x/panels/themes#creating-a-custom-theme).

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information on what has changed recently.

## Credits

- [Parallax](https://parall.ax)
- [Contributors](https://github.com/parallax/filament-syntax-entry/graphs/contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
