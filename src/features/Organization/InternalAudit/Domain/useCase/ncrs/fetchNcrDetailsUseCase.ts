import {
  DataSuccess,
  type DataState,
} from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import { UseCaseHandler } from '@/base/Domain/UseCase/use_case'
import InternalAuditNcrDetailsModel from '../../../Data/models/ncrs/InternalAuditNcrDetailsModel'
import FetchNcrDetailsRepo from '../../repositories/ncrs/fetchNcrDetailsRepo'

export default class FetchNcrDetailsUseCase
  implements UseCase<InternalAuditNcrDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<InternalAuditNcrDetailsModel>> {
    return UseCaseHandler.instance().handle({
      onTest: () => new DataSuccess({ data: InternalAuditNcrDetailsModel.example }),
      onDev: () => FetchNcrDetailsRepo.getInstance().call(params),
      onProduction: () => FetchNcrDetailsRepo.getInstance().call(params),
    })
  }
}
