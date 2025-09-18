import type Params from '@/base/core/params/params'
import type LangModel from '@/features/setting/languages/Data/models/langModel'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DisActiveLangRepo } from '@/features/setting/languages/Domain/repositories/disActiveLangRepo'

export default class AcceptLangUseCase implements UseCase<LangModel, Params> {
  async call(params: Params): Promise<DataState<LangModel>> {
    return DisActiveLangRepo.getInstance().call(params)
  }
}
