import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DataSuccess } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import { UseCaseHandler } from '@/base/Domain/UseCase/use_case'
import LessonLearntReportModel from '../../Data/models/LessonLearntReportModel'
import LessonsLearntRepository from '../repositories/LessonsLearntRepository'

export default class FetchLessonsLearntUseCase
  implements UseCase<LessonLearntReportModel[], Params>
{
  call(params: Params): Promise<DataState<LessonLearntReportModel[]>> {
    return UseCaseHandler.instance().handle({
      onTest: () => new DataSuccess({ data: LessonLearntReportModel.examples }),
      onDev: () => LessonsLearntRepository.getInstance().call(params),
      onProduction: () => LessonsLearntRepository.getInstance().call(params),
    })
  }
}
