import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type PPEMatrixDeliveryModel from '../../../Data/models/ppematrix/PPEMatrixDeliveryModel'
import FetchPPEMatrixDeliveriesRepo from '../../repositories/ppematrix/FetchPPEMatrixDeliveriesRepo'

export default class FetchPPEMatrixDeliveriesUseCase
  implements UseCase<PPEMatrixDeliveryModel[], Params>
{
  call(params: Params): Promise<DataState<PPEMatrixDeliveryModel[]>> {
    return FetchPPEMatrixDeliveriesRepo.getInstance().call(params)
  }
}
