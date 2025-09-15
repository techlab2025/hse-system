import TitleLangModel from "@/base/core/Models/title_lang_model";

export default class TitleModelTranslations {
  public id: number
  public title: TitleLangModel[]

  constructor(id: number, title: TitleLangModel[]) {
    this.id = id
    this.title = title
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromMap(data: any): TitleModelTranslations {
    const lang = localStorage.getItem("lang") ? localStorage.getItem("lang") : "en"
    const currentLang = lang ; // Replace with your logic to get the current language

    return new TitleModelTranslations(data.id, data.titles.find((t) => t.locale === currentLang)?.title || "")
  }
}
