import {
  OpenAPIRoute,
  OpenAPIRouteSchema,
} from "@cloudflare/itty-router-openapi";
import { MemberService } from "services/member.service";
import { UserService } from "services/user.service";
import { ProjectMember, DefaultValue } from "types";

export class MemberCheckInProject extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    tags: ["Members"],
    summary: "Check if a member is in a project",
    requestBody: DefaultValue.ProjectMember,
    responses: {
      "200": {
        description: "Member is in project",
        schema: {
          success: Boolean,
          message: "Member is in project",
        },
      },
      "404": {
        description: "Member is not in project",
        schema: {
          success: false,
          message: "Member is not in project",
        },
      },
    },
  };

  async handle(
    reques: Request,
    env: any,
    context: any,
    data: Record<string, any>
  ) {
    try {
      // Parse the request body JSON

      const dataToCkeck = data.body as ProjectMember;

      // Validate the project_id and user_id
      if (isNaN(dataToCkeck.project_id) || isNaN(dataToCkeck.user_id)) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "Invalid project_id or user_id",
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      //Validate exist user
      const user = new UserService();
      const isUser = await user.getUser(env, dataToCkeck.user_id);

      if (!isUser) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "User not found",
          }),
          {
            status: 404,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      const memberService = new MemberService();
      const isMember = await memberService.checkMemberProject(
        env,
        dataToCkeck.project_id,
        dataToCkeck.user_id
      );

      if (!isMember) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "Member not found in project",
          }),
          {
            status: 404,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Member is in project",
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          message: error.message || "Bad request",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }
}
