import { Router } from "express";
import { CreateMaterialController } from "../controllers/private/materials/createMaterial.controller.js";
import { GetAllMaterialsController } from "../controllers/private/materials/getAllMaterials.controller.js";
import { UpdateMaterialController } from "../controllers/private/materials/updateMaterial.controller.js";
import { DeleteMaterialController } from "../controllers/private/materials/deleteMaterial.controller.js";
import { GetMaterialByIdController } from "../controllers/private/materials/getMaterial.controller.js";
const materialRouter = Router();

const createMaterialController = new CreateMaterialController();
const getAllMaterialsController = new GetAllMaterialsController();
const getMaterialByIdController = new GetMaterialByIdController();
const updateMaterialController = new UpdateMaterialController();
const deleteMaterialController = new DeleteMaterialController();


materialRouter.get("/materials" , getAllMaterialsController.run);
materialRouter.get("/material/:id" , getMaterialByIdController.run)
materialRouter.post("/create-material" , createMaterialController.run);
materialRouter.patch("/material/:id" , updateMaterialController.run);
materialRouter.delete("/material/:id" , deleteMaterialController.run);


export { materialRouter }

