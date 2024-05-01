import { jwtVerify } from 'jose';
import { UserService } from 'services/user.service';

// Middleware para verificar el token JWT
async function authenticate(request, env, context) {
    try {
        const token = request.headers.get("Authorization")?.split(" ")[1]; // Supone que el token viene en el formato "Bearer token"
        if (!token) {
            return new Response("Authorization token is missing", { status: 401 });
        }

        const { payload } = await jwtVerify(token, new TextEncoder().encode(env.SECRET_KEY), {
            algorithms: ['HS256']
        });

        // Validar si el token contiene el user_id
        if (!payload.user_id) {
           return new Response("Invalid token", { status: 403 });
        }

        // Validar la existencia del usuario
        const userService = new UserService();
        const user = await userService.getUser(env, Number(payload.user_id));

        if (!user) {
           return new Response("User not found", { status: 404 });
        }

        // Guardar información del usuario en el contexto
        context.user = user;

        return; // Continuar procesamiento sin retornar una respuesta, significando que la autenticación fue exitosa
    } catch (error) {
        return new Response(`Invalid token: ${error.message}`, { status: 403 });
    }
}

export { authenticate };
