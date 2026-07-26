import type Params from '@/base/core/params/params'
import {
  DataSuccess,
  type DataState,
} from '@/base/core/networkStructure/Resources/dataState/data_state'
import type UseCase from '@/base/Domain/UseCase/use_case'
import { UseCaseHandler } from '@/base/Domain/UseCase/use_case'
import TaskReportModel from '../../Data/models/TaskReportModel'
import PreventiveTasksRepository from '../repositories/PreventiveTasksRepository'

export default class FetchPreventiveTasksUseCase implements UseCase<TaskReportModel[], Params> {
  call(params: Params): Promise<DataState<TaskReportModel[]>> {
    return UseCaseHandler.instance().handle({
      onTest: () => new DataSuccess({ data: TaskReportModel.examples }),
      onDev: () => PreventiveTasksRepository.getInstance().call(params),
      onProduction: () => PreventiveTasksRepository.getInstance().call(params),
    })
  }
}
