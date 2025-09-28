import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type AboutUsFeatureModel from '../../Data/models/AboutUsFeatureModel'
import { EditAboutUsFeatureRepo } from '../repositories/editAboutUsFeatureRepo'





export default class EditAboutUsFeatureUseCase implements UseCase<AboutUsFeatureModel, Params> {
  async call(params: Params): Promise<DataState<AboutUsFeatureModel>> {
    return EditAboutUsFeatureRepo.getInstance().call(params)
  }
}
