import TitleInterface from '@/base/Data/Models/title_interface'
import LocationHierarchyModel from './LocationHierarchyModel'
import EmployeeModel from '@/features/employee/Data/models/equipmentModel'

export default class EmployeeHierarchyModel {

    public hierarchy: LocationHierarchyModel[]
    public employee: EmployeeModel[]

    constructor(hierarchy: LocationHierarchyModel[], employee: EmployeeModel[],) {
        this.hierarchy = hierarchy
        this.employee = employee
    }

    static fromMap(data: any): EmployeeHierarchyModel {
        return new EmployeeHierarchyModel(
            data.hierarchy.map((item: any) => LocationHierarchyModel.fromMap(item)),
            data.employee.map((item: any) => EmployeeModel.fromMap(item)),
        )
    }
}
