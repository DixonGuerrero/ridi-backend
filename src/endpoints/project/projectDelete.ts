import { OpenAPIRoute, OpenAPIRouteSchema, Path } from "@cloudflare/itty-router-openapi";
import { ProjectService } from "services/project.service";
import { Project,  } from "types"; // Asegúrate de tener definido este tipo correctamente en tus tipos.

export class ProjectDelete extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    tags: ["Projects"],
    summary: "Remove a project",
    parameters: {
			id: Path(Number, {
				description: "Project id",
			}),
		},
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
    const { id } = data.params;

    const projectService = new ProjectService();
    //Ckeck if project exists
    const project = await projectService.getProjectById(env, id) as Project;

    if (!project) {
      return new Response(JSON.stringify({
        success: false,
        message: "Project not found"
      }), {
        headers: { "Content-Type": "application/json" },
        status: 404
      });

    }

    //Result of the deletion
    const result = await projectService.deleteProject(env, id);


    return new Response(JSON.stringify({ success: true, message: "Project removed successfully" }), {
      headers: { "Content-Type": "application/json" },
      status: 200
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
