  import type Params from '@/base/core/params/params'

  export default class CreateProjectZoneEquipment implements Params {
    projectId: number
    Zoons: Zoons[]

    constructor(projectId: number, Zoons: Zoons[]) {
      this.projectId = projectId
      this.Zoons = Zoons
    }

    toMap(): Record<
      string,
      | number
      | string
      | number[]
      | Record<string, string | number[] | any | number | Record<string, string>>
    > {
      const data: Record<
        string,
        | number
        | string
        | number[]
        | Record<string, string | number[] | number | any | Record<string, string>[]>
      > = {}

      if (this.projectId) data['project_id'] = this.projectId
      if (this.Zoons) data['zoons'] = this.Zoons

      return data
    }
  }

  interface Zoons {
    project_zoon_id: number
    equipment_ids: number[]
  }
