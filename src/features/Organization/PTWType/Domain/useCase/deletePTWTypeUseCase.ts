import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DeletePTWTypeRepo } from '../repositories/deletePTWTypeRepo'
import type PTWTypeModel from '../../Data/models/PTWTypeModel'

export default class DeletePTWTypeUseCase implements UseCase<PTWTypeModel, Params> {
  async call(params: Params): Promise<DataState<PTWTypeModel>> {
    return DeletePTWTypeRepo.getInstance().call(params)
  }
}
