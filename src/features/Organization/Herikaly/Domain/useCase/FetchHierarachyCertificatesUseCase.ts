import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { HierarchyCertificateRepo } from '../repositories/HierarchyCertificateRepo'
import type HierarchyCertificateModel from '../../Data/models/HeirarchyCertificateModel'

export default class FetchHierarchyCertificateUseCase implements UseCase<HierarchyCertificateModel[], Params> {
  async call(params: Params): Promise<DataState<HierarchyCertificateModel[]>> {
    return HierarchyCertificateRepo.getInstance().call(params)
  }
}
