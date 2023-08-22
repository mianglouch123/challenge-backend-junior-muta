import { Router } from "express";
import { CreateCollectionController } from "../controllers/private/collections/createCollections.controller.js";
import { GetCollectionsController } from "../controllers/private/collections/getCollections.controller.js";
import { DeleteCollectionController } from "../controllers/private/collections/deleteCollection.controller.js";
import { UpdateCollectionController } from "../controllers/private/collections/updateCollection.controller.js";
import { GetCollectionByIdController } from "../controllers/private/collections/getCollection.controller.js";

const collectionRouter = Router();

const getCollectionsController = new GetCollectionsController();
const getCollectionByIdController = new  GetCollectionByIdController()
const createCollectionController = new  CreateCollectionController();
const deleteCollectionController = new DeleteCollectionController();
const updateCollectionController = new UpdateCollectionController();



collectionRouter.get("/collections" , getCollectionsController.run)
collectionRouter.get("/collection/:collectionId" , getCollectionByIdController.run);
collectionRouter.patch("/collection/:collectionId" , updateCollectionController.run)
collectionRouter.post("/create-collection" , createCollectionController.run)
collectionRouter.delete("/collection/:collectionId" , deleteCollectionController.run)

export {collectionRouter}

