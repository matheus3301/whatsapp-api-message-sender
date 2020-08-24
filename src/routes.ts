import {Router} from "express"
import MessagesController from "./controllers/MessagesController";

const routes = Router();
const messagesController = new MessagesController();

routes.post("/message", messagesController.create );

export default routes;
