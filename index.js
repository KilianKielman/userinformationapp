fs = require('fs'); // requires the FileSystem module to read and write files

var jade = require('jade'); // requires the jade module
var bodyParser = require('body-parser'); // requires the bodyParser module (to be able to get data from a form)

var express = require('express'); // requires the express module (servermodule)
var app = express(); // sets app equal to calling the express module

app.set('view engine', 'jade'); // sets the default template engine to jade

app.use(bodyParser.urlencoded({ // this makes the bodyparser function available to the express server
  extended: true
}));

/* RENDERS LIST OF USERS | STEP 0 */

app.get('/', function(req, res) { // I used a get request, because this function requires nothing from the user
  fs.readFile('users.json', 'utf8', function(err, data) { // here the programme is reading the users.json file
    res.render('index.jade', { // and renders the index.jade file
      datajson: data // this makes the data from the users.json file available to the variable datajson in jade
    });
  });
})

/* SEARCH FOR MATCHING USERS */

app.get('/form', function(req, res) { // this form makes it possible to search for people
  res.render('form.jade');  // this renders the form.jade with the search input and submit button
});

app.post('/searchresult', function(request, response) { // this route is loaded, when someone presses the submit button
  searchresult = request.body.searchresult; // sets var searchresult equal to the input of the user in the form
  fs.readFile('users.json', function(err, data) { //this reads the users.json file
      user = JSON.parse(data); // here you parse the data from the users.json file into a new variable 'user'
      for (var i = 0; i < user.length; i++) { // with this for loop you are checking if your input matched with the info of the existing users
         if (user[i].firstname === searchresult || user[i].lastname === searchresult) { // here you are checking either the first or the lastname is equal to the first- or lastname of your input
          response.send("Users firstname: " + user[i].firstname + '</br>' +
          "Users lastname: " + user[i].lastname + '</br>' + "Users email: " + user[i].email);
        return;
      }
    }
  })

});

/* CREATE USER FORM */

app.get('/adduser', function(request, response) { // if this route is loaded it renders the adduser.jade
  response.render('adduser.jade');
});

/* POST THE CREATED USER INTO THE USERS.JSON FILE */

app.post('/adduser', function(request, response) {
  createdUser = (request.body); // sets var createdUser equal to the input of the user in the form
  fs.readFile('users.json', 'utf8', function(err, data) { // here you read the users.json file
    if (err) {              // if there is an error..
      return console.log(err); // show error..
    }
    existingUsers = JSON.parse(data); // shows the existingUsers in the users.json file and put that in a new variable
    existingUsers.push(createdUser); // this pushes the info of the new user into the users.json file
    fs.writeFile('users.json', JSON.stringify(existingUsers)); // this over-write the old users.json file with the new user info
    response.redirect('/'); // this redirects to the first route where you show all your users of the users.json file
  });

});

app.listen(3000, function() { // here you create a local server on port 3000!
  console.log('Example app listening on port 3000!'); // this is the message that is logged into the terminal
});