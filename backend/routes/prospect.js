const { Router } = require("express");
const { validateJWT } = require("../middlewares/authenticated");
const ctrl = require("../controllers/prospect");
const router = Router();

//[ http://localhost:3000/api/prospect ]
router.post("/create", [validateJWT], ctrl.create_customer);

module.exports = router;
