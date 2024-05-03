import { OpenAPIRoute, OpenAPIRouteSchema, Path } from "@cloudflare/itty-router-openapi";
import { DefaultValue,Task } from "../../types";
import { TaskService } from "services/task.service";

export class TaskPatch extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    tags: ["Tasks"],
    summary: "Update a new Task",
    parameters: {
      id: Path(Number, {
         description: "Task id",
      }),
   },
    requestBody: DefaultValue.Task ,                                                       
    responses: {
      "200": {
        description: "Returns the update task",
        schema: {
          success: Boolean,
          result: {
            task: DefaultValue.Task,
          },
        },
      },
    },
  };

  async handle(request: Request, env: any, context: any, data: Record<string, any>) {
    try {
        const { id } = data.params;
        const taskToUpdate = data.body as Task;

        const taskService = new TaskService();
        const existingTask = await taskService.getTask(env, id);
        if (!existingTask) {
            return new Response(JSON.stringify({
                success: false,
                message: "Task not found"
            }), {
                headers: { "Content-Type": "application/json" },
                status: 404
            });
        }

        const updatedTask = await taskService.updateTask(env, taskToUpdate, id);
/*         if (!updatedTask) {
            return new Response(JSON.stringify({
                success: false,
                message: "Task not updated"
            }), {
                headers: { "Content-Type": "application/json" },
                status: 400
            });
        }
 */
        return new Response(JSON.stringify({ success: true, result: updatedTask }), {
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