import { OpenAPIRoute, OpenAPIRouteSchema } from "@cloudflare/itty-router-openapi";
import { User } from "../../types";
import { UserService } from "services/user.service";

import bcrypt from "bcryptjs";

export class UserCreate extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    tags: ["Users"],
    summary: "Create a new User",
    requestBody: User,
    responses: {
      "201": {
        description: "Returns the created user",
        schema: {
          success: Boolean,
          result: {
          message: String,
          },
        },
      },
    },
  };

  async handle(request: Request, env: any, context: any, data: Record<string, any>) {
    try {
      // Assume data.body is being passed correctly with necessary user details
      const userToCreate = data.body as User;

      // Validate required fields
      if (!userToCreate.name || !userToCreate.email || !userToCreate.password ) {
        return new Response(JSON.stringify({
          success: false,
          message: "Missing required fields. Ensure 'name', 'email' , 'password' are provided."
        }), {
          headers: { "Content-Type": "application/json" },
          status: 400
        });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      userToCreate.password = await bcrypt.hash(userToCreate.password, salt);
      

      // Create the user using the service
      const userService = new UserService();
      const createtouser = await userService.createUser(env, userToCreate);

      console.log(createtouser);

      // Successful response
      return new Response(JSON.stringify({ success: true, result: "OK" }), {
        headers: { "Content-Type": "application/json" },
        status: 201
      });
    } catch (error) {
      // Error response
      return new Response(JSON.stringify({ success: false, message: error.message }), {
        headers: { "Content-Type": "application/json" },
        status: 400
      });
    }
  }
}
