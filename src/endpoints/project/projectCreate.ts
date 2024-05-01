import { OpenAPIRoute, OpenAPIRouteSchema } from "@cloudflare/itty-router-openapi";
import { Project } from "../../types";
import { ProjectService } from "services/project.service";

export class ProjectCreate extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    tags: ["Projects"],
    summary: "Create a new Project",
    requestBody: Project,
    responses: {
      "201": {
        description: "Returns the created project",
        schema: {
          success: Boolean,
          result: {
            project: Project,
          },
        },
      },
    },
  };

  async handle(request: Request, env: any, context: any, data: Record<string, any>) {
    try {
      // Assume data.body is being passed correctly with necessary project details
      const projectToCreate = data.body as Project;

      // Validate required fields
      if (!projectToCreate.name || !projectToCreate.description || !projectToCreate.due_date || !projectToCreate.created_by) {
        return new Response(JSON.stringify({
          success: false,
          message: "Missing required fields. Ensure 'name', 'description', 'due_date', 'created_by' are provided."
        }), {
          headers: { "Content-Type": "application/json" },
          status: 400
        });
      }

      // Create the project using the service
      const projectService = new ProjectService();

      //Vamos a crear el invite_code 
      projectToCreate.invite_code =  await projectService.generateCode();

      const createdTask = await projectService.createProject(env, projectToCreate);

      // Successful response
      return new Response(JSON.stringify({ success: true, result: "OK" }), {
        headers: { "Content-Type": "application/json" },
        status: 201
      });
    } catch (error) {
      // Error response
      return new Response(JSON.stringify({ success: false, message: error.message }), {
        headers: { "Content-Type": "application/json" },
        status: 400
      });
    }
  }
}
