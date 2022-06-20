const { Router } = require("express");
const { validateJWT } = require("../middlewares/authenticated");
const ctrl = require("../controllers/course");
const router = Router();

const multiparty = require("connect-multiparty");
const path = multiparty({ uploadDir: "./uploads/courses" });

//[ http://localhost:3000/api/course ]
router.post("/create", [validateJWT, path], ctrl.create_course);
router.get("/read", [validateJWT], ctrl.read_courses);
router.get("/read/:id", [validateJWT], ctrl.read_course_by_id);
router.put("/update/:id", [validateJWT, path], ctrl.update_course);
router.delete("/delete/:id", [validateJWT], ctrl.delete_course);
router.put("/status/:id", [validateJWT], ctrl.change_status);
router.get("/image/:img", ctrl.image);

router.post("/create_cycle", [validateJWT], ctrl.create_cycle);
router.get("/read_cycles/:id", [validateJWT], ctrl.read_cycles);

module.exports = router;
