import type Params from '@/base/core/params/params'

export default class CreateProjectMeetingHierarchyIdParams implements Params {
  hirarchy_id: number

  constructor(data: { hirarchy_id: number }) {
    this.hirarchy_id = data.hirarchy_id
  }

  toMap(): Record<
    string,
    number | string | number[] | Record<string, string | number[] | number | Record<string, string>>
  > {
    const data: Record<
      string,
      | number
      | string
      | number[]
      | Record<string, string | number[] | number | Record<string, string>>
    > = {}

    data['hierarchy_id'] = this.hirarchy_id

    return data
  }
}
