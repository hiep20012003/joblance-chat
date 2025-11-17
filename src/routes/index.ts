import {Application} from 'express';
import {createVerifyGatewayRequest} from '@hiep20012003/joblance-shared';
import {config} from '@chats/config';
import {initialContextMiddleware} from '@chats/middlewares/context.middleware';

import {healthRoutes} from './health.route';
import {messageRoutes} from './message.route';

const BASE_PATH = '/api/v1';

export const appRoutes = (app: Application) => {
    app.use(initialContextMiddleware);
    app.use('', healthRoutes.routes());
    app.use(BASE_PATH, createVerifyGatewayRequest(`${config.GATEWAY_SECRET_KEY}`), messageRoutes.routes());
};
