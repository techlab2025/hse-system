export default class NcrRootCauseParams {
  constructor(public rootCausesId: number) {}

  toMap() {
    return { root_causes_id: this.rootCausesId }
  }
}
