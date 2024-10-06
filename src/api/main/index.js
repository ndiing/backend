const Router = require("@ndiinginc/router");

const router = new Router();

router.post("/", (req, res, next) => {
    res.json({
        params: req.params,
        query: req.query,
        body: req.body,
        cookies: req.cookies,
        message: "post",
    });
});
router.get("/:id", (req, res, next) => {
    res.json({
        params: req.params,
        query: req.query,
        body: req.body,
        cookies: req.cookies,
        message: "get",
    });
});
router.get("/", (req, res, next) => {
    res.json({
        message: "get",
    });
});
router.patch("/:id", (req, res, next) => {
    res.json({ message: "patch" });
});
router.delete("/:id", (req, res, next) => {
    res.json({ message: "delete" });
});
router.put("/:id", (req, res, next) => {
    res.json({ message: "put" });
});

module.exports = router;
