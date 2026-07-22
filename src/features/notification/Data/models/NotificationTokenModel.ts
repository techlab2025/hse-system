
export default class NotificationTokenModel  {
  public notificationSocketToken: string

  constructor( notificationSocketToken: string) {
    this.notificationSocketToken = notificationSocketToken

  }

  static fromMap(data: any): NotificationTokenModel {
    return new NotificationTokenModel(data.notification_socket_token)
  }

}
