import type Params from '@/base/core/params/params'
import AddOrganizationDocumentsParams, {
  type OrganizationDocumentsFields,
} from './addOrganizationDocumentsParams'

export default class AddOrganizationDocumentsExcelParams implements Params {
  constructor(public data: OrganizationDocumentsFields[]) {}

  toMap() {
    return { data: this.data.map((fields) => new AddOrganizationDocumentsParams(fields).toMap()) }
  }
}
