const { Router } = require("express");
const { validateJWT } = require("../middlewares/authenticated");
const ctrl = require("../controllers/prospect");
const router = Router();

//[ http://localhost:3000/api/prospect ]
router.post("/create_call", [validateJWT], ctrl.create_call);
router.get("/read_calls/:id", [validateJWT], ctrl.read_calls);
router.post("/create_mail", [validateJWT], ctrl.create_mail);
router.get("/read_mails/:id", [validateJWT], ctrl.read_mails);

module.exports = router;
