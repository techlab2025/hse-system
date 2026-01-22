import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type CapaModel from '../../Data/models/CapaModel'
import type Params from '@/base/core/params/params'
import { CreateCapaResultRepo } from '../repositories/CreateCapaResultRepo'

export default class CreateCapaResultUseCase implements UseCase<CapaModel, Params> {
  async call(params: Params): Promise<DataState<CapaModel>> {
    return CreateCapaResultRepo.getInstance().call(params)
  }
}
