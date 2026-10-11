import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type OrganizationCertificateModel from '../../Data/models/OrganizationCertificateModel'
import { EditOrganizationCertificateRepo } from '../repositories/editOrganizationCertificateRepo'


export default class EditOrganizationCertificateUseCase implements UseCase<OrganizationCertificateModel, Params> {
  async call(params: Params): Promise<DataState<OrganizationCertificateModel>> {
    return EditOrganizationCertificateRepo.getInstance().call(params)
  }
}
