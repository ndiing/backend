const Router = require("../../lib/router.js");

const router = new Router();

router.post("/", (req, res, next) => {
    res.json({ message: "blogs post" });
});
router.get("/:id", (req, res, next) => {
    res.json({ message: "blogs get" });
});
router.get("/", (req, res, next) => {
    res.json({ message: "blogs get" });
});
router.patch("/:id", (req, res, next) => {
    res.json({ message: "blogs patch" });
});
router.delete("/:id", (req, res, next) => {
    res.json({ message: "blogs delete" });
});
router.put("/:id", (req, res, next) => {
    res.json({ message: "blogs put" });
});

module.exports = router;
