import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type EmployeeModel from '../../Data/models/equipmentModel'
import { IndexEmployeeRepo } from '../repositories/indexEmployeeRepo'

export default class IndexEmployeeUseCase implements UseCase<EmployeeModel[], Params> {
  async call(params: Params): Promise<DataState<EmployeeModel[]>> {
    return IndexEmployeeRepo.getInstance().call(params)
  }
}
