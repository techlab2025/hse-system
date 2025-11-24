import type Params from '@/base/core/params/params.ts'

export default class ItemResultParams implements Params {
  public result: string
  public template_item_id: string
  public item_image: string[]
  public task_result_item_options: number[]

  constructor(
    result: string,
    template_item_id: string,
    item_image: string[],
    task_result_item_options: number[],
  ) {
    this.result = result
    this.template_item_id = template_item_id
    this.item_image = item_image
    this.task_result_item_options = task_result_item_options
  }

  toMap(): Record<
    string,
    number | string | number[] | Record<string, string | number[] | number | Record<string, string>>
  > {
    const data: Record<string, any> = {}
    data['result'] = this.result
    data['template_item_id'] = this.template_item_id
    data['item_image'] = this.item_image
    data['task_result_item_options'] = this.task_result_item_options

    return data
  }
}
