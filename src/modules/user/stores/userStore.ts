import { makeAutoObservable } from 'mobx';

class UserStore {
  user = null;

  constructor() {
    makeAutoObservable(this);
  }

  setUser(user: any) {
    this.user = user;
  }
}

export default new UserStore();
