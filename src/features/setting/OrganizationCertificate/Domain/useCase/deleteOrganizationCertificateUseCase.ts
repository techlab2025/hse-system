import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type OrganizationCertificateModel from '../../Data/models/OrganizationCertificateModel'
import { DeleteOrganizationCertificateRepo } from '../repositories/deleteOrganizationCertificateRepo'

export default class DeleteOrganizationCertificateUseCase implements UseCase<OrganizationCertificateModel, Params> {
  async call(params: Params): Promise<DataState<OrganizationCertificateModel>> {
    return DeleteOrganizationCertificateRepo.getInstance().call(params)
  }
}
