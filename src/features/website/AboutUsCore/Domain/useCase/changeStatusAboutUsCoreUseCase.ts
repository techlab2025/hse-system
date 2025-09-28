import type Params from '@/base/core/params/params'
// import type LangModel from '@/features/setting/languages/Data/models/langModel'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type AboutUsCoreModel from '../../Data/models/AboutUsCoreModel'
import { ChangeStatusAboutUsCoreRepo } from '../repositories/changeStatusAboutUsCoreRepo'




export default class ChangeStatusAboutUsCoreUseCase implements UseCase<AboutUsCoreModel, Params> {
  async call(params: Params): Promise<DataState<AboutUsCoreModel>> {
    return ChangeStatusAboutUsCoreRepo.getInstance().call(params)
  }
}
