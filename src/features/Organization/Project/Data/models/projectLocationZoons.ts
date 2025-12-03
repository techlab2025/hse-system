import TitleInterface from '@/base/Data/Models/title_interface'

export default class projectLocationZoonsModel extends TitleInterface {
    public id: number
    public projectZoonId: number
    public title: string
    public zoonId: number


    constructor(
        id: number,
        projectZoonId: number,
        title: string,
        zoonId: number

    ) {
        super({ id, title })
        this.id = id
        this.projectZoonId = projectZoonId
        this.title = title
        this.zoonId = zoonId

    }

    static fromMap(data: any): projectLocationZoonsModel {
        return new projectLocationZoonsModel(
            data.project_location_id,
            data.project_zoon_id,
            data.title,
            data.zoon_id

        )
    }
}
