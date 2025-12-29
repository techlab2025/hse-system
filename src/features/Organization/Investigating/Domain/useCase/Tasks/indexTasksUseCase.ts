import type UseCase from '@/base/Domain/UseCase/use_case'
import {
  DataSuccess,
  type DataState,
} from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { UseCaseHandler } from '@/base/Domain/UseCase/use_case'
import TasksModel from '../../../Data/models/Tasks/TasksModel'
import { IndexTasksRepo } from '../../repositories/Tasks/IndexTasksRepo'

export default class IndexTasksUseCase implements UseCase<TasksModel[], Params> {
  async call(params: Params): Promise<DataState<TasksModel[]>> {
    return UseCaseHandler.instance().handle({
      onTest: () => {
        return new DataSuccess({ data: TasksModel.example })
      },
      onDev: () => {
        return IndexTasksRepo.getInstance().call(params)
      },
      onProduction: () => {
        return IndexTasksRepo.getInstance().call(params)
      },
    })
  }
}
