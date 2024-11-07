import { Router } from 'express';
import container from '../dependency-injection';
import { CoursesPostController } from '../controllers/CoursesPostController';

export const registerCoursesRoutes = (): Router => {
  const router = Router();
  const coursesPostController: CoursesPostController = container.get(
    'Apps.Backoffice.Backend.controllers.CoursesPostController'
  );
  const coursesGetController: CoursesPostController = container.get(
    'Apps.Backoffice.Backend.controllers.CoursesGetController'
  );

  router.post('/courses', coursesPostController.run);
  router.post('/courses', coursesGetController.run);

  return router;
};
