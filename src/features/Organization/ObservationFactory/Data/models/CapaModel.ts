export default class CapaModel {
  public preventive: string
  public corrective: string
  public serial_name: Number
  public date: string
  public time: string
  public capa_status: string
  public capaId: number
  public observationId: number

  constructor(
    preventive: string,
    corrective: string,
    serial_name: Number,
    date: string,
    time: string,
    capa_status: string,
    capaId: number,
    observationId: number,
  ) {
    this.preventive = preventive
    this.corrective = corrective
    this.serial_name = serial_name
    this.date = date
    this.time = time
    this.capa_status = capa_status
    this.capaId = capaId
    this.observationId = observationId
  }

  static fromMap(data: any): CapaModel {
    return new CapaModel(
      data.preventive,
      data.corrective,
      data.serial_name,
      data.date,
      data.time,
      data.capa_status,
      data.observation_capa_id,
      data.observation_id,
    )
  }

  static example: CapaModel = new CapaModel(
    'preventive',
    'corrective',
    1,
    'date',
    'time',
    'capa_status',
    1,
    1,
  )
}
