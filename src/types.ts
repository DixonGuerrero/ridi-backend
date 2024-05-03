import { DateTime, Num, Str } from "@cloudflare/itty-router-openapi";

// Valores por defecto utilizando la biblioteca itty-router-openapi
export const DefaultValue = {
  Task: {
    name: new Str({ example: "lorem" }),
    description: new Str({ example: "lorem" }),
    due_date: DateTime,
    estado: new Str({ example: "por hacer" }),
    priority: new Str({ example: "baja" }),
    project_id: new Num({ example: 1 }),
    assigned_user_id: new Num({ example: 1 }),
  },
  User: {
    name: new Str({ example: "nuevo" }),
    email: new Str({ example: "email@gmail.com" }),
    password: new Str({ example: "password" }),
    phone: new Str({ example: "1234567890", required: false }),
  },
  Project: {
    name: new Str({ example: "lorem" }),
    description: new Str({ example: "lorem" }),
    due_date: DateTime,
    created_by: new Num({ example: 1 }),
  },
  MemberJoinProject: {
    user_id: new Num({ example: 1 }),
    invite_code: new Str({ example: "invite_code" }),
  },
  Login: {
    email: new Str({ example: "example@gmail.com" }),
    password: new Str({ example: "password" }),
  },
  SignUp: {
    name: new Str({ example: "name" }),
    email: new Str({ example: "example@gmail.com" }),
    password: new Str({ example: "password" }),
  },
  TaskAssignment: {
    task_id: new Num({ example: 1 }),
    user_id: new Num({ example: 1 }),
  },
  ProjectMember: {
    project_id: new Num({ example: 1 }),
    user_id: new Num({ example: 1 }),
  },
  Image: {
    image_id: new Num({ example: 1 }),
    tipo: new Str({ example: "tipo" }),
    url: new Str({ example: "url" }),
  },
};

// Enumerados para el estado y la prioridad de las tareas
export enum TaskStatus {
  PorHacer = 'por hacer',
  EnProgreso = 'en progreso',
  Completado = 'completado',
}

export enum TaskPriority {
  Baja = 'baja',
  Media = 'media',
  Alta = 'alta',
}

// Interfaces
export interface Project {
  project_id?: number;
  name: string;
  description: string;
  due_date: Date;
  image?: number;
  invite_code?: string;
  created_by: number;
}

export interface Task {
  task_id?: number;
  name: string;
  description: string;
  due_date: Date | string;
  estado?: TaskStatus;
  priority: TaskPriority;
  project_id: number;
  assigned_user_id: number;
}

export interface User {
  user_id?: number;
  name: string;
  phone?: string;
  email?: string;
  password: string;
  image?: number;
}

export interface ProjectMember {
  project_id: number;
  user_id: number;
}

export interface TaskAssignment {
  task_id: number;
  user_id: number;
}

export interface MemberJoinProject {
  user_id: number;
  invite_code: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserSignUp {
  name: string;
  email: string;
  password: string;
}

export interface Image {
  image_id: number;
  tipo: string;
  url: string;
}
