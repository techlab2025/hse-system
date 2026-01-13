import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type EmployeeCertificateModel from '../../Data/models/EmployeeCertificateModel'
import { DeleteEmployeeCertificateRepo } from '../repositories/deleteEmployeeCertificateRepo'

export default class DeleteEmployeeCertificateUseCase implements UseCase<EmployeeCertificateModel, Params> {
  async call(params: Params): Promise<DataState<EmployeeCertificateModel>> {
    return DeleteEmployeeCertificateRepo.getInstance().call(params)
  }
}
