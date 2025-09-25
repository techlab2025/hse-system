import type Params from '@/base/core/params/params'
// import type LangModel from '@/features/setting/languages/Data/models/langModel'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ChangeStatusHomeAboutUsRepo } from '../repositories/changeStatusHomeAboutUsRepo'
import type HomeAboutUsModel from '../../Data/models/HomeAboutUsModel'



export default class ChangeStatusHomeAboutUsUseCase implements UseCase<HomeAboutUsModel, Params> {
  async call(params: Params): Promise<DataState<HomeAboutUsModel>> {
    return ChangeStatusHomeAboutUsRepo.getInstance().call(params)
  }
}
