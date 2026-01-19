import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type OrganizatoinEmployeeModel from '@/features/Organization/OrganizationEmployee/Data/models/OrganizatoinEmployeeModel'
import { IndexEmployeeCertificateRepo } from '../repositories/indexEmployeeCertificateRepo'

export default class IndexEmployeeCertificateUseCase
  implements UseCase<OrganizatoinEmployeeModel[], Params>
{
  async call(params: Params): Promise<DataState<OrganizatoinEmployeeModel[]>> {
    return IndexEmployeeCertificateRepo.getInstance().call(params)
  }
}
