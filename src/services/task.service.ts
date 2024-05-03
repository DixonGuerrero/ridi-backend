import { Task, TaskAssignment } from "types";
import { SupabaseConection } from "./supabase.service";

export class TaskService {
  async getTasks(env: any, id: number): Promise<Task[]> {
    const supabase = SupabaseConection.getInstance(env).getConection();
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("project_id", id);
    if (error) throw error;
    return await new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    }).json();
  }

  async createTask(env: any, task: Task) {
    const supabase = SupabaseConection.getInstance(env).getConection();
    console.log([task]);
    const { data, error } = await supabase.from("tasks").insert([task]);

    if (error) throw error;
    return await new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    }).json();
  }

  async updateTask(env: any, taskData: Task, id: number) {
    const supabase = SupabaseConection.getInstance(env).getConection();
    const { data, error } = await supabase
      .from("tasks")
      .update(taskData)
      .eq("task_id", id);

      console.log(data, error)
    if (error) throw error;

    return await new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    }).json();
  }

  async deleteTask(env: any, id: number) {
    const supabase = SupabaseConection.getInstance(env).getConection();
    const { data, error } = await supabase
      .from("tasks")
      .delete()
      .eq("task_id", id);
    if (error) throw error;
    return await new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    }).json();
  }

  async getTask(env: any, id: number): Promise<Task | null> {
    const supabase = SupabaseConection.getInstance(env).getConection();
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("task_id", id)
      .maybeSingle(); // Use maybeSingle to handle 0 or 1 result without errors

    if (error) {
      throw new Error(error.message);
    }

    return data; // Returns the task if found, otherwise null
  }

  async assignTask(env: any, dataAssign: TaskAssignment) {
    const supabase = SupabaseConection.getInstance(env).getConection();
    const { data, error } = await supabase
      .from("task_members")
      .insert([dataAssign]);

    if (error) throw error;
    return await new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    }).json();
  }
}
