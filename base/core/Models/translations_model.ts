export default class TranslationsModel {
    public title_ar: string = ''
    public title_en: string = ''
    public subtitle_ar: string = ''
    public subtitle_en: string = ''
    public description_ar: string = ''
    public description_en: string = ''

    constructor(title_ar = '', title_en = '', subtitle_ar = '', subtitle_en = '',description_ar = '', description_en = '') {
        this.title_ar = title_ar
        this.title_en = title_en
        this.subtitle_ar = subtitle_ar
        this.subtitle_en = subtitle_en
        this.description_ar = description_ar
        this.description_en = description_en
    }

    static fromData(data: any): TranslationsModel {
        const model = new TranslationsModel()
        if (Array.isArray(data)) {
            data.forEach((element: any) => {
                if (element.locale === 'ar') {
                    model.title_ar = element.title || ''
                    model.description_ar = element.description || ''
                    model.subtitle_ar = element.subtitle || ''
                } else if (element.locale === 'en') {
                    model.title_en = element.title || ''
                    model.description_en = element.description || ''
                    model.subtitle_en = element.subtitle || ''
                }
            })
        }
        return model
    }

    setTitleAr(title: string) {
        this.title_ar = title
    }

    setTitleEn(title: string) {
        this.title_en = title
    }

    getTitles(): TranslationsModel {
        return new TranslationsModel(this.title_ar, this.title_en)
    }
}
