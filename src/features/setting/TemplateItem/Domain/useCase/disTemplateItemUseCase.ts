import type Params from '@/base/core/params/params'
// import type LangModel from '@/features/setting/languages/Data/models/langModel'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type TemplateItemModel from '../../Data/models/TemplateItemModel'
import { DisActiveTemplateItemRepo } from '../repositories/disActiveTemplateItemRepo'

export default class DisTemplateItemUseCase implements UseCase<TemplateItemModel, Params> {
  async call(params: Params): Promise<DataState<TemplateItemModel>> {
    return DisActiveTemplateItemRepo.getInstance().call(params)
  }
}
