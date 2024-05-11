import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
} from "@cloudflare/itty-router-openapi";
import { User } from "../../types";
import { UserService } from "services/user.service";

export class UserByEmail extends OpenAPIRoute {
	static schema: OpenAPIRouteSchema = {
		tags: ["Users"],
		summary: "Get a single User by Email",
		parameters: {
			email: Path(String, {
				description: "user email",
			}),
		},
		responses: {
			"200": {
				description: "Returns a single user if found",
				schema: {
					success: Boolean,
					result: {
						user: {},
					},
				},
			},
			"404": {
				description: "User not found",
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
		const { email } = data.params;

		// Implement your own object fetch here
		const userService = new UserService();
		const user = await userService.getUserByEmail(env, email) as User;

		// Check if user is found
		if (!user) {
			return new Response(JSON.stringify({
				success: false,
				error: "User not found",
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
			 user ,
		}), {
			headers: {
				"Content-Type": "application/json",
			},
		});

		
	}
}
