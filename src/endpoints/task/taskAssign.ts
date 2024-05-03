import { OpenAPIRoute, OpenAPIRouteSchema } from "@cloudflare/itty-router-openapi";
import { MemberService } from "services/member.service";
import { ProjectService } from "services/project.service";
import { TaskService } from "services/task.service";
import { UserService } from "services/user.service";
import { DefaultValue, TaskAssignment } from "types";

export class TaskAssign extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    tags: ["Tasks"],
    summary: "Assign a task to a user",
    requestBody: DefaultValue.TaskAssignment,
    responses: {
      "200": {
        description: "Task successfully assigned to user",
        schema: {
          success: Boolean,
          message: "Task assigned successfully"
        },
      },
      "404": {
        description: "Task or user not found",
        schema: {
          success: false,
          message: "Task or user not found"
        },
      }
    },
  };

  async handle(reques: Request, env: any, context: any, data: Record<string, any> ) {
    try {
      // Parse the request body JSON
    
      const dataToAssign = data.body as TaskAssignment;
      

      console.log(dataToAssign.task_id);

      // Validate the task_id and user_id
      if (isNaN(dataToAssign.task_id) || isNaN(dataToAssign.user_id)) {
        return new Response(JSON.stringify({
          success: false,
          message: "Invalid task_id or user_id",
        }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      //Validate task exist
      const taskService = new TaskService();
      const existingTask = await taskService.getTask(env, dataToAssign.task_id);

      if (!existingTask) {
        return new Response(JSON.stringify({
          success: false,
          message: "Task not found",
        }), {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

       //Validate exist user
       const user = new UserService();
       const isUser =  await user.getUser(env, dataToAssign.user_id); 
 
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

      //Validate user
      
      const memberService = new MemberService();
      const isMember = await memberService.checkMemberProject(env, dataToAssign.task_id, dataToAssign.user_id);

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

      const dataAssignTask: TaskAssignment = { task_id: dataToAssign.task_id, user_id: dataToAssign.user_id };

      console.log(dataAssignTask)
      

      // Logic to assign the task to the user
      const isAssigned = await taskService.assignTask(env, dataAssignTask).catch((error) => error);

     

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
