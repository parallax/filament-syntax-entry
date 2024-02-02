# Filament Comments

[![Latest Version on Packagist](https://img.shields.io/packagist/v/parallax/filament-syntax-entry?style=flat-square)](https://packagist.org/packages/parallax/filament-syntax-entry)
[![Software License](https://img.shields.io/packagist/l/parallax/filament-syntax-entry?style=flat-square)](LICENSE.md)
[![Total Downloads](https://img.shields.io/packagist/dt/parallax/filament-syntax-entry?style=flat-square)](https://packagist.org/packages/parallax/filament-syntax-entry)
![Stars](https://img.shields.io/github/stars/parallax/filament-syntax-entry?style=flat-square)

Add a Filament infolist entry for themeable syntax highlighting using [highlight.js](https://highlightjs.org).

<img class="filament-hidden" src="https://github.com/parallax/filament-syntax-entry/raw/main/assets/filament-syntax-entry.jpg"/>

## Installation

Install the package via composer:

```bash
composer require parallax/filament-syntax-entry
```

Optionally, you can publish the views using

```bash
php artisan vendor:publish --tag="filament-syntax-entry-views"
```

## Quickstart

### Add the Infolist entry

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

Automatic language detection is enabled by default so this isn't required, but if you would like to define the language used you may use the `language()` method:

```php
SyntaxEntry::make('metadata')
    ->language('json');
```

To keep the budle size down only the following languages are currently available:

- `bash`
- `css`
- `dockerfile`
- `graphql`
- `javascript`
- `json`
- `markdown`
- `php`
- `scss`
- `shell`
- `sql`
- `typescript`
- `xml`
- `yaml`

### Setting the theme

You may override the default themes using the `theme()` and/or `darkModeTheme()` methods:

```php
SyntaxEntry::make('metadata')
    ->theme('filament')
    ->darkModeTheme('filament-dark');
```

To keep the budle size down only the following languages are currently available:

- `a11y-dark`
- `a11y-light`
- `agate`
- `an-old-hope`
- `androidstudio`
- `arduino-light`
- `arta`
- `ascetic`
- `atom-one-dark-reasonable`
- `atom-one-dark`
- `atom-one-light`
- `brown-paper`
- `codepen-embed`
- `color-brewer`
- `dark`
- `default`
- `devibeans`
- `docco`
- `far`
- `felipec`
- `filament-dark` (default dark mode theme)
- `filament` (default theme)
- `foundation`
- `github-dark-dimmed`
- `github-dark`
- `github`
- `gml`
- `googlecode`
- `gradient-dark`
- `gradient-light`
- `grayscale`
- `hybrid`
- `idea`
- `intellij-light`
- `ir-black`
- `isbl-editor-dark`
- `isbl-editor-light`
- `kimbie-dark`
- `kimbie-light`
- `lightfair`
- `lioshi`
- `magula`
- `mono-blue`
- `monokai-sublime`
- `monokai`
- `night-owl`
- `nnfx-dark`
- `nnfx-light`
- `nord`
- `obsidian`
- `panda-syntax-dark`
- `panda-syntax-light`
- `paraiso-dark`
- `paraiso-light`
- `pojoaque`
- `purebasic`
- `qtcreator-dark`
- `qtcreator-light`
- `rainbow`
- `routeros`
- `school-book`
- `shades-of-purple`
- `srcery`
- `stackoverflow-dark`
- `stackoverflow-light`
- `sunburst`
- `tokyo-night-dark`
- `tokyo-night-light`
- `tomorrow-night-blue`
- `tomorrow-night-bright`
- `vs`
- `vs2015`
- `xcode`
- `xt256`

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information on what has changed recently.

## Credits

- [Parallax](https://parall.ax)
- [Contributors](https://github.com/parallax/filament-syntax-entry/graphs/contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
