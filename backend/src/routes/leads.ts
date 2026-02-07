import { Router } from "express";
import { LeadController, uploadMiddleware } from "../controllers/LeadController.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.use(authMiddleware);

router.get("/", LeadController.list);
router.get("/stats", LeadController.stats);
router.get("/:id", LeadController.getById);
router.patch("/:id/color", LeadController.updateColor);
router.post("/:id/observation", LeadController.addObservation);
router.post("/import", uploadMiddleware, LeadController.importFile);
router.post("/:id/call", LeadController.triggerCall);
router.post("/:id/whatsapp", LeadController.triggerWhatsApp);
router.post("/batch-action", LeadController.batchAction);

export default router;
