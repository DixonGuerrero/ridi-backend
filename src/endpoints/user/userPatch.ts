import { OpenAPIRoute, OpenAPIRouteSchema, Path } from "@cloudflare/itty-router-openapi";
import { DefaultValue, User } from "../../types";
import { UserService } from "services/user.service";

export class UserPatch extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    tags: ["Users"],
    summary: "Update a new User",
    parameters: {
      id: Path(Number, {
         description: "User id",
      }),
   },
    requestBody: DefaultValue.User ,                                                       
    responses: {
      "200": {
        description: "Returns the update User",
        schema: {
          success: Boolean,
          result: {
            task: DefaultValue.User,
          },
        },
      },
    },
  };

  async handle(request: Request, env: any, context: any, data: Record<string, any>) {
    try {
        const { id } = data.params;
        const userToUpdate = data.body as User;

        const userService = new UserService();

        // Check if user exists
        const existingUser = await userService.getUser(env, id);
        if (!existingUser) {
            return new Response(JSON.stringify({
                success: false,
                message: "User not found"
            }), {
                headers: { "Content-Type": "application/json" },
                status: 404
            });
        }

        //Check email is unique
         const email = userToUpdate.email;
         const user = await userService.checkEmail(env, email);

         if(user){
            return new Response(JSON.stringify({
                success: false,
                message: "Email already exists"
            }), {
                headers: { "Content-Type": "application/json" },
                status: 400
            });
         }

        const updatedUser = await userService.updateUser(env, userToUpdate, id);
/*         if (!updatedTask) {
            return new Response(JSON.stringify({
                success: false,
                message: "Task not updated"
            }), {
                headers: { "Content-Type": "application/json" },
                status: 400
            });
        }
 */
        return new Response(JSON.stringify({ success: true, result: updatedUser }), {
            headers: { "Content-Type": "application/json" },
            status: 200
        });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error.message }), {
            headers: { "Content-Type": "application/json" },
            status: 400
        });
    }
}
}