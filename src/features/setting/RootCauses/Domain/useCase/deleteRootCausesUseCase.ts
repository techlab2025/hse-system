import type Params from '@/base/core/params/params'
import type RootCausesModel from '@/features/setting/RootCauses/Data/models/RootCausesModel'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DeleteRootCausesRepo } from '@/features/setting/RootCauses/Domain/repositories/deleteRootCausesRepo'

export default class DeleteRootCausesUseCase implements UseCase<RootCausesModel, Params> {
  async call(params: Params): Promise<DataState<RootCausesModel>> {
    return DeleteRootCausesRepo.getInstance().call(params)
  }
}
