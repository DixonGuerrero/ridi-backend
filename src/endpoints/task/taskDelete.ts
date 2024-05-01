import {
  OpenAPIRoute,
  OpenAPIRouteSchema,
  Path,
} from "@cloudflare/itty-router-openapi";
import { Task } from "../../types";
import { TaskService } from "services/task.service";

export class TaskDelete extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    tags: ["Tasks"],
    summary: "Delete a Task",
    parameters: {
      id: Path(Number, {
        description: "Task id",
      }),
    },
    responses: {
      "200": {
        description: "Task was deleted successfully",
        schema: {
          success: Boolean,
          result: {
            message: "Task deleted successfully",
          },
        },
      },
      "404": {
        description: "Task not found",
        schema: {
          success: Boolean,
          message: "Task not found",
        },
      },
    },
  };

  async handle(
    request: Request,
    env: any,
    context: any,
    data: Record<string, any>
  ) {
    const { id } = data.params;

    const taskService = new TaskService();
    const task = await taskService.getTask(env, id);

    if (!task) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Task not found",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    await taskService.deleteTask(env, id);

    return new Response(
      JSON.stringify({
        success: true,
        result: {
          message: "Task deleted successfully",
        },
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  }
}
