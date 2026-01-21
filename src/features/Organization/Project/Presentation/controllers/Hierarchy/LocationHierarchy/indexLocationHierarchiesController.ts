// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type LocationHierarchyModel from '@/features/Organization/Project/Data/models/LocationHierarchyModel'
import type ProjectLocationHierarchyModel from '@/features/Organization/Project/Data/models/ProjectLocationHierarchyModel'
import IndexLocationHierarchyUseCase from '@/features/Organization/Project/Domain/useCase/Hierarchy/LocationHierarchy/indexLocationHierarchiesUseCase'


export default class IndexLocationHierarchyController extends SelectControllerInterface<
    ProjectLocationHierarchyModel[]
> {
    private static instance: IndexLocationHierarchyController
    private constructor() {
        super()
    }
    private IndexLocationHierarchyUseCase = new IndexLocationHierarchyUseCase()

    static getInstance() {
        if (!this.instance) {
            this.instance = new IndexLocationHierarchyController()
        }
        return this.instance
    }

    async getData(params: Params) {
        // useLoaderStore().setLoadingWithDialog();
        // console.log(params)
        this.setLoading()
        const dataState: DataState<ProjectLocationHierarchyModel[]> =
            await this.IndexLocationHierarchyUseCase.call(params)

        this.setState(dataState)
        if (this.isDataSuccess()) {
            // useLoaderStore().endLoadingWithDialog();
        } else {
            throw new Error('Error while addServices')
        }
        super.handleResponseDialogs()
        return this.state
    }
}
