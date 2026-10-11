import TitleInterface from '@/base/Data/Models/title_interface'
import OrganizationDocumentsDetailsModel from './OrganizationDocumentsDetailsModel'
import type { OrganizationDocumentsFields } from '../../Core/params/addOrganizationDocumentsParams'

export default class OrganizationDocumentsModel
  extends TitleInterface
  implements OrganizationDocumentsFields
{
  public document_title: string
  public document_ref: string
  public document_version: string
  public issue_date: string
  public nex_review_date: string
  public document_file: string
  public notes: string
  public document_category_id: number
  public documentCategory: TitleInterface | null
  public createdAt: string

  constructor(data: OrganizationDocumentsDetailsModel) {
    super({ id: data.id, title: data.document_title })
    this.document_title = data.document_title
    this.document_ref = data.document_ref
    this.document_version = data.document_version
    this.issue_date = data.issue_date
    this.nex_review_date = data.nex_review_date
    this.document_file = data.document_file
    this.notes = data.notes
    this.document_category_id = data.document_category_id
    this.documentCategory = data.documentCategory
    this.createdAt = data.createdAt
  }

  static fromMap(data: any): OrganizationDocumentsModel {
    return new OrganizationDocumentsModel(OrganizationDocumentsDetailsModel.fromMap(data))
  }
}
