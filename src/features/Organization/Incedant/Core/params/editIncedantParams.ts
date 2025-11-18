import type Params from '@/base/core/params/params.ts'

export default class EditIncedantParams implements Params {
  id: number
  text: string | null = null
  date: string | null = null
  zoonIds: number[] | null = null
  incedantId: number | null = null
  machineId: number | null = null
  image: string | null = null
  desciption: string | null = null
  constructor(
    id: number,
    text: string | null = null,
    date: string | null = null,
    zoonIds: number[] | null = null,
    incedantId: number | null = null,
    machineId: number | null = null,
    image: string | null = null,
    desciption: string | null = null,
  ) {
    this.id = id
    this.text = text
    this.date = date
    this.zoonIds = zoonIds
    this.incedantId = incedantId
    this.machineId = machineId
    this.image = image
    this.desciption = desciption
  }

  toMap(): Record<
    string,
    number | string | number[] | Record<string, string | number[] | number | Record<string, string>>
  > {
    const data: Record<string, any> = {}

    data['hazard_id'] = this.id
    if (this.text != null) data['text'] = this.text
    if (this.date != null) data['date'] = this.date
    if (this.zoonIds) data['zoon_ids'] = this.zoonIds
    if (this.incedantId) data['hazard_id'] = this.incedantId
    if (this.machineId) data['machine_id'] = this.machineId
    if (this.image) data['image'] = this.image
    if (this.desciption) data['desciption'] = this.desciption

    return data
  }
}
