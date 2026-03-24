import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import {
  DataSuccess,
  type DataState,
} from '@/base/core/networkStructure/Resources/dataState/data_state'
import ProjectCustomLocationModel from '../../Data/models/CustomLocation/ProjectCustomLocationModel'
import { ProjectCustomLocationRepo } from '../repositories/ProjectCustomLocationRepo'
import { UseCaseHandler } from '@/base/Domain/UseCase/use_case'
import EquipmentStaticsModel from '@/features/Home/data/Model/EquipmentStaticsModel'

export default class ProjectCustomLocationUseCase
  implements UseCase<ProjectCustomLocationModel[], Params>
{
  async call(params: Params): Promise<DataState<ProjectCustomLocationModel[]>> {
    return UseCaseHandler.instance().handle({
      onTest: () => {
        return new DataSuccess({
          data: [
            { ...ProjectCustomLocationModel.example, title: 'alexandria' },
            { ...ProjectCustomLocationModel.example, title: 'cairo' },
          ],
        })
      },
      onDev: () => {
        return ProjectCustomLocationRepo.getInstance().call(params)
      },
      onProduction: () => {
        return ProjectCustomLocationRepo.getInstance().call(params)
      },
    })
    // return ProjectCustomLocationRepo.getInstance().call(params)
  }
}
