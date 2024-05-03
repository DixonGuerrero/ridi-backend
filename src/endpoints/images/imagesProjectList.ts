import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
	Query,
} from "@cloudflare/itty-router-openapi";
import { Image } from "../../types";
import { ImagesService } from "services/images.service";

export class ImagesProjectList extends OpenAPIRoute {
	static schema: OpenAPIRouteSchema = {
		tags: ["Images"],
		summary: "List Images to Project",
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
				description: "Images to Project not found",
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


		// Implement your own object fetch here
		const imagesService = new ImagesService();
		const images = await imagesService.getImagesProject(env) as Image[];



		
		 // Check if images are found
		 if (images.length === 0) {
			return new Response(JSON.stringify({
				 success: false,
				 error: "No images found for this project or project not found."
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
			images: images,
	  }), {
			headers: {
				 "Content-Type": "application/json"
			}
	  });
 }
}