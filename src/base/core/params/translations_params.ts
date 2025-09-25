// import { log } from "console"

export default class TranslationsParams {
  // Store translations in a nested structure: { field: { locale: value } }
  private translations: Record<string, Record<string, string>> = {
    title: {},
    description: {},
  }

  constructor(locales: string[] = ['en', 'ar', 'fr']) {
    // Initialize empty translations for all locales
    for (const field of ['title', 'description']) {
      for (const locale of locales) {
        this.translations[field][locale] = ''
      }
    }
  }

  // Set translation for a specific field and locale
  setTranslation(field: string, locale: string, value: string): void {
    if (!this.translations[field]) {
      this.translations[field] = {}
    }
    this.translations[field][locale] = value
  }

  // Get translation for a specific field and locale
  getTranslation(field: string, locale: string): string {
    return this.translations[field]?.[locale] || ''
  }

  // Convert to API-ready format with dynamic keys
  toMap(): Record<string, any> {
    const result: Record<string, any> = {}

    for (const [field, localeValues] of Object.entries(this.translations)) {
      for (const [locale, value] of Object.entries(localeValues)) {
        if (value) {
          // Only include non-empty values
          result[`${field}_${locale}`] = value
        }
      }
    }

    return result
  }

  // Static method to create from an array of translations
  static fromMap(
    titles: TitleLocale[],
    descriptions: DescriptionLocale[] = [],
    langLocale: LangLocale<string>[] = []
  ): {
    titles: TitleLocale[]
    descriptions: DescriptionLocale[]
    langLocale: LangLocale<string>[]
  } {
    const params = new TranslationsParams()

    titles.forEach(({ locale, title }) => {
      params.setTranslation('title', locale, title)
    })

    descriptions.forEach(({ locale, title }) => {
      params.setTranslation('description', locale, title)
    })

    langLocale.forEach(({ locale, value }) => {
      params.setTranslation('lang', locale, value)
    })

    // console.log(this.translations, 'params');  

    return { titles, descriptions, langLocale }
  }
}

export interface TitleLocale {
  locale: string
  title: string
}

export interface DescriptionLocale {
  locale: string
  description: string
}

export interface LangLocale<T> {
  locale: string
  value: T
}


