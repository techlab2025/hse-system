import LocationEnum from "../../Core/Enum/LocationEnum"
export default class RoutHandler<LocationEnum> {
  private static instance: RoutHandler
  static getInstance() {
    if (!this.instance) {
      this.instance = new RoutHandler()
    }
    return this.instance
  }


 constructor(){

 }
}
