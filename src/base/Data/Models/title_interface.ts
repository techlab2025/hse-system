export default class TitleInterface {
  id: number;
  title?: string;
  subtitle?: string | number;
  kpi?: string;
  decodedData?: string = '';
  type?: number;
  name?: string;
  color?: string;

  constructor({
    id,
    title,
    subtitle,
    kpi,
    decodedData = '',
    type,
    name,
    color,
  }: {
    id: number;
    title?: string;
    subtitle?: string | number;
    kpi?: string;
    decodedData?: string;
    type?: number;
    name?: string;
    color?: string;
  }) {
    this.id = id;
    this.title = title;
    this.subtitle = subtitle || '';
    this.kpi = kpi;
    this.decodedData = decodedData;
    this.type = type;
    this.name = name;
    this.color = color;
  }
}
