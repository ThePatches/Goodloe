Goodloe League
==============

This project is a test project I'm using to teach myself [Node][1], [EmberJS][2], and [MongoDB][3]. What's hosted here for the time being is the source code minus any database connections, since I am setting up my models and templates first. Once all that is running fine, I'll start to strap in the database code, at which point there will be more to this ReadMe (since I will need to make heavy use of _.gitignore_ to hide my configuration files from you all).

Okay, I lied. The application now uses [AngularJS][4], since I didn't like Ember.

#### A Word about Branches

+ **Dev:** This is a semi-stable branch representing the latest stable development efforts. Will occasionally be a few features ahead of "master".
+ **Master:** Basically the deployed version. Previously the active development branch, now it's going to be the "stable" branch that only differs from what is deployed by levels of configuration.

## Project Purpose

The purpose of this application is to track the evolution of our MTG:Commander metagame. It has a public URL, but that's more for our expedience (can be used outside of my house). I will post more on how the database works and what information we track once the project is up and running (and into its database development portion).

## Installing the Project

You will need **Node** and **Mongo** to run this application. You can install them in either order.

### Node

The Node application requires the following packages which should be installed using **NPM**:
+ mongoose
+ bcrypt-nodejs <-- This package may require you to supress checksums
+ express
+ passport
+ passport-local

### MongoDB

#### Basic Setup
Currently, there is no startup script for the Mongo database, so you will need to seed the database manually. You have two choices for doing so.

1. If you've already set up your database with [authentication][5], you can add a user to the database by running the following mongodb shell commands:

        use goodloedb
        db.addUser({user: <username>, pwd: <password>,
            roles: ["readWrite", "dbAdmin"]})
    
    This user can be configured to work with your `production.json` file to protect your database, or subsequently ignored if you want to continue using `development.json`

2. Add a Player using the following mongodb shell commands:

        use goodloedb
        db.Players.insert({name: <name>, games: 0, active: true})

#### In-app Authentication

You can use this instead of step #2 above, but soon this process will go away once I come up with a better sign up interface. If you are running the app locally, you can skip the steps after 2, because you probably don't need hashing to run a version on your computer. If you plan to make a public-facing version, you will need to continue on to re-enable authentication. Also, you should consider enabling https, if you have a certificate.

1.  Find the lines below in the `server.js` file:
        
        var isTrue = bcrypt.compareSync(password, user.hash);
        //var isTrue = (password == user.hash);
    Remove the comment from the second line and comment out the first. This disables  bcrypt hashing for any users you add.
2. Add a new user using the following mongodb shell command:
        db.GoodUsers.insert({username: <name>, hash: <plaintext password>, active: 0, adminRights: 3})
    If you intend to continue on to re-enable bcrypt hashing, you should either make this a dummy user or be willing to change the password hash after the next steps. Side note: `adminRights: 3` allows that user to use the /adduser page to add users to the application, since I prefer not to use a sign-up interface for this particular iteration.
3. Run the node app.
+ Log in (this should be available from the initial page).
+ Encrypt a new hash by going to `http://[server]/encrypt?pass=<password>`. The retuned value in your browser should be a bcrypted password hash that you can then insert as for a NEW GoodUser using the command above. OR use the mongodb update command to change the password of your existing user to the new hash value.
+ Comment out `var isTrue = (password == user.hash);` and uncomment `var isTrue = bcrypt.compareSync(password, user.hash);` in the `server.js` file.

User authentication for the application should be enabled, allowing you to start adding players, decks, and games once logged in.

[1]: http://nodejs.org/
[2]: http://emberjs.com/
[3]: http://mongodb.org/
[4]: http://angularjs.org/
[5]: http://docs.mongodb.org/manual/tutorial/enable-authentication/
