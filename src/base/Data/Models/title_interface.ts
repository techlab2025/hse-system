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
    this.subtitle = subtitle || ''
    this.kpi = kpi
    this.decodedData = decodedData
    this.type = type
    this.name = name
    this.color = color
    this.parent = parent
  }
}
