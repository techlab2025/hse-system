export default class NcrRootCauseParams {
  constructor(public rootCausesId: number) {}

  toMap() {
    return { root_cause_id: this.rootCausesId }
  }
}
