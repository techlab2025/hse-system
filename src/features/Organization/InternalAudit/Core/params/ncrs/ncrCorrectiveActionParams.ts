export default class NcrCorrectiveActionParams {
  constructor(
    public correction: string,
    public assignedToId: number,
    public targetDate: string,
    public actualDate: string,
  ) {}

  toMap() {
    return {
      title: this.correction,
      assgined_to_id: this.assignedToId,
      due_date: this.targetDate,
      // actual_date: this.actualDate,
    }
  }
}
