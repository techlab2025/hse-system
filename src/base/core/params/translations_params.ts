export default class TranslationsParams {
  private translations: Record<string, Record<string, string>> = {
    title: {},
    description: {},
    subtitle: {},
    question: {},
    answer: {},
  }

  constructor(locales: string[] = ['en', 'ar', 'fr']) {
    for (const field of ['title', 'description', 'subtitle', 'question', 'answer']) {
      for (const locale of locales) {
        this.translations[field][locale] = ''
      }
    }
  }

  setTranslation(field: string, locale: string, value: string): void {
    if (!this.translations[field]) {
      this.translations[field] = {}
    }
    this.translations[field][locale] = value
  }

  getTranslation(field: string, locale: string): string {
    return this.translations[field]?.[locale] || ''
  }

  toMap(): Record<string, any> {
    const result: Record<string, any> = {}
    for (const [field, localeValues] of Object.entries(this.translations)) {
      for (const [locale, value] of Object.entries(localeValues)) {
        if (value) {
          result[`${field}_${locale}`] = value
        }
      }
    }
    return result
  }

  static fromMap(
    titles: TitleLocale[] = [],
    descriptions: DescriptionLocale[] = [],
    subtitles: SubtitlesLocale[] = [],
    questions: QuestionLocale[] = [],
    answers: AnswerLocale[] = [],
    langLocale: LangLocale<string>[] = []
  ): {
    titles: TitleLocale[]
    descriptions: DescriptionLocale[]
    subtitles: SubtitlesLocale[]
    questions: QuestionLocale[]
    answers: AnswerLocale[]
    langLocale: LangLocale<string>[]
  } {
    const params = new TranslationsParams()

    titles.forEach(({ locale, title }) => {
      params.setTranslation('title', locale, title)
    })

    descriptions.forEach(({ locale, title }) => {
      params.setTranslation('description', locale, title)
    })

    subtitles.forEach(({ locale, subtitle }) => {
      params.setTranslation('subtitle', locale, subtitle)
    })

    questions.forEach(({ locale, question }) => {
      params.setTranslation('question', locale, question)
    })

    answers.forEach(({ locale, answer }) => {
      params.setTranslation('answer', locale, answer)
    })

    langLocale.forEach(({ locale, value }) => {
      params.setTranslation('lang', locale, value)
    })

    return { titles, descriptions, subtitles, questions, answers, langLocale }
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

export interface SubtitlesLocale {
  locale: string
  subtitle: string
}

export interface QuestionLocale {
  locale: string
  question: string
}

export interface AnswerLocale {
  locale: string
  answer: string
}

export interface LangLocale<T> {
  locale: string
  value: T
}
