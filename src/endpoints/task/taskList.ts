import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
	Query,
} from "@cloudflare/itty-router-openapi";
import { TaskService } from "services/task.service";
import { Task } from "../../types";

export class TaskList extends OpenAPIRoute {
	static schema: OpenAPIRouteSchema = {
		tags: ["Tasks"],
		summary: "List Tasks",
		parameters: {
			project_id: Path(Number, {
				description: "Filter by project id",
				required: true,
			})	
		},
		responses: {    
			"200": {
				description: "Returns a list of tasks of the project",
				schema: {
					success: Boolean,
					result: {
						 tasks: {}
					},
				},
			},
			"404": {
				description: "Tasks not found",
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

		// Retrieve the validated project_id
		const { project_id } = data.params;


		// TODO: Validate Project exists

		// Implement your own object fetch here
		const taskService = new TaskService();
		const tasks = await taskService.getTasks(env, project_id) as Task[];



		
		 // Check if tasks are found
		 if (tasks.length === 0) {
			return new Response(JSON.stringify({
				 success: false,
				 error: "No tasks found for this project or project not found."
			}), {
				 status: 404,
				 headers: {
					  "Content-Type": "application/json"
				 }
			});
	  }

	  // If tasks are found, return them
	  return new Response(JSON.stringify({
			success: true,
			tasks: tasks,
	  }), {
			headers: {
				 "Content-Type": "application/json"
			}
	  });
 }
}