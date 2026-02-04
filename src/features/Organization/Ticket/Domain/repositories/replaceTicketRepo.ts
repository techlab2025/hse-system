import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { ReplaceTicketApiService } from '../../Data/apiServices/replaceTicketApiService'
import TicketModel from '../../Data/models/TicketModel'

class ReplaceTicketRepo extends RepoInterface<TicketModel> {
    private static instance: ReplaceTicketRepo
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {
        super()
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new ReplaceTicketRepo()
        }
        return this.instance
    }


    override get responseType(): ResponseType {
        return ResponseType.withoutData
    }

    onParse(data: any): TicketModel {
        return TicketModel.fromMap(data)
    }

    get serviceInstance(): ServicesInterface {
        return ReplaceTicketApiService.getInstance()
    }
}

export { ReplaceTicketRepo }
