import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import productsRouter from "./products";
import ordersRouter from "./orders";
import reservationsRouter from "./reservations";
import reviewsRouter from "./reviews";
import contactRouter from "./contact";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(productsRouter);
router.use(ordersRouter);
router.use(reservationsRouter);
router.use(reviewsRouter);
router.use(contactRouter);
router.use(adminRouter);

export default router;
