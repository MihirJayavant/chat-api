export interface IUser {
  username: string
  firstname: string
  lastname: string
}

export interface IUserAddApiModel extends IUser {
  password: string
}

export interface IUserGetApiModel extends IUser {
  createdAt: Date
  updatedAt: Date
  role: string
}

export interface IUserEntity extends IUserGetApiModel {
  password: string
}
