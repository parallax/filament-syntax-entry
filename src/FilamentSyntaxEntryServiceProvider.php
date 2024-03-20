<?php

namespace Parallax\FilamentSyntaxEntry;

use Filament\Support\Assets\Asset;
use Filament\Support\Assets\Css;
use Filament\Support\Assets\Js;
use Filament\Support\Facades\FilamentAsset;
use Spatie\LaravelPackageTools\Commands\InstallCommand;
use Spatie\LaravelPackageTools\Package;
use Spatie\LaravelPackageTools\PackageServiceProvider;

class FilamentSyntaxEntryServiceProvider extends PackageServiceProvider
{
    public static string $name = 'filament-syntax-entry';

    public static string $viewNamespace = 'filament-syntax-entry';

    public function configurePackage(Package $package): void
    {
        $package->name(static::$name)
            ->hasInstallCommand(function (InstallCommand $command) {
                $command
                    ->askToStarRepoOnGitHub('parallax/filament-syntax-entry');
            });

        if (file_exists($package->basePath('/../resources/views'))) {
            $package->hasViews(static::$viewNamespace);
        }
    }

    public function packageBooted(): void
    {
        FilamentAsset::register(
            $this->getAssets(),
            $this->getAssetPackageName()
        );

        FilamentAsset::registerScriptData(
            $this->getScriptData(),
            $this->getAssetPackageName()
        );
    }

    protected function getAssetPackageName(): ?string
    {
        return 'parallax/filament-syntax-entry';
    }

    /**
     * @return array<Asset>
     */
    protected function getAssets(): array
    {
        return [
            Css::make('filament-syntax-entry-styles', __DIR__ . '/../resources/dist/filament-syntax-entry.css'),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    protected function getScriptData(): array
    {
        return [];
    }
}
