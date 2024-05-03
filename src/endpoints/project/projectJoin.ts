import { OpenAPIRoute, OpenAPIRouteSchema } from "@cloudflare/itty-router-openapi";
import { ProjectService } from "services/project.service";
import { UserService } from "services/user.service";
import { ProjectMember, MemberJoinProject ,DefaultValue, Project } from "../../types";

export class JoinProject extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    tags: ["Projects"],
    summary: "Join a project using an invite code",
    requestBody: DefaultValue.MemberJoinProject,
    responses: {
      "200": {
        description: "Successfully joined the project",
        schema: {
          success: Boolean,
          message: String
        },
      },
      "400": {
        description: "Invalid request data",
        schema: {
          success: Boolean,
          message: String
        },
      },
      "404": {
        description: "User or project not found",
        schema: {
          success: Boolean,
          message: String
        },
      },
      "403": {
        description: "Incorrect invite code",
        schema: {
          success: Boolean,
          message: String
        },
      }
    },
  };

  async handle(request: Request, env: any, context: any, data: Record<string, any>) {
    try {
      const dataToJoin =  data.body as MemberJoinProject;


      const userService = new UserService();
      const projectService = new ProjectService();

      // Validate user existence
      const user = await userService.getUser(env, dataToJoin.user_id);
      if (!user) {
        return new Response(JSON.stringify({
          success: false,
          message: "User not found"
        }), { status: 404 });
      }

      // Validate invite code and get project
      const project = await projectService.getProjectByInviteCode(env, dataToJoin.invite_code) as Project;
      if (!project[0]) {
        return new Response(JSON.stringify({
          success: false,
          message: "Incorrect invite code"
        }), { status: 403 });
      }


       
      const projectMember : ProjectMember = { 
         project_id: project[0].project_id, 
         user_id: dataToJoin.user_id 
         }



         //Validate user is not already in project
         const isMember = await projectService.checkMemberProject(env, projectMember.project_id, projectMember.user_id);

         console.log(isMember);

         if (isMember) {
           return new Response(JSON.stringify({
             success: false,
             message: "User is already in project"
           }), { status: 403 });
         }

      // Add user to project (logic to be implemented in ProjectService)
      const result = await projectService.joinProject(env, projectMember);
        console.log(result);


      return new Response(JSON.stringify({
        success: true,
        message: "Successfully joined the project"
      }), { status: 200 });

    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        message: error.message || "Bad request"
      }), { status: 400 });
    }
  }
}
