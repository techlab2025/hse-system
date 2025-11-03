// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ProjectModel from '@/features/Organization/Project/Data/models/ProjectModel'
import ProjectLocationModel from '@/features/Organization/Project/Data/models/projectLocation'
import { IndexProjectLocationApiService } from '@/features/Organization/Project/Data/apiServices/Hierarchy/ProjectLocations/indexProjectLocationApiService'

class IndexProjectLocationRepo extends RepoInterface<ProjectLocationModel[]> {
    private static instance: IndexProjectLocationRepo

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {
        super()
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new IndexProjectLocationRepo()
        }
        return this.instance
    }

    override get hasPagination(): boolean {
        return true
    }

    onParse(data: any): ProjectLocationModel[] {
        return data.map((item: any) => ProjectLocationModel.fromMap(item))
    }

    get serviceInstance(): ServicesInterface {
        return IndexProjectLocationApiService.getInstance()
    }
}

export { IndexProjectLocationRepo }
