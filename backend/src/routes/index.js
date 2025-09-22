import { Router } from 'express';

import authRoutes from './auth.routes.js';
import usersRoutes from './users.routes.js';
import theroryRoutes from './theory.routes.js';
import problemRoutes from './problems.routes.js';
import historyRoutes from './history.routes.js';
import hintsRoutes from './hints.routes.js';
import rewardsRoutes from './rewards.routes.js';
import communityRoutes from './community.routes.js';
import statsRoutes from './stats.routes.js';
import adminRoutes from './admin.routes.js';
import mainRoutes from './main.routes.js';

import newsRoutes from './news.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/main', mainRoutes);
router.use('/users', usersRoutes);
router.use('/admin', adminRoutes);
router.use('/community', communityRoutes);
router.use('/theory', theroryRoutes);
router.use('/problems', problemRoutes);
router.use('/history', historyRoutes);
router.use('/hints', hintsRoutes);
router.use('/rewards', rewardsRoutes);
router.use('/stats', statsRoutes);

router.use('/news', newsRoutes);

export default router;