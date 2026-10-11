import type Params from '@/base/core/params/params'
// import type LangModel from '@/features/setting/languages/Data/models/langModel'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type OrganizationCertificateModel from '../../Data/models/OrganizationCertificateModel'
import { DisActiveOrganizationCertificateRepo } from '../repositories/disActiveOrganizationCertificateRepo'


export default class DisOrganizationCertificateUseCase implements UseCase<OrganizationCertificateModel, Params> {
  async call(params: Params): Promise<DataState<OrganizationCertificateModel>> {
    return DisActiveOrganizationCertificateRepo.getInstance().call(params)
  }
}
