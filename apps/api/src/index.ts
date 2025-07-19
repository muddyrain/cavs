import Koa from 'koa';

const app = new Koa();

app.use(async (ctx) => {
  ctx.body = 'Hello Koa2 + TypeScript!';
});

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
