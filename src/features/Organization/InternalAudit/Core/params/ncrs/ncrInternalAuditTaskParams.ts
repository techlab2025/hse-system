import type NcrCorrectiveActionParams from './ncrCorrectiveActionParams'
import type NcrPreventiveActionParams from './ncrPreventiveActionParams'

export default class NcrInternalAuditTaskParams {
  constructor(
    public correctiveAction: NcrCorrectiveActionParams,
    public preventiveAction: NcrPreventiveActionParams,
  ) {}

  toMap() {
    return {
      correcive_action: this.correctiveAction.toMap(),
      preventive_action: this.preventiveAction.toMap(),
    }
  }
}
