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
router.get("/read_cycle_by_id/:id/:id_cycle", [validateJWT], ctrl.read_cycle_by_id);
router.get("/read_current_cycles/:id", [validateJWT], ctrl.read_current_cycles);
router.get("/read_expired_cycles/:id", [validateJWT], ctrl.read_expired_cycles);
router.put("/update_cycle/:id", [validateJWT], ctrl.update_cycle);
router.post("/add_rooms_cycle", [validateJWT], ctrl.add_rooms_cycle);
router.delete("/del_rooms_cycle/:id", [validateJWT], ctrl.del_rooms_cycle);
router.put("/change_status_cycle/:id", [validateJWT], ctrl.change_status_cycle);

router.get("/list_instructors_room/:id", [validateJWT], ctrl.list_instructors_room);
router.post("/add_instructor_room", [validateJWT], ctrl.add_instructor_room);
router.delete("/del_instructor_room/:id", [validateJWT], ctrl.del_instructor_room);

module.exports = router;
