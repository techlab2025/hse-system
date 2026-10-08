export default class NcrAreaUnderReviewParams {
  constructor(public areaUnderReviewId: number) {}

  toMap() {
    return { area_under_review_id: this.areaUnderReviewId }
  }
}
