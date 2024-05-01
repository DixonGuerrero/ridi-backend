import {
   OpenAPIRoute,
   OpenAPIRouteSchema,
 } from "@cloudflare/itty-router-openapi";
 import { Login, UserLogin } from "../../types";
 import { UserService } from "services/user.service";
 import { SesionService } from "services/sesion.service";
 import { SignJWT } from 'jose'; // Importamos SignJWT de jose
 
 export class LoginR extends OpenAPIRoute {
   static schema: OpenAPIRouteSchema = {
     tags: ["Sesion"],
     summary: "Create a new Sesion",
     requestBody: Login,
     responses: {
       "201": {
         description: "Returns the Token for Sesion",
         schema: {
           success: Boolean,
           result: {
             token: String,  // Corregido typo 'toekn' a 'token'
           },
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
     try {
       const loginData = data.body as UserLogin;
       const sesionService = new SesionService();
       const userService = new UserService();
 
       // Validate user existence
       const user = await userService.getUserByEmail(env, loginData.email);
       if (!user) {
         return new Response(
           JSON.stringify({
             success: false,
             message: "User not found",
           }),
           { status: 404 }
         );
       }
 
       // Validate password
       const validatedPassword = await sesionService.comparePassword(
         loginData.password,
         user.password
       );
 
       if (!validatedPassword) {
         return new Response(
           JSON.stringify({
             success: false,
             message: "Incorrect password",
           }),
           { status: 403 }
         );
       }
 
       // Create Token using jose
       const encoder = new TextEncoder();
       const token = await new SignJWT({ user_id: user.user_id })
         .setProtectedHeader({ alg: 'HS256' })
         .setIssuedAt()
         .setExpirationTime('24h')  // Token expires in 24 hours
         .sign(encoder.encode(env.SECRET_KEY));
 
       // Successful response
       return new Response(
         JSON.stringify({ success: true, token }),
         {
           headers: { "Content-Type": "application/json" },
           status: 200,  // Using 201 as the token is being created successfully
         }
       );
     } catch (error) {
       // Error response
       return new Response(
         JSON.stringify({ success: false, message: error.message }),
         {
           headers: { "Content-Type": "application/json" },
           status: 400,
         }
       );
     }
   }
 }
 