import type Params from '@/base/core/params/params'
import type { RiskLevelEnum } from '../../Enums/risk_level_enum'

export default class IndexInvestigationResultParams implements Params {
  public word: string
  public withPage: number = 1
  public perPage: number = 10
  public pageNumber: number = 10
  public ObservatoinRiskLevel?: RiskLevelEnum
  constructor(
    word: string,
    pageNumber: number = 1,
    perPage: number = 10,
    withPage: number = 1,
    ObservatoinRiskLevel?: RiskLevelEnum,
  ) {
    this.word = word
    this.withPage = withPage
    this.pageNumber = pageNumber
    this.perPage = perPage
    this.ObservatoinRiskLevel = ObservatoinRiskLevel
  }

  toMap(): Record<string, number | string | any> {
    const data: Record<string, number | string | any> = {}
    if (this.word) data['word'] = this.word
    data['paginate'] = this.withPage
    data['page'] = this.pageNumber
    data['limit'] = this.perPage
    if (this.ObservatoinRiskLevel) data['observation_risk_level'] = this.ObservatoinRiskLevel

    return data
  }
}
