import { withProjectId } from '@/shared/utils/projectScope'
import type Params from '@/base/core/params/params'

export default class IndexInternalAuditPlanParams implements Params {
  constructor(
    public word: string = '',
    public pageNumber: number = 1,
    public perPage: number = 10,
    public withPage: number = 1,
    public fromDate: string = '',
    public toDate: string = '',
    public status: number | null = null,
    public auditFocusId: number | null = null,
  ) {}

  toMap() {
    return withProjectId({
      ...(this.word ? { word: this.word } : {}),
      ...(this.fromDate ? { from_date: this.fromDate } : {}),
      ...(this.toDate ? { to_date: this.toDate } : {}),
      ...(this.status != null ? { status: this.status } : {}),
      ...(this.auditFocusId != null ? { audit_focus_id: this.auditFocusId } : {}),
      paginate: this.withPage,
      page: this.pageNumber,
      limit: this.perPage,
    })
  }
}
