import { Router } from "express";
import { WebhookController } from "../controllers/WebhookController.js";

const router = Router();

router.post("/link-click", WebhookController.linkClick);
router.post("/email-open", WebhookController.emailOpen);
router.post("/rcs-click", WebhookController.rcsClick);
router.post("/payment", WebhookController.payment);
router.post("/complaint", WebhookController.complaint);

export default router;
