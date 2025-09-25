import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type HeaderModel from '../../Data/models/HeaderModel'
import { DeleteHeaderRepo } from '../repositories/deleteHeaderRepo'


export default class DeleteHeaderUseCase implements UseCase<HeaderModel, Params> {
  async call(params: Params): Promise<DataState<HeaderModel>> {
    return DeleteHeaderRepo.getInstance().call(params)
  }
}
