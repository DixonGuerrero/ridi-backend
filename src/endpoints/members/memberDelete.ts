import { OpenAPIRoute, OpenAPIRouteSchema } from "@cloudflare/itty-router-openapi";
import { MemberService } from "services/member.service";
import { UserService } from "services/user.service";
import { ProjectMember } from "types";

export class MemberRemove extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    tags: ["Projects"],
    summary: "Remove a member from a project",
    requestBody: ProjectMember,
    responses: {
      "200": {
        description: "Member successfully removed from project",
        schema: {
          success: Boolean,
          message: "Member removed successfully"
        },
      },
      "404": {
        description: "Project or member not found",
        schema: {
          success: false,
          message: "Project or user not found"
        },
      }
    },
  };

  async handle(reques: Request, env: any, context: any, data: Record<string, any> ) {
    try {
      // Parse the request body JSON
    
      const dataToDelete = data.body as ProjectMember;
      

      console.log(dataToDelete.project_id);

      // Validate the project_id and user_id
      if (isNaN(dataToDelete.project_id) || isNaN(dataToDelete.user_id)) {
        return new Response(JSON.stringify({
          success: false,
          message: "Invalid project_id or user_id",
        }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      //Validate user and project exist

      //TODO: Validar proyecto

      //Validate user
      
      const memberService = new MemberService();
      const isMember = await memberService.checkMemberProject(env, dataToDelete.project_id, dataToDelete.user_id);

      if (!isMember) {
        return new Response(JSON.stringify({
          success: false,
          message: "Member not found in project",
        }), {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      //Validate exist user
      const user = new UserService();
      const isUser =  await user.getUser(env, dataToDelete.user_id); 

      if (!isUser) {
        return new Response(JSON.stringify({
          success: false,
          message: "User not found",
        }), {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }


      // Logic to remove the member from the project
      const isRemoved = await memberService.deleteMemberProject(env, dataToDelete.project_id, dataToDelete.user_id).catch((error) => error);

      console.log(isRemoved);

     

      return new Response(JSON.stringify({
        success: true,
        message: "Member removed successfully",
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }); 

    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        message: error.message || "Bad request",
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }
}
