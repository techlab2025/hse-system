import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type RiskAssessmentModel from '../../../Data/models/RiskAssessment/RiskAssessmentModel'
import CreateRiskAssessmentRepo from '../../repositories/RiskAssessment/CreateRiskAssessmentRepo'

export default class CreateRiskAssessmentUseCase implements UseCase<RiskAssessmentModel, Params> {
  call(params: Params): Promise<DataState<RiskAssessmentModel>> {
    return CreateRiskAssessmentRepo.getInstance().call(params)
  }
}
