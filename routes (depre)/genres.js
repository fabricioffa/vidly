const router = require("express").Router();
const controller = require('../controllers/genre')

router.get("/", controller.index);
router.get("/:id", controller.showOne);
router.post("/", controller.register);
router.put("/:id", controller.edit);
router.delete("/:id", controller.delete);

module.exports = router;
