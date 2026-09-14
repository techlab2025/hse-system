import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { AddMangementChangeTopicTypeCloneRepo } from '../repositories/AddMangementChangeTopicTypeCloneRepo'
import type MangementChangeTopicTypeModel from '../../Data/models/MangementChangeTopicTypeModel'

export default class AddManagementChangeTopicTypeCloneUseCase implements UseCase<MangementChangeTopicTypeModel, Params> {
  async call(params: Params): Promise<DataState<MangementChangeTopicTypeModel>> {
    return AddMangementChangeTopicTypeCloneRepo.getInstance().call(params)
  }
}
