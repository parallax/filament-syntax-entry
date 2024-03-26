<x-dynamic-component class="syntax-entry-component" :component="$getEntryWrapperView()" :entry="$entry" wire:ignore>
    <div 
        class="overflow-x-scroll syntax-entry-theme-{{ $getTheme() }}"
        x-load-css="[@js(\Filament\Support\Facades\FilamentAsset::getStyleHref(
            id: 'filament-syntax-entry-styles',
            package: 'parallax/filament-syntax-entry'
        ))]"
    >
        <pre>{{ $getValue() }}</pre>
    </div>
</x-dynamic-component>
