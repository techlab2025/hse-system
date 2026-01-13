import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { AddEmployeeCertificateRepo } from '../repositories/addEmployeeCertificateRepo'
import type EmployeeCertificateModel from '../../Data/models/EmployeeCertificateModel'


export default class AddEmployeeCertificateteUseCase implements UseCase<EmployeeCertificateModel, Params> {
  async call(params: Params): Promise<DataState<EmployeeCertificateModel>> {
    return AddEmployeeCertificateRepo.getInstance().call(params)
  }
}
