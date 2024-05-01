import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
	Query,
} from "@cloudflare/itty-router-openapi";
import { User } from "../../types";
import { MemberService } from "services/member.service";

export class MemberProject extends OpenAPIRoute {
	static schema: OpenAPIRouteSchema = {
		tags: ["Members to Project"],
		summary: "List membersProject",
		parameters: {
			project_id: Path(Number, {
				description: "Filter by project id",
				required: true,
			})	
		},
		responses: {    
			"200": {
				description: "Returns a list of members of the project",
				schema: {
					success: Boolean,
					result: {
						 members: {}
					},
				},
			},
			"404": {
				description: "Members not found in team or project not found.",
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

      //Validate the project_id
      if (isNaN(project_id)) {
         return new Response(JSON.stringify({
            success: false,
            error: "Invalid project_id"
         }), {
            status: 400,
            headers: {
               "Content-Type": "application/json"
            }
         });
      }

      // TODO: Validate Project exists



		// Implement your own object fetch here
		const memberService = new MemberService();
		const members = await memberService.getMembersProject(env, project_id) as User[];

      console.log(members)

		
		 // Check if tasks are found
		 if (members === null ) {
			return new Response(JSON.stringify({
				 success: false,
				 error: "No Members found for this project or project not found."
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
			members,
	  }), {
			headers: {
				 "Content-Type": "application/json"
			}
	  });
 }
}