const fs = require('fs');
const path = require('path');

const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

// 使用child_process来执行shell命令
const exec = require('child_process').exec;

const _exec = sysName => {
	return new Promise((resolve, reject) => {
		exec('git checkout test', {cwd: path.resolve('d:/projects/' + sysName)}, (err, stdout, stderr) => {
			exec('git pull origin test', {cwd: path.resolve('d:/projects/' + sysName)}, (error, stdout, stderr) => {
				if(error) {
					reject(error);
				}
				resolve('success')
			})
		})
	})
}

router.get('/', (ctx, next) => {
	ctx.body = 'hello world';
})

router.get('/autopull/:sys', async(ctx, next) => {
	let sysName = ctx.params.sys;
	let data = await _exec(sysName);
	ctx.body = data;
})

app.use(router.routes())
   .use(router.allowedMethods());

app.listen(9999);
