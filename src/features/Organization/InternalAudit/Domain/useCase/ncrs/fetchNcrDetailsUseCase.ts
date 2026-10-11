import {
  DataSuccess,
  type DataState,
} from '@/base/core/networkStructure/Resources/dataState/data_state'
import type FetchNcrDetailsParams from '../../../Core/params/ncrs/fetchNcrDetailsParams'
import type UseCase from '@/base/Domain/UseCase/use_case'
import { UseCaseHandler } from '@/base/Domain/UseCase/use_case'
import InternalAuditNcrModel from '../../../Data/models/ncrs/InternalAuditNcrModel'
import FetchNcrDetailsRepo from '../../repositories/ncrs/fetchNcrDetailsRepo'

export default class FetchNcrDetailsUseCase
  implements UseCase<InternalAuditNcrModel, FetchNcrDetailsParams>
{
  async call(params: FetchNcrDetailsParams): Promise<DataState<InternalAuditNcrModel>> {
    return UseCaseHandler.instance().handle({
      onTest: () =>
        new DataSuccess({
          data: InternalAuditNcrModel.fromMap({
            id: params.ncrId,
            ncr: 'NCR-2026-001',
            serial_name: 'NCR-2026-001',
            serial_number: '001',
            ncrs_category: 1,
            has_result: false,
          }),
        }),
      onDev: () => FetchNcrDetailsRepo.getInstance().call(params),
      onProduction: () => FetchNcrDetailsRepo.getInstance().call(params),
    })
  }
}
