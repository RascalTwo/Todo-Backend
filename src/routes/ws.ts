import { Router } from 'express';
import { handleWebsocket } from '../controlers/Todo';

const router = Router();

router.ws('/:code', handleWebsocket);

export default router;
