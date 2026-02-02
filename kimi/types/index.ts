export type User = {
  _id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type Thing = {
  _id: string;
  thing: string;
  who: string;
  why?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateThingInput = {
  thing: string;
  who: string;
  why?: string;
};

export type UpdateThingInput = CreateThingInput;

export type LoginInput = {
  email: string;
  password: string;
};

export type SignupInput = LoginInput;

export type UpdatePasswordInput = {
  currentPassword: string;
  newPassword: string;
};