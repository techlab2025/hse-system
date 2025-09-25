import type Params from '@/base/core/params/params'
// import type LangModel from '@/features/setting/languages/Data/models/langModel'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type HomeContactUsModel from '../../Data/models/HomeContactUsModel'
import { DisActiveHomeContactUsRepo } from '../repositories/disActiveHomeContactUsRepo'



export default class DisHomeContactUsUseCase implements UseCase<HomeContactUsModel, Params> {
  async call(params: Params): Promise<DataState<HomeContactUsModel>> {
    return DisActiveHomeContactUsRepo.getInstance().call(params)
  }
}
