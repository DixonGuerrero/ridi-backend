import { UserLogin, UserSignUp } from "types";
import { SupabaseConection } from "./supabase.service";
import bcrypt from "bcryptjs";

export class SesionService {
  async signUp(env: any, dataToSingUp: UserSignUp): Promise<any> {
    const supabase = SupabaseConection.getInstance(env).getConection();
    const { data, error } = await supabase.from("users").insert([dataToSingUp]);

    if (error) throw error;
    return await new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    }).json();
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
