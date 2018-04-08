const fs = require('fs');

const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

// 使用child_process来执行shell命令
const exec = require('child_process').exec;

const _exec = cmd => {
	return new Promise((resolve, reject) => {
		exec('git pull', {cwd: '../event'}, (err, stdout, stderr) => {
			exec(cmd, {cwd: '../event'}, (error, stdout, stderr) => {
				if(err) {
					reject(err);
				}
				// let data = '';
				// const readableStream = fs.createReadStream('git.log');
				// readableStream.setEncoding('utf8');
				// readableStream.on('data', chunk => {
				// 	data += chunk;
				// })
				// readableStream.on('end', () => {
				// 	resolve(data);
				// })
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
	let cmd = 'cd d:/projects/' + sysName;
	let data = await _exec(cmd);
	ctx.body = data;
})

app.use(router.routes())
   .use(router.allowedMethods());

app.listen(9999);
