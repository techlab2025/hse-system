import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type TemplateModel from '../../Data/models/TemplateModel'
import { DeleteTemplateRepo } from '../repositories/deleteTemplateRepo'

export default class DeleteTemplateUseCase implements UseCase<TemplateModel, Params> {
  async call(params: Params): Promise<DataState<TemplateModel>> {
    return DeleteTemplateRepo.getInstance().call(params)
  }
}
