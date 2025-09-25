import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type CertificateModel from '../../Data/models/CertificateModel'
import { DeleteCertificateRepo } from '../repositories/deleteCertificateRepo'

export default class DeleteCertificateUseCase implements UseCase<CertificateModel, Params> {
  async call(params: Params): Promise<DataState<CertificateModel>> {
    return DeleteCertificateRepo.getInstance().call(params)
  }
}
