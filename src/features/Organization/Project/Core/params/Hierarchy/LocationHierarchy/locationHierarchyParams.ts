import type Params from '@/base/core/params/params'
// import { ClientStatusEnum } from '@/features/users/clients/clients/Core/enums/clientStatusEnum.ts'
// import type { LangEnum } from '@/features/setting/languages/Core/enums/langEnum.ts'

export default class LocationHierarchyParams implements Params {
    public project_location_id: number = 1
    public hierarchy_ids: number[]


    constructor(
        project_location_id: number = 1,
        hierarchy_ids: number[]

    ) {
        this.project_location_id = project_location_id
        this.hierarchy_ids = hierarchy_ids

    }

    toMap(): Record<string, string | number | number[] | null> {
        const data: Record<string, string | number | number[] | null> = {}
        data['project_location_id'] = this.project_location_id
        data['hierarchy_ids'] = this.hierarchy_ids

        return data
    }
}
