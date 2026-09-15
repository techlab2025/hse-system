import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import type { MangementChangeTopicTypeEnum } from '../Core/MangementChangeTopicTypeEnum'

export default class EditMangementChangeTopicTypeParams implements Params {
  constructor(
    public id: number,
    public translation: TranslationsParams,
    public status?: MangementChangeTopicTypeEnum,
  ) {}

  toMap(): Record<string, unknown> {
    return {
      changement_topic_id: this.id,
      translations: this.translation.toMap(),
      status: this.status,
    }
  }
}