import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
} from "@cloudflare/itty-router-openapi";
import { Image , DefaultValue } from "../../types";
import { ImagesService } from "services/images.service";

export class ImagesUserList extends OpenAPIRoute {
	static schema: OpenAPIRouteSchema = {
		tags: ["Images"],
		summary: "List Images by User",
		responses: {    
			"200": {
				description: "Returns a list of Images of the db",
				schema: {
					success: Boolean,
					result: {
						 images: DefaultValue.Image
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
		env: any,
		context: any,
	) {

		console.log('Aqui voy 1')

		// Implement your own object fetch here
		const imagesService = new ImagesService();
		const images = await imagesService.getImagesUser(env) as Image[];

		console.log('Aqui voy')

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

	  console.log('Aqui voy 2')

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