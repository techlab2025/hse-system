import TranslationsParams, {
  type DescriptionLocale,
  type TitleLocale,
  type SubtitlesLocale,
  type AnswerLocale,
  type QuestionLocale
} from '@/base/core/params/translations_params.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'

export default class FaqDetailsModel {
  public id: number

  public questions: QuestionLocale[]
  public answers: AnswerLocale[]


  constructor(
    id: number,

    questions: QuestionLocale[] = [],
    answers: AnswerLocale[] = [],

  ) {
    this.id = id

    this.questions = questions
    this.answers = answers

  }

static fromMap(data: any): FaqDetailsModel {
  const translations = TranslationsParams.fromMap(
    [],
    [],
    [],
    [],
    data.questions || [],
    data.answers || [],
    []
  )

  return new FaqDetailsModel(
    data.id,
    translations.questions,
    translations.answers
  )
}



  static getTitle(data: any) {
    const savedLocale = localStorage.getItem('lang')
    return new TitleInterface({
      id: data.id,
      title: data.titles?.find((title: any) => title.locale === savedLocale)?.title,
    })
  }
}
