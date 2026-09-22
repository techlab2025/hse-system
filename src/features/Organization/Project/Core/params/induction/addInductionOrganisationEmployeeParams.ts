import type Params from '@/base/core/params/params'

export default class OrganisationEmployeenameParams implements Params {
  constructor(public organisationEmployeename: string) {}

  toMap(): Record<string, string> {
    return {
      organisationEmployeename: this.organisationEmployeename,
    }
  }
}