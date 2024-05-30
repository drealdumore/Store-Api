import express from "express";
import * as adminController from "../controllers/adminController.js";

const router = express.Router();

router.route("/").get(adminController.getAllAdmin);

router.route("/:id").get(adminController.getAdmin);
router.route("/:id").patch(adminController.updateAdmin);
router.route("/:id").delete(adminController.deleteAdmin);

export default router;
