// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HierarchyEmployeeModel from '@/features/Organization/Project/Data/models/LocationHierarchyEmployeeModel'
import { IndexHierarchyEmployeeApiService } from '@/features/Organization/Project/Data/apiServices/Hierarchy/HierarchyEmployee/indexHierarchyEmployeeApiService'


class IndexHierarchyEmployeeRepo extends RepoInterface<HierarchyEmployeeModel[]> {
    private static instance: IndexHierarchyEmployeeRepo

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {
        super()
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new IndexHierarchyEmployeeRepo()
        }
        return this.instance
    }

    override get hasPagination(): boolean {
        return true
    }

    onParse(data: any): HierarchyEmployeeModel[] {
        return data.map((item: any) => HierarchyEmployeeModel.fromMap(item))
    }

    get serviceInstance(): ServicesInterface {
        return IndexHierarchyEmployeeApiService.getInstance()
    }
}

export { IndexHierarchyEmployeeRepo }
