import { Router } from "express";

const router = Router();

router.post("/api/users/signout", (req, res, next) => {
    try {
        req.session = null;
        res.status(200).json({
            message: "Successfully Signed Out",
        });
    } catch (err) {
        next(err);
    }
});

// export { router as currentuserRouter };
export default router;
