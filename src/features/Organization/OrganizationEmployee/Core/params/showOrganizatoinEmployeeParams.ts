import type Params from '@/base/core/params/params'

export default class ShowOrganizatoinEmployeeParams implements Params {
  id: number;
  isShow:boolean;

  constructor(id: number,isShow:boolean) {
    this.id = id;
    this.isShow = isShow;
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {}
    data['organization_employee_id'] = this.id
    return data
  }
}
