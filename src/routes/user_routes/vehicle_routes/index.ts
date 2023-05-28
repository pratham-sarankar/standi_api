import express from "express";
import me_routes from "./me_routes";

const router = express.Router();

const vehicleRouter = express.Router();

vehicleRouter.use(me_routes);

router.use("/vehicles", vehicleRouter);

export default router;