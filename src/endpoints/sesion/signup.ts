import { OpenAPIRoute, OpenAPIRouteSchema } from "@cloudflare/itty-router-openapi";
import { UserSignUp , DefaultValue } from "../../types";
import { SesionService } from "../../services/sesion.service";
import bcrypt from 'bcryptjs';
import { UserService } from "services/user.service";


export class SignUpR extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    tags: ["Sesion"],
    summary: "Create a new Account",
    requestBody: DefaultValue.SignUp,
    responses: {
      "201": {
        description: "Returns the created Account",
        schema: {
          success: Boolean,
          result: String,
      },
    },
  } 
}

  async handle(request: Request, env: any, context: any, data: Record<string, any>) {
    try {
      // Assume data.body is being passed correctly with necessary task details
      const signUpData = data.body as UserSignUp;

      // Validate required fields
      if (!signUpData.name || !signUpData.email || !signUpData.password ) {
        return new Response(JSON.stringify({
          success: false,
          message: "Missing required fields. Ensure 'name', 'email' , 'password' are provided."
        }), {
          headers: { "Content-Type": "application/json" },
          status: 400
        });
      }

      //Validate email exist
      const userService = new UserService();
      const emailExist = await userService.getUserByEmail(env, signUpData.email);

      if (emailExist) {
        return new Response(JSON.stringify({
          success: false,
          message: "Email already exist"
        }), {
          headers: { "Content-Type": "application/json" },
          status: 400
        });
      }

      
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      signUpData.password = await bcrypt.hash(signUpData.password, salt);
      // Create the user using the service
      const sesionService = new SesionService();

      const createtoaccount = await sesionService.signUp(env, signUpData).catch((error) => error);

      console.log(createtoaccount);
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
