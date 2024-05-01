import { User } from "types";
import { SupabaseConection } from "./supabase.service";

export class MemberService {
   //Function to get all members from project_id
   async getMembersProject(env: any, project_id: number): Promise<User[] | null> {
      const supabase = SupabaseConection.getInstance(env).getConection();
      const { data, error } = await supabase
         .from("project_members")
         .select("user_id")
         .eq("project_id", project_id);
      if (error) throw error;

      if (data.length === 0) {
         return null;
      }

      let members: User[] = [];
      for (let i = 0; i < data.length; i++) {
         const { data: user, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("user_id", data[i].user_id)
            .single();
         if (userError) throw userError;
         members.push(user);
      }

      return members;
   }

   //Function to Delete a member from project_id and user_id
   async deleteMemberProject(env: any, project_id: number, user_id: number) {
      const supabase = SupabaseConection.getInstance(env).getConection();
      const { data, error } = await supabase
         .from("project_members")
         .delete()
         .eq("project_id", project_id)
         .eq("user_id", user_id);
      if (error) throw error;
      return await new Response(JSON.stringify(data), {
         headers: {
            "Content-Type": "application/json",
         },
      }).json();
   }

// Function Check if member pertains to project
   async checkMemberProject(env: any, project_id: number, user_id: number): Promise<boolean> {
      const supabase = SupabaseConection.getInstance(env).getConection();
      const { data, error } = await supabase
         .from("project_members")
         .select("*")
         .eq("project_id", project_id)
         .eq("user_id", user_id);
      if (error) throw error;
      return data.length > 0;
   }

}