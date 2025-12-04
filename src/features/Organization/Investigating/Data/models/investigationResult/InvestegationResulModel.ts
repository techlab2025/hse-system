export default class InvestegationResultModel {
  public preventive: string
  public corrective: string

  constructor(preventive: string, corrective: string) {
    this.preventive = preventive
    this.corrective = corrective
  }

  static fromMap(data: any): InvestegationResultModel {
    return new InvestegationResultModel(data.id, data.date , data.observation, data.status , data.type)
  }
}


  // "id": 2,
  //           "observation": {
  //               "id": 1,
  //               "title": "Oil Spill Near Pump 3",
  //               "description": "Oil leaked from the pump due to loose valve",
  //               "image": "https://hse.localhost/storage/uploads/default/FSLyRYQHm1LzMfTKvnBMY7TTk0SyAx06eyLz9LEq.png",
  //               "is_action": 1,
  //               "task_result_item": null,
  //               "type": null,
  //               "type_id": null,
  //               "type_model": null,
  //               "equipment": {
  //                   "id": 1,
  //                   "title": "Caterpillar 320D Excavator",
  //                   "description": "Mid-size excavator by Caterpillar",
  //                   "all_industries": 1,
  //                   "equipment_type_id": null,
  //                   "industries": [],
  //                   "image": "https://hse.localhost/storage/uploads/default/xnlBWAene98sviqbkZ2jbvMZmaWe2i8bL0jrNDCr.png",
  //                   "certificate_image": "https://hse.localhost/storage/uploads/default/4xcs0inIjglQVc1q3dnwIctuTKGPNajYlu6NNmy9.png",
  //                   "date": "2025-01-10",
  //                   "status": 1,
  //                   "inspection_duration": "30 days",
  //                   "license_number": "LIC-552233",
  //                   "license_plate_number": "CAR-3321"
  //               },
  //               "location": null,
  //               "zoon": null,
  //               "project": null,
  //               "is_result": 0,
  //               "risk_level": 3,
  //               "save_status": 1,
  //               "action": "Cleaned the area",
  //               "is_near_miss": 1,
  //               "capa_status": 1,
  //               "date": "2025-01-01",
  //               "serial": "1",
  //               "observer": {
  //                   "id": 1,
  //                   "name": "IT World Employee",
  //                   "phone": "123123123",
  //                   "email": "it_world@itworld.com",
  //                   "is_master": 1,
  //                   "image": "https://hse.localhost/storage/uploads/default/sDfijnfaDN6yiEd9VaCtQl86Vt74APe56LWnBN8h.png",
  //                   "type": 2,
  //                   "api_token": null,
  //                   "languages": [
  //                       {
  //                           "id": 2,
  //                           "title": "Arabic",
  //                           "code": "ar"
  //                       }
  //                   ],
  //                   "permissions": []
  //               },
  //               "creator": {
  //                   "id": 1,
  //                   "name": "IT World Employee",
  //                   "phone": "123123123",
  //                   "email": "it_world@itworld.com",
  //                   "is_master": 1,
  //                   "image": "https://hse.localhost/storage/uploads/default/sDfijnfaDN6yiEd9VaCtQl86Vt74APe56LWnBN8h.png",
  //                   "type": 2,
  //                   "api_token": null,
  //                   "languages": [
  //                       {
  //                           "id": 2,
  //                           "title": "Arabic",
  //                           "code": "ar"
  //                       }
  //                   ],
  //                   "permissions": []
  //               },
  //               "capa": [
  //                   {
  //                       "preventive": "Tighten valve",
  //                       "corrective": "Replace damaged seal"
  //                   }
  //               ],
  //               "created_at": "2025-11-23T11:36:29.000000Z",
  //               "updated_at": "2025-11-23T11:36:29.000000Z"
  //           },
  //           "date": "2025-11-23",
  //           "status": 0,
  //           "type": 0
