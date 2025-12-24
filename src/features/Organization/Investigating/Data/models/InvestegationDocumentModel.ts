import type InvestegationDocumentMedaModel from "./InvestegationDocumentMedaModel"


export default class InvestigatingDocumentModel {
 public id: number
 public status: number
 public title: string
 public media: InvestegationDocumentMedaModel[]


  constructor(
    id: number,
    status: number,
    title: string,
    media: InvestegationDocumentMedaModel[]


  ) {
    this.id = id
    this.status = status
    this.title = title
    this.media = media


  }

  static fromMap(data: any): InvestigatingDocumentModel {
    return new InvestigatingDocumentModel(
    data.id,
    data.status,
    data.title,
    data.media,

    )
  }

  static example: InvestigatingDocumentModel = new InvestigatingDocumentModel(
    0,
    0,
    '',
    [],

  )
}



