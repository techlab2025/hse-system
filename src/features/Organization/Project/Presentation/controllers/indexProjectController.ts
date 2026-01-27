// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type ProjectModel from '../../Data/models/ProjectModel'
import IndexProjectUseCase from '../../Domain/useCase/indexProjectUseCase'
import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexProjectController extends SelectControllerInterface<ProjectModel[]> {
  private static instance: IndexProjectController
  private constructor() {
    super()
  }
  private IndexProjectUseCase = new IndexProjectUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexProjectController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<ProjectModel[]> = await this.IndexProjectUseCase.call(params)

    this.setState(dataState)
    if (this.isDataSuccess()) {
      // useLoaderStore().endLoadingWithDialog();
    } else {
      throw new Error('Error while addServices')
    }
    super.handleResponseDialogs()
    return this.state
  }

  async fetch(params: Params) {
    const data = await this.getData(params)
    const adaptData: any[] = []
    if (this.isDataSuccess()) {
      adaptData.push(
        new TitleInterface({
          id: -1,
          title: 'All Projects',
        }),
      )
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
