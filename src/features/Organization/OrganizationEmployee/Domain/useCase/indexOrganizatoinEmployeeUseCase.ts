import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import {
  DataSuccess,
  type DataState,
} from '@/base/core/networkStructure/Resources/dataState/data_state'
import OrganizatoinEmployeeModel from '../../Data/models/OrganizatoinEmployeeModel'
import { IndexOrganizatoinEmployeeRepo } from '../repositories/indexOrganizatoinEmployeeRepo'
import { UseCaseHandler } from '@/base/Domain/UseCase/use_case'

export default class IndexOrganizatoinEmployeeUseCase
  implements UseCase<OrganizatoinEmployeeModel[], Params>
{
  async call(params: Params): Promise<DataState<OrganizatoinEmployeeModel[]>> {
    return UseCaseHandler.instance().handle({
      onTest: () => {
        return new DataSuccess({ data: OrganizatoinEmployeeModel.example })
      },
      onDev: () => {
        return IndexOrganizatoinEmployeeRepo.getInstance().call(params)
      },
      onProduction: () => {
        return IndexOrganizatoinEmployeeRepo.getInstance().call(params)
      },
    })
  }
}
