import { ApiNames } from '@/base/core/networkStructure/apiNames'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'

class AddCatalogItemsApiService extends ServicesInterface {
  // هنا انا بخزن النسخه بتاعه الكلاس في الانستنس
  // بنخزن النسخة الوحيدة من الكلاس (Singleton instance)
  private static instance: AddCatalogItemsApiService


  private constructor() {
     // هنا بمنع ان حد برا الكلاس يعمل اوبجكت جديد
    super() // Ensure this does not call any uninitialized methods or properties
  }

  static getInstance() { 
     // هنا انا بشيك لو مفيش انستنت يعمل اوبجكت جديد 
    if (!this.instance) {
      this.instance = new AddCatalogItemsApiService()
    }
    //  هنا انا برجع الاوبجكت
    return this.instance
  }

  async applyService(params: Params): Promise<{ data: any; statusCode: number }> {
    // هنا دي فانكشن معموله جهزا جوا و متهندله انا ينادي عليها علشان انا ورثها و بستخدم الحاجه الي انا عوزها منها 
    return await super.call({
      url: ApiNames.instance.CreateCatalogItems,
      type: CrudType.POST,
      auth: true,
      params: params,
      showLoadingDialog: true,
    })
  }
}

export { AddCatalogItemsApiService }
