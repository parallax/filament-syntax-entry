<x-dynamic-component class="filament-syntax-entry-component" :component="$getEntryWrapperView()" :entry="$entry" wire:ignore>
    <div 
        class="filament-syntax-entry"
        x-load-css="[@js(\Filament\Support\Facades\FilamentAsset::getStyleHref(
            id: 'filament-syntax-entry-styles',
            package: 'parallax/filament-syntax-entry'
        ))]"
    >
        <div>
            {{-- <pre><code>{{ $$getState() }}</code></pre> --}}
            {{ $getState() }}
        </div>
    </div>
</x-dynamic-component>
