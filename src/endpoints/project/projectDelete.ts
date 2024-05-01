import { OpenAPIRoute, OpenAPIRouteSchema } from "@cloudflare/itty-router-openapi";
import { ProjectService } from "services/project.service";
import { UserService } from "services/user.service";
import { Project, ProjectMember } from "types"; // Asegúrate de tener definido este tipo correctamente en tus tipos.

export class ProjectRemove extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    tags: ["Projects"],
    summary: "Remove a project",
    requestBody: ProjectMember, // Asume que tienes un tipo Project que incluye project_id y user_id
    responses: {
      "200": {
        description: "Project successfully removed",
        schema: {
          success: Boolean,
          message: "Project removed successfully"
        },
      },
      "404": {
        description: "Project or user not found",
        schema: {
          success: false,
          message: "Project or user not found"
        },
      }
    },
  };

  async handle(request: Request, env: any, context: any, data: Record<string, any> ) {
    try {
      const dataToDelete = data.body as ProjectMember;

      // Validate the project_id and user_id
      if (isNaN(dataToDelete.project_id) || isNaN(dataToDelete.user_id)) {
        return new Response(JSON.stringify({
          success: false,
          message: "Invalid project_id or user_id",
        }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      // Validate that the user exists and has permissions to delete the project
      const userService = new UserService();
      const user = await userService.getUser(env, dataToDelete.user_id);

      if (!user) {
        return new Response(JSON.stringify({
          success: false,
          message: "User not found",
        }), {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      // Validate that the project exists
      const projectService = new ProjectService();
      const project = await projectService.getProjectById(env, dataToDelete.project_id);


      if (!project[0]) {
        return new Response(JSON.stringify({
          success: false,
          message: "Project not found",
        }), {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

     

      if (project[0].created_by !== dataToDelete.user_id) {
        return new Response(JSON.stringify({
          success: false,
          message: "Unauthorized to delete this project",
        }), {
          status: 403,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      // Logic to remove the project
      const isRemoved = await projectService.deleteProject(env, dataToDelete.project_id).catch((error) => error);

      

      return new Response(JSON.stringify({
        success: true,
        message: "Project removed successfully",
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });

    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        message: error.message || "Bad request",
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }
}
