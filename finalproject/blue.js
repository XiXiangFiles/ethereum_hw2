const serial = require('serialport');
const { exec } = require('child_process');
let dateTime = require('node-datetime');
const request=require('request');
let dt = dateTime.create();
let formatted = dt.format('Y-m-d H:M:S');

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
			let data=buf.split(',');
			let heartbeat="0";
			let spo2="0";
			try{
				heartbeat=Math.ceil(parseFloat(data[2]));
				spo2=data[2].split('.');
				spo2=spo2[1];
			}catch(err){
				console.log(err);
			}
			
			console.log({form:{useraddress:'0xC63F2f5c83C6154a0Ed234623377304caC366A5C',heartbeat:heartbeat,spo2:spo2}});
			request.put('http://140.119.163.196/device/updatehealthdata', {form:{useraddress:'0xC63F2f5c83C6154a0Ed234623377304caC366A5C',heartbeat:heartbeat,spo2:spo2}},function(err,httpResponse,body){
				if(!err){
					// console.log(body);
				}else{
					// console.log(err);
				}
			});
			buf="";
		}
		buf += data.toString('ascii');
	});
  },1000);
});
