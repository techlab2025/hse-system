import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type HerikalyModel from '../../Data/models/HerikalyModel'
import { DeleteCertificateToHierarchyRepo } from '../repositories/deleteCertificateToHierarchyRepo'

export default class DeleteCertificateToHierarchyUseCase implements UseCase<HerikalyModel, Params> {
  async call(params: Params): Promise<DataState<HerikalyModel>> {
    return DeleteCertificateToHierarchyRepo.getInstance().call(params)
  }
}
