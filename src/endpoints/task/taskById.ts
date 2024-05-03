import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
} from "@cloudflare/itty-router-openapi";
import { DefaultValue, Task } from "../../types";
import { TaskService } from "services/task.service";

export class TaskById extends OpenAPIRoute {
	static schema: OpenAPIRouteSchema = {
		tags: ["Tasks"],
		summary: "Get a single Task by id",
		parameters: {
			id: Path(Number, {
				description: "Task id",
			}),
		},
		responses: {
			"200": {
				description: "Returns a single task if found",
				schema: {
					success: Boolean,
					result: {
						task: DefaultValue.Task,
					},
				},
			},
			"404": {
				description: "Task not found",
				schema: {
					success: Boolean,
					error: String,
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
		// Retrieve the validated slug
		const { id } = data.params;

		// Implement your own object fetch here
		const taskService = new TaskService();
		const task = await taskService.getTask(env, id) as Task;

		// Check if task is found
		if (!task) {
			return new Response(JSON.stringify({
				success: false,
				error: "Task not found",
			}), {
				status: 404,
				headers: {
					"Content-Type": "application/json",
				},
			});
		}

		// Successful response

		return new Response(JSON.stringify({
			success: true,
			result: { task },
		}), {
			headers: {
				"Content-Type": "application/json",
			},
		});

		
	}
}
