var http = require('http');
var route = require('router');
var bodyParser = require('body-parser');

var router = new route(); 
var server = http.createServer( function( req, res ){

    router( req, res, function( error ){
        if ( !error ){
            res.writeHead(404);    
        }
        else{   
            res.writeHead(400);       
        }
        res.end( 'HELLO' );
    });
});

server.listen( 8080, function(){
    console.log( 'Listening on port 8080...' );
});


var database = {};
var count = 0;

router.use( bodyParser.json() );

function createUser( request, response ){
    var user = request.body;
    var id = count+= 1;
    database[id] = user;
    console.log( 'Create user' + id + user );
    response.writeHead(201,{
        'Content-Type' : 'application/json' ,
        'Location' : '/api/users/' + id
    })
    response.end( JSON.stringify(user) );
}

router.post('/api/users', createUser);


function readUser( request, response ){
    var id = request.params.id,
        user = database[ id ];
 
    if( typeof user !== 'object' ){
        console.log( 'User not found', id );
        response.writeHead( 404 );
        response.end( '' );
        return;
    }
 
    console.log( 'Read User' + id + user);
 
    response.writeHead( 200, {
        'Content-Type' : 'application/json'
    });
    response.end( JSON.stringify(user) );
}
router.get( '/api/users/:id', readUser );




function updateUser( request, response ){
    var id = request.params.id;
    var user = request.body;

    if( typeof database[ id ] !== 'object' ){
        console.log( 'User not found', id );
        response.writeHead( 404 );
        response.end( '' );
        return;
    }
    
    console.log( 'Update user' + id + user );
 
    database[ id ] = user;
    response.writeHead( 201, {
        'Content-Type' : 'application/json',
        'Location' : '/api/users/' + id
    });
    response.end( JSON.stringify(user) );
}
router.put( '/api/users/:id', updateUser );


function readUsers( request, response ){
    var user;
    var userList = [];
 
    for( id in database ){
    if( !database.hasOwnProperty( id ) ){
        continue;
    }
    user = database[ id ];
 
    if( typeof user !== 'object' ){
        continue;
    }
 
    userList.push( user );
}
 
    console.log( "Read list" + userList + typeof(user));
 
    response.writeHead( 200, {
        'Content-Type' : 'application/json'
    });
    response.end( JSON.stringify(userList) );
}
router.get( '/api/users', readUsers );



function deleteUser( request, response ){
    var id = request.params.id;
 
    if( typeof database[ id ] !== 'object' ){
        console.log( 'User not found' + id );
        response.writeHead( 404 );
        response.end( '' );
        return;
    }
 
    console.log( 'Delete user' + id);
 
    database[ id ] = undefined;
    response.writeHead( 204, {
        'Content-Type' : 'application/json'
    });
    response.end( '' );
}
router.delete( '/api/users/:id', deleteUser );



