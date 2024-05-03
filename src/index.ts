import { OpenAPIRouter } from "@cloudflare/itty-router-openapi";
import { TaskCreate } from "./endpoints/task/taskCreate";
import { TaskDelete } from "./endpoints/task/taskDelete";
import { TaskList } from "./endpoints/task/taskList";
import { TaskPatch } from "endpoints/task/taskPatch";
import { UserList } from "endpoints/user/userList";
import { UserById } from "endpoints/user/userById";
import { TaskById } from "endpoints/task/taskById";
import { UserCreate } from "endpoints/user/userCreate";
import { UserPatch } from "endpoints/user/userPatch";
import { MemberProject } from "endpoints/members/memberProject";
import { MemberRemove } from "endpoints/members/memberDelete";
import { ProjectListIdMember } from "endpoints/project/projectListIdMember";
import { ProjectCreate } from "endpoints/project/projectCreate";
import { ProjectPatch } from "endpoints/project/projectPatch";
import { ProjectDelete } from "endpoints/project/projectDelete";
import { ProjectById } from "endpoints/project/projectById";
import { JoinProject } from "endpoints/project/projectJoin";
import { LoginR } from "endpoints/sesion/login";
import { SignUpR } from "endpoints/sesion/signup"; 
import { authenticate } from "middleware/auth.middleware";
import { TaskAssign } from "endpoints/task/taskAssign";
import { ImagesById } from "endpoints/images/imagesById";
import { ImagesProjectList } from "endpoints/images/imagesProjectList";
import { ImagesUserList } from "endpoints/images/imagesUserList";
const router = OpenAPIRouter({
    docs_url: "/",
});

// Sesión
router.post("/api/login/", LoginR);
router.post("/api/signup/", SignUpR);

// Middleware de autenticación para rutas protegidas
 router.all('/api/*', async (request, env, context, next) => {
    if (['/api/login/', '/api/signup/'].includes(request.url)) {
        return next(); // Permite que la ruta continue si es login o signup
    }
    return authenticate(request, env, context) || next(); // Aplica autenticación a otras rutas
}); 

// Tareas
router.get("/api/tasks/:project_id", TaskList);
router.post("/api/task/", TaskCreate);
router.get("/api/task/:id/", TaskById);
router.delete("/api/task/:id/", TaskDelete);
router.patch("/api/task/:id/", TaskPatch);
router.post("/api/task/assign/", TaskAssign);

// Proyectos
router.get("/api/projects/:user_id", ProjectListIdMember);
router.post("/api/project/", ProjectCreate);
router.post("/api/project/join/", JoinProject);
router.get("/api/project/:id/", ProjectById);
router.delete("/api/project/:id/", ProjectDelete);
router.patch("/api/project/:id/", ProjectPatch);

// Usuarios
router.get("/api/users/", UserList);
router.post("/api/user/", UserCreate);
router.get("/api/user/:id/", UserById);
router.patch("/api/user/:id/", UserPatch);

// Miembros
router.get("/api/members/:project_id", MemberProject);
router.delete('/api/project-member/remove', MemberRemove);

//Imagenes 
router.get("/api/images/:id/", ImagesById);
router.get("/api/imagesProject/", ImagesProjectList);
router.get("/api/imagesUser/", ImagesUserList);


// 404 para todo lo demás
router.all("*", () => new Response(JSON.stringify({
    success: false,
    error: "Route not found",
}), { status: 404 }));

export default {
    fetch: router.handle,
};
