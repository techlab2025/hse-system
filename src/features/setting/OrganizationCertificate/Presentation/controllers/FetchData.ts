import type Params from "@/base/core/params/params"
import type UseCase from "@/base/Domain/UseCase/use_case"
import type OrganizationCertificateModel from "../../Data/models/OrganizationCertificateModel"

export default class FetchThaeData {
    private static instance: FetchThaeData


    static getInstance() {
        if (!this.instance) {
            this.instance = new FetchThaeData()
        }
        return this.instance
    }

    FetchData(data: UseCase<OrganizationCertificateModel[], Params>, params: Params) {
        data.call(params)
    }
} 