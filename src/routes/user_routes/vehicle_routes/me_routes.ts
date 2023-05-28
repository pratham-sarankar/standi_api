import express from "express";
import TokenMiddleware from "../../../middlewares/token_middleware";
import UserVehicleController from "../../../controllers/user_controllers/vehicle_controllers/user_vehicle_controller";

const router = express.Router();

const meRouter = express.Router();

meRouter.get("/", TokenMiddleware.authorize, UserVehicleController.fetchAll);
meRouter.post("/", TokenMiddleware.authorize, UserVehicleController.add);

router.use("/me", meRouter);

export default router;