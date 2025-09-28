import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type AboutUsCoreModel from '../../Data/models/AboutUsCoreModel'
import { EditAboutUsCoreRepo } from '../repositories/editAboutUsCoreRepo'



export default class EditAboutUsCoreUseCase implements UseCase<AboutUsCoreModel, Params> {
  async call(params: Params): Promise<DataState<AboutUsCoreModel>> {
    return EditAboutUsCoreRepo.getInstance().call(params)
  }
}
