import { DataSuccess, type DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import { UseCaseHandler } from '@/base/Domain/UseCase/use_case'
import InternalAuditNcrModel from '../../../Data/models/ncrs/InternalAuditNcrModel'
import FetchNcrsRepo from '../../repositories/ncrs/fetchNcrsRepo'

export default class FetchNcrsUseCase implements UseCase<InternalAuditNcrModel[], Params> {
  async call(params: Params): Promise<DataState<InternalAuditNcrModel[]>> {
    return UseCaseHandler.instance().handle({
      onTest: () => new DataSuccess({ data: InternalAuditNcrModel.example }),
      onDev: () => FetchNcrsRepo.getInstance().call(params),
      onProduction: () => FetchNcrsRepo.getInstance().call(params),
    })
  }
}
