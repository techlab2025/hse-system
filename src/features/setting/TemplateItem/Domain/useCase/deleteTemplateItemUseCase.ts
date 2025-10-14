import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type TemplateItemModel from '../../Data/models/TemplateItemModel'
import { DeleteTemplateItemRepo } from '../repositories/deleteTemplateItemRepo'

export default class DeleteTemplateItemUseCase implements UseCase<TemplateItemModel, Params> {
  async call(params: Params): Promise<DataState<TemplateItemModel>> {
    return DeleteTemplateItemRepo.getInstance().call(params)
  }
}
