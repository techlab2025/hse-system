import type Params from '@/base/core/params/params'
// import type LangModel from '@/features/setting/languages/Data/models/langModel'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DisActiveTemplateRepo } from '../repositories/disActiveTemplateRepo'
import type TemplateModel from '../../Data/models/TemplateModel'


export default class DisTemplateUseCase implements UseCase<TemplateModel, Params> {
  async call(params: Params): Promise<DataState<TemplateModel>> {
    return DisActiveTemplateRepo.getInstance().call(params)
  }
}
