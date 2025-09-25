import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type HomeAboutUsModel from '../../Data/models/HomeAboutUsModel'
import { EditHomeAboutUsRepo } from '../repositories/editHomeAboutUsRepo'



export default class EditHomeAboutUsUseCase implements UseCase<HomeAboutUsModel, Params> {
  async call(params: Params): Promise<DataState<HomeAboutUsModel>> {
    return EditHomeAboutUsRepo.getInstance().call(params)
  }
}
