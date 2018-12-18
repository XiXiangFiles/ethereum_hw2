const serial = require('serialport');
const { exec } = require('child_process');
exec(`sudo rfcomm connect hci0 "98:D3:34:90:B3:0D"`, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  setTimeout(function(){
  	let port = new serial('/dev/rfcomm0',{
		 baudRate: 9600
	});
	let buf="";
	port.on('data',function(data){
		let str = data.toString('ascii'); 
		if(data.toString('ascii').includes('\n')){
			console.log(buf);
			buf="";
		}
		buf += data.toString('ascii');
	});
  },1000)
});
