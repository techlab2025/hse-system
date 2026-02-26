import type Params from '@/base/core/params/params'
// import { ClientStatusEnum } from '@/features/users/clients/clients/Core/enums/clientStatusEnum.ts'
// import type { LangEnum } from '@/features/setting/languages/Core/enums/langEnum.ts'

export default class OverviewInvestigationsChartParams implements Params {
  public project_id?:number

  constructor(project_id?: number) {
    this.project_id = project_id
  }

  toMap(): Record<string, string | number | number[] | null> {
    const data: Record<string, string | number | number[] | null> = {}
    if (this.project_id) data['project_id'] = this.project_id
    return data
  }
}
