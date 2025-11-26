import type Params from '@/base/core/params/params.ts'

export default class ItemResultParams implements Params {
  public result: string
  public template_item_id: string
  public files: string[]
  public task_result_item_options: number[]

  constructor(
    result: string,
    template_item_id: string,
    files: string[],
    task_result_item_options: number[],
  ) {
    this.result = result
    this.template_item_id = template_item_id
    this.files = files
    this.task_result_item_options = task_result_item_options
  }

  toMap(): Record<
    string,
    number | string | number[] | Record<string, string | number[] | number | Record<string, string>>
  > {
    const data: Record<string, any> = {}
    data['result'] = this.result
    data['template_item_id'] = this.template_item_id
    data['files'] = this.files
    data['task_result_item_options'] = this.task_result_item_options

    return data
  }
}
