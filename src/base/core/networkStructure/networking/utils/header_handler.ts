import {useUserStore} from "@/stores/user";

class HeaderHandler {
  private static _instance: HeaderHandler;

  private userStore = useUserStore();



  private constructor() {}

  static get  Instance(): HeaderHandler {
      if (!this._instance) {
        this._instance = new HeaderHandler();
      }
      return this._instance;
  }

  getHeader(isAuth = false, includeLanguage= true): { [key: string]: string } {
    const headers: { [key: string]: string } = {};
    const userStore = this.userStore; // Initialize the store here

    if (userStore?.user !== null) {
      const token: string | undefined = userStore?.user?.apiToken;
      if (isAuth) {
        headers['Authorization'] = 'Bearer ' + token;
      }
    }

    if (includeLanguage) {
      const savedLocale = localStorage.getItem('lang');
      if (savedLocale) {
        headers['Accept-Language'] = savedLocale;
      }
    } else {
      headers['Accept-Language'] = "*";
    }
    headers['Content-Type'] = 'application/json';
    headers['Accept'] = 'application/json';


    return headers;
  }
}

export default HeaderHandler;
