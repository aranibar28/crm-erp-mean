const { Router } = require("express");
const { validateJWT } = require("../middlewares/authenticated");
const ctrl = require("../controllers/customer");
const router = Router();

//[ http://localhost:3000/api/customer ]
router.post("/create", [validateJWT], ctrl.create_customer);
router.get("/read_customers/:filter?", [validateJWT], ctrl.read_customers);
router.get("/read/:id", [validateJWT], ctrl.read_customer_by_id);
router.put("/update/:id", [validateJWT], ctrl.update_customer);
router.delete("/delete/:id", [validateJWT], ctrl.delete_customer);
router.put("/status/:id", [validateJWT], ctrl.change_status);

router.get("/list_customers/:filter?", [validateJWT], ctrl.list_customers);

router.get("/confirm_email_verify/:token", ctrl.confirm_email_verify);
router.post("/login", ctrl.login_customer);

module.exports = router;
