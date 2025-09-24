import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type CertificateModel from '../../Data/models/CertificateModel'
import { EditCertificateRepo } from '../repositories/editCertificateRepo'


export default class EditCertificateUseCase implements UseCase<CertificateModel, Params> {
  async call(params: Params): Promise<DataState<CertificateModel>> {
    return EditCertificateRepo.getInstance().call(params)
  }
}
