import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import FetchMyProjectsUseCase from '../../Domain/useCase/FetchMyProjectsUseCase'
import TitleInterface from '@/base/Data/Models/title_interface'
import type ProjectModel from '@/features/Organization/Project/Data/models/ProjectModel'
import type FetchMyProjectsParams from '../../Core/params/fetchMyProjectsParams'
// import TitleInterface from '@/base/Data/Models/title_interface'

export default class FetchMyProjectsController extends SelectControllerInterface<ProjectModel[]> {
  private static instance: FetchMyProjectsController
  private constructor() {
    super()
  }
  private fetchMyProjectsUseCase = new FetchMyProjectsUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchMyProjectsController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    // this.setLoading()
    const dataState: DataState<ProjectModel[]> = await this.fetchMyProjectsUseCase.call(params)

    this.setState(dataState)
    if (this.isDataSuccess()) {
      // useLoaderStore().endLoadingWithDialog();
    } else {
      throw new Error('Error while addServices')
    }
    super.handleResponseDialogs()
    return this.state
  }

  async fetch(params: FetchMyProjectsParams) {
    const data = await this.getData(params)
    const adaptData: any[] = []
    if (this.isDataSuccess()) {
      console.log(params, "params");
      // if (params.allProject) {
      adaptData.push(
        new TitleInterface({
          id: -1,
          title: 'All Projects',
        }),
      )
      // }
      ;(data.value.data ?? []).map((el: any) => {
        adaptData.push(
          new TitleInterface({
            id: el?.id,
            title: el?.title,
          }),
        )
      })
    }

    return adaptData
  }
}
