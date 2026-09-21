import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { showTaskHistoryRepo } from '../../repositories/employeeTask/ShowTaskHistoryRepo'
import type IndexOwnTaskModel from '../../../Data/models/IndexOwnTaskModel'

export default class showTaskHistoryUseCase
  implements UseCase<IndexOwnTaskModel, Params>
{
  async call(params: Params): Promise<DataState<IndexOwnTaskModel>> {
    return showTaskHistoryRepo.getInstance().call(params)
  }
}
