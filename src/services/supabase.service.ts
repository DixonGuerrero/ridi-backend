import { SupabaseClient, createClient } from "@supabase/supabase-js";

export class SupabaseConection {
  private static instance: SupabaseConection;

  supabase: SupabaseClient<any, "public", any>;
  private constructor(env:any) {
    // Inicializar el Singleton
    this.supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);
  }

  public static getInstance(env:any): SupabaseConection {
    // Si la instancia no existe, crear una nueva instancia
    if (!SupabaseConection.instance) {
      SupabaseConection.instance = new SupabaseConection(env);
    }
    // Devolver la instancia existente
    return SupabaseConection.instance;
  }

  public getConection(): SupabaseClient<any, "public", any> {
    return this.supabase;
}
}