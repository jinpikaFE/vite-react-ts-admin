import { setAuthority } from '@/utils/authority';
import { makeAutoObservable } from 'mobx';

export type CurrentUser = {
  avatar?: { uid: string; url: string }[];
  userName?: string;
  authority?: string | string[];
};

class Login {
  currentUser: CurrentUser | undefined = (localStorage.currentUser && JSON.parse(localStorage.currentUser)) || undefined;
  constructor() {
    makeAutoObservable(this);
  }

  saveCurrentUser = (val: CurrentUser) => {
    localStorage.currentUser = JSON.stringify(val);
    this.currentUser = val;
  };

  logout = () => {
    localStorage.clear();
    // 必须设置为空字符串，即存空数组否则权限全能访问
    setAuthority('');
  };
}
export const localeLogin = new Login();
