var exec = require('child_process').exec;
var cmdStr = 'curl http://gank.io/api/day/2015/08/06';

exec(cmdStr, function(err, stdout, stderr) {
	if(err) {
		console.log(err + 'err: ');
		return;
	}
	var data = JSON.parse(stdout)
	console.log(stdout);

})
