import { OpenAPIRoute, OpenAPIRouteSchema, Path } from "@cloudflare/itty-router-openapi";
import { Project } from "../../types";
import { ProjectService } from "services/project.service";

export class ProjectPatch extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    tags: ["Projects"],
    summary: "Update a new Project",
    parameters: {
      id: Path(Number, {
         description: "Project id",
      }),
   },
    requestBody: Project ,                                                       
    responses: {
      "200": {
        description: "Returns the update task",
        schema: {
          success: Boolean,
          result: {
            task: Project,
          },
        },
      },
    },
  };

  async handle(request: Request, env: any, context: any, data: Record<string, any>) {
    try {
        const { id } = data.params;
        const projectToCreate = data.body as Project;

        const projectService = new ProjectService();
        const existingProject = await projectService.getProjectById(env, id);
        if (!existingProject) {
            return new Response(JSON.stringify({
                success: false,
                message: "Project not found"
            }), {
                headers: { "Content-Type": "application/json" },
                status: 404
            });
        }

        const updatedProject = await projectService.updateProject(env, projectToCreate, id);
/*         if (!updatedProject) {
            return new Response(JSON.stringify({
                success: false,
                message: "Project not updated"
            }), {
                headers: { "Content-Type": "application/json" },
                status: 400
            });
        }
 */
        return new Response(JSON.stringify({ success: true, result: updatedProject }), {
            headers: { "Content-Type": "application/json" },
            status: 200
        });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error.message }), {
            headers: { "Content-Type": "application/json" },
            status: 400
        });
    }
}
}