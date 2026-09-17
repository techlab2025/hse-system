import type Params from '@/base/core/params/params'

export default class ShowCapaDetailsParams implements Params {
  public observationcapaId: number

  constructor(data: { observationcapaId: number }) {
    this.observationcapaId = data.observationcapaId
  }

  toMap(): Record<string, string | number | number[] | null> {
    const data: Record<string, string | number | number[] | null> = {}
    data['observation_capa_id'] = this.observationcapaId

    return data
  }
}
