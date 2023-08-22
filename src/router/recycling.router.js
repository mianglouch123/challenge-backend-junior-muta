import { Router } from "express";
import { OptimalRecyclingController } from "../controllers/private/optimalRoutes/calculateOptimalRouteMaterials.js";

const recyclingRouter = Router();

const optimalRecyclingController = new OptimalRecyclingController();


recyclingRouter.post("/create-recycling-route" , optimalRecyclingController.run);


export { recyclingRouter }



