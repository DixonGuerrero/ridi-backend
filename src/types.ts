import { DateTime, Num, Str } from "@cloudflare/itty-router-openapi";

export const Task = {
  name: new Str({ example: "lorem" }),
  priority: new Num({ example: 1, required: false }),
  description: new Str({ required: false }),
  project_id: new Num({ example: 1, required: false }),
  assigned_user_id: new Num({ example: 1, required: false }),
  due_date: Date,
};

export const User = {
  name: new Str({ example: "nuevo" }),
  email: new Str({ example: "email@gmail.com" }),
  password: new Str({ example: "password" }),
  phone: new Str({ example: "1234567890", required: false }),
  image_url: new Str({
    example: "https://example.com/image.jpg",
    required: false,
  }),
};

export const ProjectMember = {
  project_id: new Num({ example: 1 }),
  user_id: new Num({ example: 1 }),
};

export const Project = {
  name: new Str({ example: "lorem" }),
  description: new Str({ example: "lorem" }),
  due_date: Date,
  created_by: new Num({ example: 1 }),
  photo_url: new Str({
    example: "https://example.com/image.jpg",
    required: false,
  }),
};

export const MemberJoinProyect = {
  user_id: new Num({ example: 1 }),
  invite_code: new Str({ example: "invite_code" }),
};

export const Login = {
  email: new Str({ example: "example@gmail.com" }),
  password: new Str({ example: "password" }),
};

export const SignUp = {
  name: new Str({ example: "name" }),
  email: new Str({ example: "example@gmail.com" }),
  password: new Str({ example: "password" }),
};


//Interfaces

export interface Project {
  project_id?: number;
  name: string;
  description: string;
  due_date: Date;
  photo_url?: string;
  invite_code?: string;
  created_by: number;
}


export interface Task {
  task_id?: number;
  name: string;
  description: string;
  due_date: Date | string; // Usar `string` si la fecha viene en formato ISO de la API
  priority: number;
  project_id: number;
  assigned_user_id: number;
}

export interface User {
  user_id?: number;
  name: string;
  phone?: string;
  email: string;
  password: string;
  image_url?: string;
}

export interface ProjectMember {
  project_id: number;
  user_id: number;
}

export interface TaskAssignment {
  task_id: number;
  user_id: number;
}

export interface MemberJoinProyect {
  user_id: number;
  invite_code: string;
}

// Types from sesion Endpoints

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserSignUp {
  name: string;
  email: string;
  password: string;
}
