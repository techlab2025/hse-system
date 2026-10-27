import { i18n, translate } from '@/localization/i18n'
export default class TitleInterface {
  id: number
  title?: string
  subtitle?: string | number
  kpi?: string
  decodedData?: string = ''
  type?: number
  name?: string
  color?: string
  parent?: TitleInterface | null

  constructor({
    id,
    title,
    translationKey,
    localizedTitles,
    subtitle,
    kpi,
    decodedData = '',
    type,
    name,
    color,
    parent,
  }: {
    id: number
    title?: string
    translationKey?: string
    localizedTitles?: readonly { locale: string; title?: string }[]
    subtitle?: string | number
    kpi?: string
    decodedData?: string
    type?: number
    name?: string
    color?: string
    parent?: TitleInterface | null
  }) {
    this.id = id
    this.title = title
    if (translationKey || localizedTitles?.length) {
      let override: string | undefined
      Object.defineProperty(this, 'title', {
        enumerable: true,
        configurable: true,
        get: () =>
          override ??
          (translationKey
            ? translate(translationKey)
            : localizedTitles?.find((item) => item.locale === i18n.global.locale.value)?.title ||
              title ||
              localizedTitles?.[0]?.title ||
              ''),
        set: (value: string) => {
          override = value
        },
      })
    }
    this.subtitle = subtitle || ''
    this.kpi = kpi
    this.decodedData = decodedData
    this.type = type
    this.name = name
    this.color = color
    this.parent = parent
  }
}
