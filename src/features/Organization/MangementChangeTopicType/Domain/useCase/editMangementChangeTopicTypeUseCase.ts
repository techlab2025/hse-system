import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { EditMangementChangeTopicTypeRepo } from '../repositories/editMangementChangeTopicTypeRepo'
import type MangementChangeTopicTypeModel from '../../Data/models/MangementChangeTopicTypeModel'


export default class EditMangementChangeTopicTypeUseCase implements UseCase<MangementChangeTopicTypeModel, Params> {
  async call(params: Params): Promise<DataState<MangementChangeTopicTypeModel>> {
    return EditMangementChangeTopicTypeRepo.getInstance().call(params)
  }
}
