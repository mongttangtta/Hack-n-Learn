import { Router } from 'express';

import authRoutes from './auth.routes.js';
import mypageRoutes from './mypage.routes.js';
import theroryRoutes from './theory.routes.js';
import problemRoutes from './problems.routes.js';
import historyRoutes from './history.routes.js';
import hintsRoutes from './hints.routes.js';
import rewardsRoutes from './rewards.routes.js';
import communityRoutes from './community.routes.js';
import rankingRoutes from './ranking.routes.js';
import adminRoutes from './admin.routes.js';
import mainRoutes from './main.routes.js';


import newsRoutes from './news.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/main', mainRoutes);
router.use('/mypage', mypageRoutes);
router.use('/admin', adminRoutes);
router.use('/community', communityRoutes);
router.use('/theory', theroryRoutes);
router.use('/news', newsRoutes);
router.use('/ranking', rankingRoutes);
router.use('/problems', problemRoutes);


router.use('/history', historyRoutes);
router.use('/hints', hintsRoutes);
router.use('/rewards', rewardsRoutes);


export default router;