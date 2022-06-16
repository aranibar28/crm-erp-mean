const { Router } = require("express");
const { validateJWT } = require("../middlewares/authenticated");
const ctrl = require("../controllers/collaborator");
const router = Router();

//[ http://localhost:3000/api/collaborator ]
router.post("/create", [validateJWT], ctrl.create_collaborator);
router.get("/read", [validateJWT], ctrl.read_collaborators);
router.get("/read/:id", [validateJWT], ctrl.read_collaborator_by_id);
router.put("/update/:id", [validateJWT], ctrl.update_collaborator);
router.delete("/delete/:id", [validateJWT], ctrl.delete_collaborator);
router.put("/status/:id", [validateJWT], ctrl.change_status);
router.get("/list_advisors", [validateJWT], ctrl.list_advisors);

router.post("/login", ctrl.login_collaborator);

module.exports = router;
