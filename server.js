var express = require('express'); // require express
var app = express(); // make object from express called app
var server = require('http').createServer(app);  // create http server over app which is express
var io = require('socket.io').listen(server); // make socket io listen to the sever w just created

// list of users and connections
users = [];
connections =  []; 

//make the server list to port 3000 which means this application will accessed by http://localhost:3000/
server.listen(process.env.PORT || 3000);
console.log('Server running... ');

//make the frontend reads from index.html file
app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html');
});


// here is our work for sockets

// if the socket on connection 
io.sockets.on('connection', function(socket){

    // add this sockect connection to the connections list 
    connections.push(socket);
   // console.log(connections.lenght);
    console.log('Connected: %s sockets connected', connections.length);
    

    // for Disconnect
    socket.on('disconnect',function(data){
        //if(!socket.username) return ; 

        // remove the disconnected user from the list 
        users.splice(users.indexOf(socket.username),1);
        // function to update the users list
        updateUsernames();

        // remoove the disconnected socket from the list 
        connections.splice(connections.indexOf(socket),1);
        console.log('Disconnected: %s sockets connected',connections.length);

    });

    // here is the recieved data from the frontend for the message
    socket.on('send message',function(data){
        console.log(data);
        // send it back for display it in the 'chat' div
        io.sockets.emit('new message', {user: socket.username, msg: data});
    });

    // here is the recieved user name from the frontend 'login screen'
    socket.on('new user',function(data,callback){
        callback(true);
        socket.username = data;
        //add the user name to the users list
        users.push(socket.username);

        updateUsernames(); 
    });

    function updateUsernames(){
        // send the updated users list to the front end
        io.sockets.emit('get users',users);
    }
});