import { User } from "types";
import { SupabaseConection } from "./supabase.service";

export class UserService {
  //Function to get all users
  async getUsers(env: any): Promise<User[]> {
    const supabase = SupabaseConection.getInstance(env).getConection();
    const { data, error } = await supabase.from("users").select("*");
    if (error) throw error;
    return await new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    }).json();
  }

  //Function to get user by id
  async getUser(env: any, id: any): Promise<User | null> {
    const supabase = SupabaseConection.getInstance(env).getConection();
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", id)
      .maybeSingle(); // Use maybeSingle to handle 0 or 1 result without errors

    if (error) {
      throw new Error(error.message);
    }

    return data; // Returns the task if found, otherwise null
  }

  //Function to create a user
  async createUser(env: any, user: User) {
    const supabase = SupabaseConection.getInstance(env).getConection();
    const { data, error } = await supabase.from("users").insert([user]);

    if (error) throw error;
    return await new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    }).json();
  }

   //Function to update a user
   async updateUser(env: any, userData: User, id: number) {
      const supabase = SupabaseConection.getInstance(env).getConection();
      const { data, error } = await supabase
         .from("users")
         .update(userData)
         .eq("user_id", id);
   
      if (error) throw error;
   
      return await new Response(JSON.stringify(data), {
         headers: {
         "Content-Type": "application/json",
         },
      }).json();
   }

   //Function to delete a user
   async deleteUser(env: any, id: number) {
      const supabase = SupabaseConection.getInstance(env).getConection();
      const { data, error } = await supabase
         .from("users")
         .delete()
         .eq("user_id", id);
      if (error) throw error;
      return await new Response(JSON.stringify(data), {
         headers: {
         "Content-Type": "application/json",
         },
      }).json();
   }

   //Function chech if email is already in use
   async checkEmail(env: any, email: string): Promise<Boolean | null> {
      const supabase = SupabaseConection.getInstance(env).getConection();
      const { data, error } = await supabase
         .from("users")
         .select("*")
         .eq("email", email)
         .maybeSingle(); // Use maybeSingle to handle 0 or 1 result without errors
      console.log(data)
      if (error) {
         throw new Error(error.message);
      }
   
      if(data) return true
      
      return false; // Returns the task if found, otherwise null
   }

   async getUserByEmail(env: any, email: string): Promise<User | null> {
      const supabase = SupabaseConection.getInstance(env).getConection();
      const { data, error } = await supabase
         .from("users")
         .select("*")
         .eq("email", email)
         .maybeSingle(); // Use maybeSingle to handle 0 or 1 result without errors
   
      if (error) {
         throw new Error(error.message);
      }
   
      return data; // Returns the task if found, otherwise null
   }
}
