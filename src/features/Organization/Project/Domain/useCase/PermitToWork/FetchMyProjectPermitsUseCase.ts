import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ProjectPermitsModel from '../../../Data/models/PermitToWork/ProjectPermitsModel'
import { FetchMyPermitsRepo } from '../../repositories/PermitToWork/FetchMyPermitsRepo'


export default class FetchMyProjectPermitsUseCase implements UseCase<ProjectPermitsModel[], Params> {
  async call(params: Params): Promise<DataState<ProjectPermitsModel[]>> {
    return FetchMyPermitsRepo.getInstance().call(params)
  }
}
