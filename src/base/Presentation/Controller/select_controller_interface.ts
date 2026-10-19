import type Params from '@/base/core/params/params'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import TitleInterface from '@/base/Data/Models/title_interface'

type SelectResponseItem = {
  id?: number
  title?: string
  subtitle?: string | number
  type?: number
  color?: string
  ptw_color?: string
  parent?: TitleInterface | null
}

type SelectControllerResponse = {
  value: {
    data?: SelectResponseItem[]
  }
}

abstract class SelectControllerInterface<T> extends ControllerInterface<T> {
  // abstract fetch(params: params): Promise<Ref<DataState<TitleInterface[]>>>;
  abstract getData(params: Params): Promise<unknown>

  async fetch(params: Params) {
    const data = (await this.getData(params)) as SelectControllerResponse
    const adaptData: TitleInterface[] = []

    if (this.isDataSuccess()) {
      ;(data.value.data ?? []).forEach((el) => {
        adaptData.push(
          new TitleInterface({
            id: el.id ?? 0,
            title: el.title || '',
            subtitle: el.subtitle || '',
            type: el.type,
            color: el.color ?? el.ptw_color,
            parent: el.parent,
          }),
        )
      })
    }

    return adaptData
  }
}

export { SelectControllerInterface }
