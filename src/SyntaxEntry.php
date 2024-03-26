<?php

namespace Parallax\FilamentSyntaxEntry;

use Closure;
use Filament\Infolists\Components\Concerns;
use Filament\Infolists\Components\Contracts\HasAffixActions;
use Filament\Infolists\Components\Entry;
use Illuminate\Support\HtmlString;
use Illuminate\Support\Str;
use Tempest\Highlight\Highlighter;

class SyntaxEntry extends Entry implements HasAffixActions
{
    use Concerns\CanFormatState;
    use Concerns\HasAffixes;

    protected string $view = 'filament-syntax-entry::syntax-entry';

    protected string | Closure | null $language = 'json';

    protected string | Closure | null $theme = 'filament';

    public function getValue(): HtmlString
    {
        $state = $this->getState();
        $language = $this->language;
        $toParse = !is_string($state) || $language === 'json' ? json_encode($state, JSON_PRETTY_PRINT) : $state;
        $parsed = (new Highlighter())->parse($toParse, $language);

        return Str::of($parsed)->toHtmlString();
    }

    public function language(string | Closure $language): static
    {
        $this->language = $language;

        return $this;
    }

    public function getLanguage(): string
    {
        return $this->evaluate($this->language);
    }

    public function theme(string | Closure $theme): static
    {
        $this->theme = $theme;

        return $this;
    }

    public function getTheme(): string
    {
        return $this->evaluate($this->theme);
    }

    public function darkModeTheme(string | Closure $darkModeTheme): static
    {
        $this->darkModeTheme = $darkModeTheme;

        return $this;
    }

    public function getDarkModeTheme(): string | null
    {
        return $this->evaluate($this->darkModeTheme);
    }
}
