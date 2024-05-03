import { SupabaseConection } from "./supabase.service";
import { Image } from "../types";

export class ImagesService {
   async getImagesUser(env: any): Promise<Image[]> {
      const supabase = SupabaseConection.getInstance(env).getConection();
      const { data, error } = await supabase.from("images").select("*").eq("tipo", "user");
    if (error) throw error;
    return await new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    }).json();
   }

   async getImagesProject(env: any): Promise<Image[]> {
      const supabase = SupabaseConection.getInstance(env).getConection();
      const { data, error } = await supabase.from("images").select("*").eq("tipo", "project");
    if (error) throw error;
    return await new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    }).json();
   }

   async getImage(env: any, id: number): Promise<Image | null>{
      const supabase = SupabaseConection.getInstance(env).getConection();
      const { data, error } = await supabase.from("images").select("*").eq("image_id", id).maybeSingle();

      console.log(data)

    if (error) throw error;
    return await new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    }).json();
   }
}