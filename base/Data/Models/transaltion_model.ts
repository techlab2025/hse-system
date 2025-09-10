export default class TranslationModel {
    id: number;
    locale: string;
    key: string;
    value: string;
    translations: Record<string, Record<string, string>>; // For storing multiple fields

    constructor(
        id: number = 0,
        locale: string = '',
        key: string = '',
        value: string = '',
        translations: Record<string, Record<string, string>> = {}
    ) {
        this.id = id;
        this.locale = locale;
        this.key = key;
        this.value = value;
        this.translations = translations;
    }

    static fromMap(map: { [key: string]: unknown }): TranslationModel {
        return new TranslationModel(
            map.id as number,
            map.locale as string,
            map.key as string,
            map.value as string,
            map.translations as Record<string, Record<string, string>> || {}
        );
    }

    // Add translations for a specific field (e.g., 'title', 'description')
    addTranslations(field: string, translations: { locale: string, value: string }[]) {
        if (!this.translations[field]) {
            this.translations[field] = {};
        }

        translations.forEach(translation => {
            this.translations[field][translation.locale] = translation.value;
        });
    }

    // Get translation for a specific field and locale
    getTranslation(field: string, locale: string): string | undefined {
        return this.translations[field]?.[locale];
    }

    // Get all translations for a specific field
    getAllTranslations(field: string): { locale: string, value: string }[] {
        if (!this.translations[field]) return [];

        return Object.entries(this.translations[field]).map(([locale, value]) => ({
            locale,
            value
        }));
    }

    // Static method to create with translations
    static createWithTranslations(
        id: number = 0,
        translations: Record<string, { locale: string, value: string }[]>
    ): TranslationModel {
        const model = new TranslationModel(id);

        Object.entries(translations).forEach(([field, transList]) => {
            model.addTranslations(field, transList);
        });

        return model;
    }
}