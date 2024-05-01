//Esta endpoint devuelve una lista de proyectos basados en un id de un miembro

import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
	Query,
} from "@cloudflare/itty-router-openapi";
import { ProjectService } from "services/project.service";
import { Project } from "../../types";
import { UserService } from "services/user.service";

export class ProjectListIdMember extends OpenAPIRoute {
	static schema: OpenAPIRouteSchema = {
		tags: ["Projects"],
		summary: "List Projects by Member",
		parameters: {
			user_id: Path(Number, {
				description: "Filter by user id",
				required: true,
			})	
		},
		responses: {    
			"200": {
				description: "Returns a list of Projects of the member",
				schema: {
					success: Boolean,
					result: {
						 projects: [Project]
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
		const { user_id } = data.params;

      //Validate user_id
      if (isNaN(user_id)) {
         return new Response(JSON.stringify({
            success: false,
            error: "Invalid user_id"
         }), {
            status: 400,
            headers: {
               "Content-Type": "application/json"
            }
         });
      }

      //Validate user exists
      const userService = new UserService();
      const user = await userService.getUser(env, user_id);

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
		
		// Implement your own object fetch here
		
      const projectService = new ProjectService();
      const projects = await projectService.getProjectByIdUser(env, user_id);


		
		 // Check if tasks are found
		 if (projects.length === 0) {
			return new Response(JSON.stringify({
				 success: false,
				 error: "Not projects found for this user"
			}), {
				 status: 404,
				 headers: {
					  "Content-Type": "application/json"
				 }
			});
	  }

     console.log(projects)

     // En un array vamos a devolver los proyectos, entonces vamos a iterar el array de proyectos el cual contiene los id de los proyectos y vamos a consultarlos a la db y vamos a devolver un array de proyectos

       const  listProjects = await Promise.all(projects.map(async (project) => {
            return await projectService.getProjectById(env, project.project_id);
          })) as Project[];
	  // If tasks are found, return them
	  return new Response(JSON.stringify({
			success: true,
			projects: listProjects,
	  }), {
			headers: {
				 "Content-Type": "application/json"
			}
	  });
 }
}