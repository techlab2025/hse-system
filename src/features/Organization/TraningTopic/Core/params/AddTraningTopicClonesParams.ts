import type Params from '@/base/core/params/params'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class AddTraningTopicClonesParams implements Params {
  public clonesIds: number[]


  constructor(
    data: { 
      clonesIds: number[]
     }
    ) 
    { 
      this.clonesIds = data.clonesIds 
    }
  toMap(): Record<string, number[]> { return { clones_ids: this.clonesIds } }
  // validate() { return new ClassValidation(this).validate() }
  // validateOrThrow() { return new ClassValidation(this).validateOrThrow() }
}
