import type Params from '@/base/core/params/params'
// import type LangModel from '@/features/setting/languages/Data/models/langModel'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DisActiveObjectivesRepo } from '../repositories/disActiveObjectivesRepo'
import type ObjectivesModel from '../../Data/models/objectivesModel'


export default class DisObjectivesUseCase implements UseCase<ObjectivesModel, Params> {
  async call(params: Params): Promise<DataState<ObjectivesModel>> {
    return DisActiveObjectivesRepo.getInstance().call(params)
  }
}
