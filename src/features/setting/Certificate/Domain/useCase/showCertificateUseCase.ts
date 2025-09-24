import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type CertificateDetailsModel from '../../Data/models/CertificateDetailsModel'
import { ShowCertificateRepo } from '../repositories/showCertificateRepo'


export default class ShowCertificateUseCase
  implements UseCase<CertificateDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<CertificateDetailsModel>> {
    return ShowCertificateRepo.getInstance().call(params)
  }
}
