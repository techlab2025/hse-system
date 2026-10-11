import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type OrganizationCertificateDetailsModel from '../../Data/models/OrganizationCertificateDetailsModel'
import { ShowOrganizationCertificateRepo } from '../repositories/showOrganizationCertificateRepo'


export default class ShowOrganizationCertificateUseCase
  implements UseCase<OrganizationCertificateDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<OrganizationCertificateDetailsModel>> {
    return ShowOrganizationCertificateRepo.getInstance().call(params)
  }
}
