const { Router } = require("express");
const { validateJWT } = require("../middlewares/authenticated");
const ctrl = require("../controllers/inscription");
const router = Router();

//[ http://localhost:3000/api/inscription ]
router.post("/create_inscription", [validateJWT], ctrl.create_inscription);
router.get("/read_inscriptions_today", [validateJWT], ctrl.read_inscriptions_today);
router.get("/read_inscriptions_dates/:advisor/:from?/:to?", [validateJWT], ctrl.read_inscriptions_dates);
router.get("/send_invoice/:id", [validateJWT], ctrl.send_invoice);

module.exports = router;
