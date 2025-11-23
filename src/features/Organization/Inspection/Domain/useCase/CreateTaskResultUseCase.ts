import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'

import type Params from '@/base/core/params/params'
import { CreateTaskAnswerRepo } from '../repositories/CreateTaskAnswerModelRepo'
import type CreateTaskAmswerModel from '../../Data/models/CreateTaskResultModel'

export default class CreateTaskResultUseCase implements UseCase<CreateTaskAmswerModel, Params> {
  async call(params: Params): Promise<DataState<CreateTaskAmswerModel>> {
    return CreateTaskAnswerRepo.getInstance().call(params)
  }
}
