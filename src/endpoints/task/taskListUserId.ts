import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
} from "@cloudflare/itty-router-openapi";
import { DefaultValue, Task, User } from "../../types";
import { TaskService } from "services/task.service";
import { UserService } from "services/user.service";

export class TaskListUserId extends OpenAPIRoute {
	static schema: OpenAPIRouteSchema = {
		tags: ["Tasks"],
		summary: "Get list of tasks by user id",
		parameters: {
			user_id: Path(Number, {
				description: "User id",
			}),
		},
		responses: {
			"200": {
				description: "Returns a list of tasks if found",
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
		const { user_id } = data.params;

      //Validate user exists
      const userService = new UserService();
      const user = await userService.getUser(env, user_id) as User;

      if (!user) {
         return new Response(JSON.stringify({
             success: false,
             message: "User not found"
         }), {
             headers: { "Content-Type": "application/json" },
             status: 404
         });
     }     
     
     //get list task by user id
      const taskService = new TaskService();
      const tasks = await taskService.getTaskByIdUserAssign(env, user_id) ;

      console.log(tasks)

		
		if (!tasks) {
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
			result: { tasks },
		}), {
			headers: {
				"Content-Type": "application/json",
			},
		});

		
	}
}
