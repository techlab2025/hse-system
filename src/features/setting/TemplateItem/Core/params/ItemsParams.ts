// import type Params from '@/base/core/params/params'
// import { ClassValidation } from '@/base/Presentation/utils/class_validation'
// import { TextAreaStatusEnum } from '../Enum/TextAreaStatusEnum'

// export default class ItemsParams implements Params {
//   public title: string
//   public isDanger: boolean
//   public isTextAreaRequired: boolean
//   public textarea_type: number
//   public has_auto_observation: boolean
//   constructor(
//     title: string,
//     isDanger: boolean,
//     isTextAreaRequired: boolean,
//     textarea_type: number,
//     has_auto_observation: boolean,
//   ) {
//     this.title = title
//     this.isDanger = isDanger
//     this.isTextAreaRequired = isTextAreaRequired
//     this.textarea_type = textarea_type
//     this.has_auto_observation = has_auto_observation
//   }

//   toMap(): Record<
//     string,
//     | number
//     | string
//     | number[]
//     | Record<string, string | number[] | number | Record<string, string>>
//     | Array<Record<string, string | number>>
//   > {
//     const data: Record<
//       string,
//       | number
//       | string
//       | number[]
//       | Record<string, string | number[] | number | Record<string, string>>
//       | Array<Record<string, string | number>>
//     > = {}
//     data['title'] = this.title
//     data['is_danger'] = this.is_danger
//     data['textarea_type'] = this.textarea_type
//     data['has_auto_observation'] = this.has_auto_observation.map((item) => ({
//       title: item.title,
//       is_danger: item.isDanger ? 1 : 0,
//       textarea_type: item?.isTextAreaRequired
//         ? item.textarea_type
//           ? TextAreaStatusEnum.required
//           : TextAreaStatusEnum.optional
//         : 0,
//       has_auto_observation: item.has_auto_observation ? 1 : 0,
//     }))
//     data['require_image'] = this.isImageRequired || 0
//     data['required_type'] = this.imageType || 0
//     return data
//   }


// }

