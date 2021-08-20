import { Router } from 'express';
import { currentUser } from '@rktickets2000/common';

const router = Router();

router.get('/api/users/currentuser', currentUser, (req, res, _next) => {
	res.send({
		currentUser: req.currentUser || null,
	});
});

// export { router as currentuserRouter };
export default router;
