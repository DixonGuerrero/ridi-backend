import { OpenAPIRoute, OpenAPIRouteSchema } from "@cloudflare/itty-router-openapi";
import { DefaultValue,Task } from "../../types";
import { TaskService } from "services/task.service";

export class TaskCreate extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    tags: ["Tasks"],
    summary: "Create a new Task",
    requestBody: DefaultValue.Task,
    responses: {
      "201": {
        description: "Returns the created task",
        schema: {
          success: Boolean,
            task: DefaultValue.Task,
        },
      },
    },
  };

  async handle(request: Request, env: any, context: any, data: Record<string, any>) {
    try {
      // Assume data.body is being passed correctly with necessary task details
      const taskToCreate = data.body as Task;

      // Validate required fields
      if (!taskToCreate.name || !taskToCreate.description || !taskToCreate.priority || 
          !taskToCreate.due_date || !taskToCreate.project_id || !taskToCreate.assigned_user_id) {
        return new Response(JSON.stringify({
          success: false,
          message: "Missing required fields. Ensure 'name', 'description', 'priority', 'due_date', 'project_id', and 'assigned_user_id' are provided."
        }), {
          headers: { "Content-Type": "application/json" },
          status: 400
        });
      }

      // Create the task using the service
      const taskService = new TaskService();
      const createdTask = await taskService.createTask(env, taskToCreate);

      // Successful response
      return new Response(JSON.stringify({ success: true, result: "OK" }), {
        headers: { "Content-Type": "application/json" },
        status: 201,
       
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
