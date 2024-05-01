import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
	Query,
} from "@cloudflare/itty-router-openapi";
import { TaskService } from "services/task.service";
import { Task, User } from "../../types";
import { UserService } from "services/user.service";

export class UserList extends OpenAPIRoute {
	static schema: OpenAPIRouteSchema = {
		tags: ["Users"],
		summary: "List Users",
		responses: {    
			"200": {
				description: "Returns a list of Users of the db",
				schema: {
					success: Boolean,
					result: {
						 users: {}
					},
				},
			},
			"404": {
				description: "Users not found",
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


		// Implement your own object fetch here
		const userService = new UserService();
		const tasks = await userService.getUsers(env) as User[];



		
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