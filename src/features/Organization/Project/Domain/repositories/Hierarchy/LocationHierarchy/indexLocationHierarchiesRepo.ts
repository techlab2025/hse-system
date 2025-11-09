// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { IndexLocationHierarchyApiService } from '@/features/Organization/Project/Data/apiServices/Hierarchy/LocationHierarchy/indexLocationHierarchiesApiService'
import LocationHierarchyModel from '@/features/Organization/Project/Data/models/LocationHierarchyModel'

class IndexLocationHierarchyRepo extends RepoInterface<LocationHierarchyModel[]> {
    private static instance: IndexLocationHierarchyRepo

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {
        super()
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new IndexLocationHierarchyRepo()
        }
        return this.instance
    }

    override get hasPagination(): boolean {
        return true
    }

    onParse(data: any): LocationHierarchyModel[] {
        return data.map((item: any) => LocationHierarchyModel.fromMap(item))
    }

    get serviceInstance(): ServicesInterface {
        return IndexLocationHierarchyApiService.getInstance()
    }
}

export { IndexLocationHierarchyRepo }
