import TitleInterface from '@/base/Data/Models/title_interface'
import CertificateModel from '@/features/setting/Certificate/Data/models/CertificateModel'

export default class HierarchyCertificateModel extends TitleInterface {
  public id: number
  public title: string
  public parent_id: number
  public children: HierarchyCertificateModel[]
  public certificates: CertificateModel[]

  constructor(id: number, title: string, parent_id: number, children: HierarchyCertificateModel[] , certificates: CertificateModel[]) {
    super({ id })
    this.id = id
    this.title = title
    this.parent_id = parent_id
    this.children = children
    this.certificates = certificates
  }

  static fromMap(data: any): HierarchyCertificateModel {
    return new HierarchyCertificateModel(data.id, data.title, data.parent_id, data.children , data.certificates.map((cert: any) => CertificateModel.fromMap(cert)))
  }
}

