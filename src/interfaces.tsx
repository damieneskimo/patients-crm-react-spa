export interface IUser {
  readonly id: number;
  name: string;
  email: string;
  token?: string
}

export interface IPatient extends IUser {
  gender: string;
  mobile: string;
}

export interface INote {
  readonly id: number,
  content: string,
  created_at: string
}
