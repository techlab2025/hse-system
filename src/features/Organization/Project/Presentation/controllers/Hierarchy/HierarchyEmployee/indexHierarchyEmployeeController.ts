// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type HierarchyEmployeeModel from '@/features/Organization/Project/Data/models/LocationHierarchyEmployeeModel'
import IndexHierarchyEmployeeUseCase from '@/features/Organization/Project/Domain/useCase/Hierarchy/HierarchyEmployee/indexHierarchyEmployeeUseCase'


export default class IndexHierarchyEmployeeController extends SelectControllerInterface<
    HierarchyEmployeeModel[]
> {
    private static instance: IndexHierarchyEmployeeController
    private constructor() {
        super()
    }
    private IndexHierarchyEmployeeUseCase = new IndexHierarchyEmployeeUseCase()

    static getInstance() {
        if (!this.instance) {
            this.instance = new IndexHierarchyEmployeeController()
        }
        return this.instance
    }

    async getData(params: Params) {
        // useLoaderStore().setLoadingWithDialog();
        // console.log(params)
        this.setLoading()
        const dataState: DataState<HierarchyEmployeeModel[]> =
            await this.IndexHierarchyEmployeeUseCase.call(params)

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
