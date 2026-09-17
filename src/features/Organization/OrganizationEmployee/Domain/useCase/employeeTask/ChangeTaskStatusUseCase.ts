import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import {
  DataSuccess,
  type DataState,
} from '@/base/core/networkStructure/Resources/dataState/data_state'
import { UseCaseHandler } from '@/base/Domain/UseCase/use_case'
import IndexOwnTaskModel from '../../../Data/models/IndexOwnTaskModel'
import { changeTaskStatusRepo } from '../../repositories/employeeTask/ChangeTaskStatusRepo'

export default class ChangeTaskStatusUseCase
  implements UseCase<IndexOwnTaskModel, Params>
{
  async call(params: Params): Promise<DataState<IndexOwnTaskModel>> {
    return UseCaseHandler.instance().handle({
      onTest: () => {
        return new DataSuccess({ data: IndexOwnTaskModel.example })
      },
      onDev: () => {
        return changeTaskStatusRepo.getInstance().call(params)
      },
      onProduction: () => {
        return changeTaskStatusRepo.getInstance().call(params)
      },
    })
  }
}
