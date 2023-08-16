import { AbstractActor } from "npm:@dapr/dapr";

export interface IUser {
  firstname: string;
  lastname: string;
  email: string;
}

export interface IUserActor {
  getProfile(email: string): Promise<IUser | null>;
  setProfile(user: IUser): Promise<void>;
}

export default class UserActor extends AbstractActor implements IUserActor {
  getProfile(email: string): Promise<IUser | null> {
    return this.getStateManager<IUser>().getState(email);
  }

  async setProfile(user: IUser): Promise<void> {
    await this.getStateManager().setState(user.email, user);
    await this.getStateManager().saveState();
  }

  /**
   * @override
   */
  async onActivate(): Promise<void> {
  }
}
