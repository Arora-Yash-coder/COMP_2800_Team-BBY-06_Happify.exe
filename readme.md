# BBY-TEAM#6 FutureCurves
###  Team Member List
* Judao Zhong judaozhong@gmail.com
* Tiffany Gu yiwen950725@gmail.com
* Yash Arora                        yasharora9416@gmail.com
* Khurkhartsaga Munkhbold(Saga) sagakhuraa@gmail.com
***

##### This repo is for developing a project called Happify.exe, developed by FutureCurves

The repo has such folders:
>   * app -------------------------------------------------------------------- router, controllers, database configuration
>       *   config ------------------------------------------------------- MongoDB Setup
>           * mongodb.config.js           -------------------------------MongoDB connection string
>       * controllers
>            * push.controller.js  --------------------------------Web-Push Functions
>            * user.controller.js  --------------------------------User Functions invoked on req
>   * resources -------------------------------------------------------------------------   All the resources 
>       * static --------------------------------------------------------------------   html, images, css, JavaScript files
>            * css -------------------------------------------------------------CSS Stylesheets
>            * img------------------------------------------------------------ Pictures used
>            * js ---------------------------------------------------------------JavaScript Files
>            * json ------------------------------------------------------------GeoJson data, MongoDB JSON backups
>            * minigames---------------------------------------------------- Modularized Minigames
>       *  tic_tac_toe ----------------------------------------------------------------- React.Js Minigame(Not Static)
>       *  sw.js ----------------------------------------------------------------------Service Worker(Used in the web-push function)
>   * views  -------------------------------------------------------------------- ejs views and compenents
>       *  components -------------------------------------------------- components reused in ejs rendering
>   * app.js ------------------------------------------------------------------------------- the entrance of the application, drives the app
>   * package.json  ----------------------------------------------------------------------- contains module configuration
>   * readme.md
***

## Setup for Development Environment

1. Download and install Node.js
2. When your node environment is set, clone the github repo to your folder by running the command line:

        > git clone https://github.com/Arora-Yash-coder/COMP_2800_Team-BBY-06_Happify.exe.git
3. Install the required Node modules using command line:

        >npm i -g

4. After installing the modules, test if you could run the app

        >node app.js
5. If you are going to host it with https protocal, __get SSL keys and certificates__, and then uncomment the following code:
    
    ```javascript
    const https = require('https');
    var options = {
        key: fs.readFileSync('./privatekey.pem'),
        cert: fs.readFileSync('./certificate.pem')
    };
    https.createServer(options, app).listen(443, function () {
        console.log('Https server listening on port ' + 3011);
    });
6.  Download MongoDB Compass, then connect to the DB using this uri connection string:
    >     mongodb://judao:mongomaster@multislang.ca:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false
    The data for this app is in DB   __"test"__
7. (__Not Suggested__)If you want to run the react-based tic tac toe game on your own computer, then you need to go to /resources/tic_tac_toe and do:

        > npm i react -g
     Then Configure the .env file in each of the different folders and set the __PORT__  to a different value. 

8.  (__Suggested__) Deploy the react app to netlify.
9. You will have to link them together again in the __ttt_game_entrance.html__   .

10.  Congradulations, you have finished setting up the Development Environment ! You can run the app by inputing the following code and hit enter: 
        __With React Deployed Locally:__

         > npm run dev -concurrently 
       
       __With React Deployed On Netlify:__
       
         > node app.js

## The link to test log
    https://docs.google.com/spreadsheets/d/1Nki5OthlYfJ5bwWQFmdyP5F_CRIRdo0rsgAe4Eg3li8/edit?usp=sharing
## The link to reference document
    https://docs.google.com/document/d/1fbnJ3FqlW2z1bGHk8YU9_wPUo9LC0aB5cOKmQgqqXYs/edit?usp=sharing

