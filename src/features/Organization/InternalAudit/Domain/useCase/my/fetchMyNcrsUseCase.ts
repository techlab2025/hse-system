import {
  DataSuccess,
  type DataState,
} from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import { UseCaseHandler } from '@/base/Domain/UseCase/use_case'
import InternalAuditNcrModel from '../../../Data/models/ncrs/InternalAuditNcrModel'
import FetchMyNcrsRepo from '../../repositories/my/fetchMyNcrsRepo'

export default class FetchMyNcrsUseCase implements UseCase<InternalAuditNcrModel[], Params> {
  async call(params: Params): Promise<DataState<InternalAuditNcrModel[]>> {
    return UseCaseHandler.instance().handle({
      onTest: () => new DataSuccess({ data: InternalAuditNcrModel.example }),
      onDev: () => FetchMyNcrsRepo.getInstance().call(params),
      onProduction: () => FetchMyNcrsRepo.getInstance().call(params),
    })
  }
}
