import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
	Query,
} from "@cloudflare/itty-router-openapi";
import { TaskService } from "services/task.service";
import { Image } from "../../types";
import { ImagesService } from "services/images.service";

export class ImagesById extends OpenAPIRoute {
	static schema: OpenAPIRouteSchema = {
		tags: ["Images"],
		summary: "List Images",
		parameters: {
			id: Path(Number, {
				description: "Filter by images id",
				required: true,
			})	
		},
		responses: {    
			"200": {
				description: "Returns a list of images of the project",
				schema: {
					success: Boolean,
					result: {
						 images: {}
					},
				},
			},
			"404": {
				description: "Images not found",
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
		const { id } = data.params;

		console.log(id)
		// Implement your own object fetch here
      const imagesService = new ImagesService();
		const image = await imagesService.getImage(env, id) as Image;

		console.log(image)


		
		 // Check if images are found
		 if (!image) {
			return new Response(JSON.stringify({
				 success: false,
				 error: "No images found"
			}), {
				 status: 404,
				 headers: {
					  "Content-Type": "application/json"
				 }
			});
	  }

	  // If images are found, return them
	  return new Response(JSON.stringify({
			success: true,
			images: image,
	  }), {
			headers: {
				 "Content-Type": "application/json"
			}
	  });
 }
}