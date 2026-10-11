import TitleInterface from '@/base/Data/Models/title_interface'
import type { OrganizationDocumentsFields } from '../../Core/params/addOrganizationDocumentsParams'

export default class OrganizationDocumentsDetailsModel implements OrganizationDocumentsFields {
  constructor(
    public id: number,
    public document_title: string,
    public document_ref: string,
    public document_version: string,
    public issue_date: string,
    public nex_review_date: string,
    public document_file: string,
    public notes: string,
    public document_category_id: number,
    public documentCategory: TitleInterface | null,
    public createdAt: string = '',
  ) {}

  static fromMap(data: any): OrganizationDocumentsDetailsModel {
    const category = data.document_category ?? data.category
    const categoryId = Number(data.document_category_id ?? category?.id ?? 0)
    return new OrganizationDocumentsDetailsModel(
      Number(data.id ?? data.document_id),
      data.document_title ?? '',
      String(data.document_ref ?? ''),
      String(data.document_version ?? ''),
      data.issue_date ?? '',
      data.nex_review_date ?? '',
      data.document_file ?? '',
      data.notes ?? '',
      categoryId,
      categoryId
        ? new TitleInterface({
            id: categoryId,
            title: category?.title ?? category?.name ?? String(categoryId),
          })
        : null,
      data.created_at ?? '',
    )
  }

  static transformData(data: any[]): OrganizationDocumentsDetailsModel[] {
    return data.map((item) => this.fromMap(item))
  }
}
