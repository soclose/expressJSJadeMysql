var express = require('express');
var mysql   = require('mysql');
var http    = require('http');

var app     = express();

app.set('port', 4000);
app.set('views', 'views');
app.set('view engine', 'jade');

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

var connect = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'db_contoh'
});   

app.get('/', function(req, res){
	connect.query('select * from data_mahasiswa', function(err, rows){
		if(err){
		    res.send('an error received');
		} else {
		   	res.render('index', {'title' : 'List Data Mahasiswa', data : rows});	
		}
	});
});

app.get('/input', function(req, res){
	res.render('input_data', {'title' : 'Input Data Mahasiswa'});	
});

app.post('/save', function(req, res){
	var	nama   	= req.body.nama,
		alamat 	= req.body.alamat,
		telp	= req.body.telp,
		jk		= req.body.jk;
		
		connect.query('insert into data_mahasiswa(nama_mahasiswa,alamat,telp,jenis_kelamin)values(?,?,?,?);',[nama,alamat,telp,jk], function(err){
			if(err){
				res.send('an error accoured');
			} else {
			    res.redirect('/');
			}
		});
});

app.get('/edit/:id', function(req, res){
	var id = req.params.id;
	connect.query('select * from data_mahasiswa where nim = ?;',[id], function(err, rows){
		if(err){
			res.send('an error accoured');
		} else {
		    res.render('edit_data', {'title' : 'Edit Data Mahasiswa', data : rows});
		}
	});
});

app.post('/update', function(req, res){
	var	nim		= req.body.nim,
		nama	= req.body.nama,
		alamat	= req.body.alamat,
		telp	= req.body.telp,
		jk		= req.body.jk;
		
	connect.query('update data_mahasiswa set nama_mahasiswa = ?, alamat = ?, telp = ?, jenis_kelamin = ? where nim = ?;', [nama,alamat,telp,jk,nim], function(err){
		if(err){
			res.send('an error accoured');
		} else {
			res.redirect('/');
		}
	})
});

app.get('/delete/:id', function(req, res){
	var id	= req.params.id;
	connect.query('delete from data_mahasiswa where nim = ?;',[id], function(err){
		if(err){
			res.send('an error accoured');
		} else {
			res.redirect('/');
		}
	});
});

app.listen(app.get('port'));
console.log('Server listening on the port ' + app.get('port'));
