import TitleInterface from "@/base/Data/Models/title_interface";
import DepartmentModel from "@/features/dashboard/settings/department/Data/models/index_department_model";

export default class EmployeeModel extends TitleInterface {
  public name: string;
  public email: string;
  public address: string;
  public phone: string;
  public cardNumber: string;
  public phoneNumber: string;
  public academicDegree: string;
  public department: DepartmentModel | null;

  constructor(
    id: number,
    title: string,
    subtitle: string,
    name: string,
    email: string,
    address: string,
    phone: string,
    cardNumber: string,
    phoneNumber: string,
    academicDegree: string,
    department: DepartmentModel | null,
  ) {
    super({ id, title, subtitle });
    this.name = name;
    this.email = email;
    this.address = address;
    this.phone = phone;
    this.cardNumber = cardNumber;
    this.phoneNumber = phoneNumber;
    this.academicDegree = academicDegree;
    this.department = department;
  }

  static fromMap(data: any): EmployeeModel {
    return new EmployeeModel(
      data.id,
      data.name,
      data.subtitle,
      data.name,
      data.email,
      data.address,
      data.phone,
      data.cardNumber,
      data.phoneNumber,
      data.academicDegree,
      data.department ? DepartmentModel.fromMap(data.department) : null,
    );
  }
}
