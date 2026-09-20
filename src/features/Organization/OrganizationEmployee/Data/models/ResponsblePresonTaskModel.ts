import { ChangeTaskStatusEnum } from '../../Core/Enum/ChangeTaskStatusEnum'

export default class ResponsblePresonTaskModel {
  public id: number
  public organization_employee_id?:number
  public name?: string
  public serial_name?: string
  public organization_id?: number
  public phone?: string
  public email?: string
  public image?: string
  public employee_type?: string

  constructor(data: {
    id: number
    organization_employee_id?: number
    name?: string
    serial_name?: string
    organization_id?: number
    phone?: string
    email?: string
    image?: string
    employee_type?: string
   
  }) {
    this.id = data.id
    this.organization_employee_id = data.organization_employee_id
    this.name = data.name
    this.serial_name = data.serial_name
    this.organization_id = data.organization_id
    this.phone = data.phone
    this.email = data.email
    this.image = data.image
    this.employee_type = data.employee_type
  }

  static fromMap(data: any): ResponsblePresonTaskModel {
    return new ResponsblePresonTaskModel({
      id: data?.id,
      organization_employee_id: data?.organization_employee_id,
      name: data?.name,
      serial_name: data?.serial_name,
      organization_id: data?.organization_id,
      phone: data?.phone,
      email: data?.email,
      image: data?.image,
      employee_type: data?.employee_type
    })
  }


  static example: ResponsblePresonTaskModel = new ResponsblePresonTaskModel({
    id: 1,
    organization_employee_id: 1,
    name: 'John Doe',
    serial_name: 'JD123',
    organization_id: 1,
    phone: '123-456-7890',
    email: 'oHt4U@example.com',
    image: 'https://example.com/avatar.jpg',
    employee_type: 'employee',
  })
}
