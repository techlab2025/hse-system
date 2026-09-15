export default class TitleInterface {
  id: number;
  title?: string;
  subtitle?: string| number;
  kpi?: string;
  decodedData?: string = "";
   type?: number

  constructor({
    id,
    title,
    subtitle,
    kpi,
    decodedData = "",
    type,
  }: {
    id: number;
    title?: string;
    subtitle?: string | number;
    kpi?: string;
    decodedData?: string;
    type?: number
  }) {
    this.id = id;
    this.title = title;
    this.subtitle = subtitle || "";
    this.kpi = kpi;
    this.decodedData = decodedData;
    this.type = type
  }
}
