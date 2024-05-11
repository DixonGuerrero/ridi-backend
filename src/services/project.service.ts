import { Project, ProjectMember } from "types";
import { SupabaseConection } from "./supabase.service";

export class ProjectService {
  async getProjectByIdUser(env: any, id: number): Promise<Project[]> {
    const supabase = SupabaseConection.getInstance(env).getConection();
    let { data, error } = await supabase
      .from("project_members")
      .select("project_id")
      .eq("user_id", id);
  
    if (error) throw error;
    return data as Project[];
  }

  async getLastProjectByUser(env: any, userId: number): Promise<Project> {
    const supabase = SupabaseConection.getInstance(env).getConection();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("created_by", userId)
      .order("project_id", { ascending: false }) // Asumiendo que 'id' es autoincremental
      .limit(1);

    if (error) throw error;
    return data[0]; // Retorna el último proyecto creado por el usuario
}

  
  async getProjectByCreatedId(env: any, id: number): Promise<Project[]> {
    const supabase = SupabaseConection.getInstance(env).getConection();
    let { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("created_by", id);
  
    if (error) throw error;
    return data as Project[];
  }
  

  async getProjectById(env: any, id: number): Promise<Project> {
    const supabase = SupabaseConection.getInstance(env).getConection();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("project_id", id);
    if (error) throw error;

    return await new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    }).json();
  }

  async createProject(env: any, project: Project, userId: number) {
    const supabase = SupabaseConection.getInstance(env).getConection();
  
    // Agregar código para generar invite_code
    project.invite_code = await this.generateCode();

  
    // Crear proyecto
    let { data: createdProjectData, error: createProjectError } = await supabase.from("projects").insert([project]);
    if (createProjectError) throw createProjectError;

  
    // Obtener el último proyecto creado por el usuario
    const lastProject = await this.getLastProjectByUser(env, userId);
    if (!lastProject) throw new Error("No project found after creation.");


  
    // Crear registro en project_members
    const projectMember = {
      project_id: lastProject.project_id,
      user_id: userId
    };

  
    const { error: memberError } = await supabase.from("project_members").insert([projectMember]);
    if (memberError) throw memberError;
  
    return lastProject; // Retorna el proyecto con la confirmación de que el miembro fue agregado
  }
  

  async updateProject(env: any, projectData: Project, id: number) {
    const supabase = SupabaseConection.getInstance(env).getConection();
    const { data, error } = await supabase
      .from("projects")
      .update(projectData)
      .eq("project_id", id);

    if (error) throw error;

    return await new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    }).json();
  }

  async deleteProject(env: any, id: number) {
    const supabase = SupabaseConection.getInstance(env).getConection();
    const { data, error } = await supabase
      .from("projects")
      .delete()
      .eq("project_id", id);
    if (error) throw error;
    return await new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    }).json();
  }

  //Created function to encrypt the name of the project for insert in the propiety "inivite_code"
  async generateCode(length = 13) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  //Function join project by invite code

  async getProjectByInviteCode(
    env: any,
    invite_code: string
  ): Promise<Project> {
    const supabase = SupabaseConection.getInstance(env).getConection();
    const { data, error } = await supabase
      .from("projects")
      .select("project_id")
      .eq("invite_code", invite_code);
    if (error) throw error;

    return await new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    }).json();
  }

  async joinProject(env: any, project_members: ProjectMember) {
    const supabase = SupabaseConection.getInstance(env).getConection();
    const { data, error } = await supabase
      .from("project_members")
      .insert([project_members]);

    if (error) throw error;
    return await new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    }).json();
  }

  //Check if user already is in the project
  async checkMemberProject(
    env: any,
    project_id: number,
    user_id: number
  ): Promise<boolean> {
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
