import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { FetchPermitsRepo } from '../../repositories/PermitToWork/FetchPermitsRepo'
import type ProjectPermitsModel from '../../../Data/models/PermitToWork/ProjectPermitsModel'


export default class FetchProjectPermitsUseCase implements UseCase<ProjectPermitsModel[], Params> {
  async call(params: Params): Promise<DataState<ProjectPermitsModel[]>> {
    return FetchPermitsRepo.getInstance().call(params)
  }
}
