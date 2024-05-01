import {
   OpenAPIRoute,
   OpenAPIRouteSchema,
   Path,
 } from "@cloudflare/itty-router-openapi";
 import { User } from "../../types";
 import { UserService } from "services/user.service";
 
 export class UserDelete extends OpenAPIRoute {
   static schema: OpenAPIRouteSchema = {
     tags: ["Users"],
     summary: "Delete a User",
     parameters: {
       id: Path(Number, {
         description: "User id",
       }),
     },
     responses: {
       "200": {
         description: "User was deleted successfully",
         schema: {
           success: Boolean,
           result: {
             message: "User deleted successfully",
           },
         },
       },
       "404": {
         description: "User not found",
         schema: {
           success: Boolean,
           message: "User not found",
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
     const { id } = data.params;
 
     const userService = new UserService();
     const user = await userService.getUser(env, id);
 
     if (!user) {
       return new Response(
         JSON.stringify({
           success: false,
           message: "user not found",
         }),
         {
           status: 404,
           headers: {
             "Content-Type": "application/json",
           },
         }
       );
     }
 
     await userService.deleteUser(env, id);
 
     return new Response(
       JSON.stringify({
         success: true,
         result: {
           message: "User deleted successfully",
         },
       }),
       {
         headers: {
           "Content-Type": "application/json",
         },
         status: 200,
       }
     );
   }
 }
 