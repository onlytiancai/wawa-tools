// ./node-functions/koa/[[default]].js
import Koa from 'koa';
import Router from '@koa/router';

const app = new Koa();
const router = new Router();

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

router.get('/hello-node-koa', async (ctx) => {
  ctx.body = { message: 'Hello from Koa on Node Functions!' };
});

app.use(router.routes());
app.use(router.allowedMethods());

// 必须导出 express 实例否则构建器不会将其识别为函数
export default app;