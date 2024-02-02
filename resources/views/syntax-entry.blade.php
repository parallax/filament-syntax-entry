<x-dynamic-component class="filament-syntax-entry-component" :component="$getEntryWrapperView()" :entry="$entry" wire:ignore>
    <div 
        class="filament-syntax-entry"
        x-load-js="[@js(\Filament\Support\Facades\FilamentAsset::getScriptSrc(
            id: 'filament-syntax-entry-scripts',
            package: 'parallax/filament-syntax-entry'
        ))]"
        x-load-css="[@js(\Filament\Support\Facades\FilamentAsset::getStyleHref(
            id: 'filament-syntax-entry-styles',
            package: 'parallax/filament-syntax-entry'
        ))]"
    >
        <div
            x-data="{
                init() {
                    this.updateTheme();
                    const observer = new MutationObserver(() => this.updateTheme());
                    observer.observe(document.documentElement, {
                        attributes: true,
                        attributeFilter: ['class']
                    });
                    this.$watch('theme', () => this.updateTheme());
    
                    this.cleanup = () => observer.disconnect();
                },
                updateTheme() {
                    this.$el.className = document.documentElement.classList.contains('dark') 
                        ? 'syntax-entry-theme-{{ $getDarkModeTheme() ?? $getTheme() }}'
                        : 'syntax-entry-theme-{{ $getTheme() }}';
                },
                cleanup: () => {}
            }"
            x-init="init()"
            x-on:destroyed="cleanup"
        >
            <pre><code>{{ json_encode($getState(), JSON_PRETTY_PRINT) }}</code></pre>
        </div>
    </div>
</x-dynamic-component>
