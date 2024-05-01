import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
} from "@cloudflare/itty-router-openapi";
import { Project } from "../../types";
import { ProjectService } from "services/project.service";

export class ProjectById extends OpenAPIRoute {
	static schema: OpenAPIRouteSchema = {
		tags: ["Projects"],
		summary: "Get a single Project by id",
		parameters: {
			id: Path(Number, {
				description: "Project id",
			}),
		},
		responses: {
			"200": {
				description: "Returns a single task if found",
				schema: {
					success: Boolean,
					result: {
						task: Project,
					},
				},
			},
			"404": {
				description: "Project not found",
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
		const projectService = new ProjectService();
		const task = await projectService.getProjectById(env, id) as Project;

		// Check if task is found
		if (!task) {
			return new Response(JSON.stringify({
				success: false,
				error: "Project not found",
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
