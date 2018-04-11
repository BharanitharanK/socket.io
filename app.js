var express=require('express');
var app=express();
var http=require('http');
var ejs = require('ejs');
app.use(express.static('web'));
var server=http.createServer(app);
var io=require('socket.io')(server);
var name="";
app.set('views',__dirname+'/views');
app.set('view engine', 'ejs');
app.get('/',function(req,res){
    res.sendFile(__dirname+'/web/index.html');
})
app.post('/chat',function(req,res){
    res.render('chat',{username:name});
    console.log(name);
})
app.get('/chat',function(req,res){
    res.redirect('/');
})
server.listen(process.env.PORT || 8080);
var con=[];
io.on('connection',function(socket){
    socket.on('check',function(username){
        val=check(username)
        if(val===-1)
        {
            name=username;
            socket.emit('success');
        }
        else
        {
            socket.emit('failure');
        }
    })
    socket.on('chat',function(data){
        connect(socket.id,data.user);
        console.log(socket.id,data.user);
        socket.broadcast.emit('message',data);
        socket.emit('message',data);
        socket.broadcast.emit('online',con);
        socket.emit('online',con);
    })
    socket.on('disconnect', function() {
        for(x in con){
        if(con[x].id==socket.id){
           socket.broadcast.emit('unplug',{data:con[x].name});
           console.log('disconnet'+socket.id);
           delete con[x];
        }
       }
    socket.broadcast.emit('online',con);
    socket.emit('online',con);
    })
})
function connect(id,uname){
    key=0;
    for(x in con){
       if(con[x].name===uname){
           con[x].id=id;
           key=1;
       }
    }
    if(key===0)
    {
        con.push({id:id,name:uname});
        console.log(con);
    }
}
function check(username){
    key=-1;
    for(x in con){
        if(con[x].name===username){
           key=1;
       }
    }
    return key;
}