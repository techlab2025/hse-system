export default class TranslationsParams {
    // Store translations in a nested structure: { field: { locale: value } }
    private translations: Record<string, Record<string, string>> = {
        title: {},
        description: {}
    };

    constructor(locales: string[] = ['en', 'ar', 'fr']) {
        // Initialize empty translations for all locales
        for (const field of ['title', 'description']) {
            for (const locale of locales) {
                this.translations[field][locale] = "";
            }
        }
    }

    // Set translation for a specific field and locale
    setTranslation(field: string, locale: string, value: string): void {
        if (!this.translations[field]) {
            this.translations[field] = {};
        }
        this.translations[field][locale] = value;
    }

    // Get translation for a specific field and locale
    getTranslation(field: string, locale: string): string {
        return this.translations[field]?.[locale] || "";
    }

    // Convert to API-ready format with dynamic keys
    toMap(): Record<string, any> {
        const result: Record<string, any> = {};

        for (const [field, localeValues] of Object.entries(this.translations)) {
            for (const [locale, value] of Object.entries(localeValues)) {
                if (value) { // Only include non-empty values
                    result[`${field}_${locale}`] = value;
                }
            }
        }

        return result;
    }

    // Static method to create from an array of translations
    static fromArray(
        titles: { locale: string, value: string }[],
        descriptions: { locale: string, value: string }[] = []
    ): TranslationsParams {
        const params = new TranslationsParams();

        titles.forEach(({ locale, value }) => {
            params.setTranslation('title', locale, value);
        });

        descriptions.forEach(({ locale, value }) => {
            params.setTranslation('description', locale, value);
        });

        return params;
    }
}