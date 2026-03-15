import type Params from '@/base/core/params/params'


export default class InvestigationFiveQuestionParams implements Params {
  public answer: string
  public question: string

  constructor(data: { answer: string; question: string }) {
    this.answer = data.answer
    this.question = data.question
  }

  toMap(): Record<string, number | string | any> {
    const data: Record<string, number | string | any> = {}
    data['answer'] = this.answer
    data['question'] = this.question

    return data
  }
}
