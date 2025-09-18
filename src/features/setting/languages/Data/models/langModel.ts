import TitleInterface from "@/base/Data/Models/title_interface";
import ClientCategoryModel from "@/features/dashboard/settings/clientCategory/Data/models/index_client_category_model";

export default class LangModel extends TitleInterface {
  public id: number;
  public title: string;
  public description: string;
  public code: string;

  constructor(
    id: number,
    title: string,
    description: string,
    code: string,
  ) {
    super({ id, title, subtitle });

    this.description = description;
    this.code = code;
  }

  static fromMap(data: any): LangModel {
    return new LangModel(
      data.id,
      data.title,
      data.description,
      data.code,
    );
  }
}
