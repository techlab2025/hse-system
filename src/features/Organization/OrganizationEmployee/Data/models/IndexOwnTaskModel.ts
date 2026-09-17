import { ChangeTaskStatusEnum } from '../../Core/Enum/ChangeTaskStatusEnum'

export default class IndexOwnTaskModel {
  public id: number
  public code: string
  public title: string
  public description: string
  public status: number
  public duration: string
  public teamLeader: string
  public assignedTo: string
  public deliveryDate: string

  constructor(data: {
    id: number
    code: string
    title: string
    description: string
    status: number
    duration: string
    teamLeader: string
    assignedTo: string
    deliveryDate: string
  }) {
    this.id = data.id
    this.code = data.code
    this.title = data.title
    this.description = data.description
    this.status = data.status
    this.duration = data.duration
    this.teamLeader = data.teamLeader
    this.assignedTo = data.assignedTo
    this.deliveryDate = data.deliveryDate
  }

  static fromMap(data: any): IndexOwnTaskModel {
    return new IndexOwnTaskModel({
      id: data?.id,
      code: data?.code ?? '',
      title: data?.title ?? '',
      description: data?.description ?? '',
      status: Number(data?.status),
      duration: data?.duration ?? '',
      teamLeader: data?.team_leader?.name ?? '',
      assignedTo: data?.assigned_to?.name ?? '',
      deliveryDate: data?.delivery_date ?? '',
    })
  }


  static example: IndexOwnTaskModel = new IndexOwnTaskModel({
    id: 1,
    code: 'TSK-001',
    title: 'Site inspection',
    description: 'Check finishing quality on floor 3',
    status: ChangeTaskStatusEnum.pending,
    duration: '3 days',
    teamLeader: 'Mohab',
    assignedTo: 'Ahmed',
    deliveryDate: '2026-10-01',
  })
}