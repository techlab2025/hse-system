import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type HerikalyModel from '../../Data/models/HerikalyModel'
import { AddCertificateToHierarchyRepo } from '../repositories/addCertificateToHierarchyRepo'

export default class AddCertificateToHierarchyUseCase implements UseCase<HerikalyModel, Params> {
  async call(params: Params): Promise<DataState<HerikalyModel>> {
    return AddCertificateToHierarchyRepo.getInstance().call(params)
  }
}
