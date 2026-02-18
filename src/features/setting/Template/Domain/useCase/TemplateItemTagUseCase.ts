import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type TemplateItemTagModel from '../../Data/models/TemplateItemTagModel'
import { TemplateItemTagRepo } from '../repositories/TempaletItemTagRepo'

export default class TemplateItemTagUseCase implements UseCase<TemplateItemTagModel[], Params> {
  async call(params: Params): Promise<DataState<TemplateItemTagModel[]>> {
    return TemplateItemTagRepo.getInstance().call(params)
  }
}
