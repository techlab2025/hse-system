import TitleInterface from '@/base/Data/Models/title_interface'
import LocationHierarchyModel from './LocationHierarchyModel'
import EmployeeModel from '@/features/employee/Data/models/equipmentModel'

export default class EmployeeHierarchyModel {
    public id: number;
    public title: string;
    public employee: EmployeeModel[]

    constructor(id: number, title: string, employee: EmployeeModel[],) {
        this.id = id
        this.title = title
        this.employee = employee
    }

    static fromMap(data: any): EmployeeHierarchyModel {
        return new EmployeeHierarchyModel(
            data.id,
            data.title,
            data.employee?.map((item: any) => EmployeeModel.fromMap(item)),
        )
    }
}
