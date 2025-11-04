import type Params from '@/base/core/params/params'
// import { ClientStatusEnum } from '@/features/users/clients/clients/Core/enums/clientStatusEnum.ts'
// import type { LangEnum } from '@/features/setting/languages/Core/enums/langEnum.ts'

export default class IndexProjectLocationParams implements Params {
  public projectId: number = 1

  constructor(
    projectId: number = 1,
  ) {
    this.projectId = projectId
  }

  toMap(): Record<string, string | number | number[] | null> {
    const data: Record<string, string | number | number[] | null> = {}
    data['project_id'] = this.projectId
    return data
  }
}
