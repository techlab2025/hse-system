import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { CloseTicketApiService } from '../../Data/apiServices/closeTicketApiService'
import TicketModel from '../../Data/models/TicketModel'

class CloseTicketRepo extends RepoInterface<TicketModel> {
    private static instance: CloseTicketRepo
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {
        super()
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new CloseTicketRepo()
        }
        return this.instance
    }

    onParse(data: any): TicketModel {
        return TicketModel.fromMap(data)
    }

    override get responseType(): ResponseType {
        return ResponseType.withoutData
    }

    get serviceInstance(): ServicesInterface {
        return CloseTicketApiService.getInstance()
    }
}

export { CloseTicketRepo }
