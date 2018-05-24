const path = require('path');
const exec = require('child_process').exec;
const http = require('http');
const readline = require('readline');
const axios = require('axios');

const baseDeployUrl = 'http://192.168.3.112:9999/autopull/d/web/';

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.question('请输入要发布到test的分支: ', (branch) => {
	// TODO: Log the answer in a database
	_exec(branch);
	// rl.close();
});

const _exec = async (branch) => {
	// let branch = JSON.parse(process.env.npm_config_argv).cooked[2];
	let project = __dirname.split('\\')[__dirname.split('\\').length - 1];
	try {
		await deployStep('git checkout test', '切换test分支');
		await deployStep('git pull origin test', '更新test分支');
		await deployStep(`git merge ${branch}`, `合并${branch}分支到test分支`);
		await deployStep('npm run build:test', '打包');
		await deployStep('git add .', 'git add');
		await deployStep(`git commit -m "test"`, 'git commit');
		await deployStep('git push origin test', '发布');
		await deployStep(`git checkout ${branch}`, `切换${branch}分支`);
		updateRemote(project);
	}catch(err) {
		console.log(`\n${err}`);
		process.exit();
	}
}

const deployStep = (step, stateMsg) => {
	return new Promise((resolve, reject) => {	
		exec(step, {cwd: path.resolve(__dirname), maxBuffer: 5000 * 1024}, (error, stdout, stderr) => {
			if(error) {
				reject(`\n${stateMsg}：失败，Error: ${error}`);
			}
			console.log(`\n${stateMsg}成功`);
			resolve();
		})
	})
}

const updateRemote = async (project) => {
	try {
		let result = await axios.get(`${baseDeployUrl}${project}`);
	}catch(err) {
		console.log(`\n远程代码更新失败：${err}`);
		process.exit();
	}
	console.log(`\n远程代码更新成功`);
	process.exit();
}
