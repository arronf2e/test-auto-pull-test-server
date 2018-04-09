const fs = require('fs');
const path = require('path');

const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

const nodemailer = require('nodemailer');
const rp = require('request-promise');

// 使用child_process来执行shell命令
const exec = require('child_process').exec;

const _exec = (diskName, folderName, sysName) => {
	return new Promise((resolve, reject) => {
		exec('git checkout test', {cwd: path.resolve(diskName + ':/' + folderName + '/' + sysName)}, (err, stdout, stderr) => {
			exec('git pull origin test', {cwd: path.resolve(diskName + ':/' + folderName + '/' + sysName)}, (error, stdout, stderr) => {
				if(error) {
					reject(error);
				}
				resolve(stdout);
			})
		})
	})
}

// 邮件发送配置
const config = {
	host: "smtp.163.com", // 主机
	secureConnection: true, // 使用 SSL
	port: 465, // SMTP 端口 
	auth: {
		user: 'arronf2e@163.com',
		pass: 'zhanghao2202' // 注意这个不是邮箱的登录密码，是第三方授受密码！！！！
	}
}

const _sendMail = (sysName, html) => {
	let options = {
		from: 'arronf2e@163.com', //  这里一定要和上面的邮箱保持一致！！！
		to: '191446367@qq.com',
		subject: sysName + ' test pull successful !',
		html: html
	}
	const transporter = nodemailer.createTransport(config);
	return new Promise((resolve, reject) => {
		transporter.sendMail(options, (err, info) => {
			if(err) {
				reject(err);
			}
			resolve(info)
		})
	})
}

const _sendTodd = (sysName, html) => {
	return new Promise((resolve, reject) => {
		let options = {
			method: 'POST',
			uri: 'https://oapi.dingtalk.com/robot/send?access_token=4b16bad73a375131b842c7124134463c785fb37a96098c35e4998a9d8f4b6bea',
			headers: {
				'Content-Type': 'application/json'
			},
			body: {
				'msgtype': 'text',
				'text': {
					'content': sysName + ' test pull successful!' + '\n' + html
				}
			},
			json: true // Automatically stringifies the body to JSON
		};
		rp(options)
			.then(body => {
				resolve(body)
			})
			.catch(err => {
				reject(err)
			});
	})
}

router.get('/', (ctx, next) => {
	ctx.body = 'hello world';
})

router.get('/autopull/:disk/:folder/:sys', async(ctx, next) => {
	let sysName = ctx.params.sys,
		folderName = ctx.params.folder,
		diskName = ctx.params.disk;
	let data = await _exec(diskName, folderName, sysName);
	let sendToddResult = await _sendTodd(sysName, data);
	ctx.body = sendToddResult;
	// let sendResult = await _sendMail(sysName, data);
	// ctx.body = sendResult;
})

app.use(router.routes())
   .use(router.allowedMethods());

app.listen(9999, () => {
	console.log('Server is running at port 9999!')
});
