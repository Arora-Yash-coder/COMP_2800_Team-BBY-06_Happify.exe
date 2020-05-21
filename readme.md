# BBY-TEAM#6 FutureCurves
###  Team Member List
* Judao Zhong
* Tiffany Gu
* Yash Arora
* Khurkhartsaga Munkhbold(Saga)
***

##### This repo is for developing a project called Happify.exe, developed by FutureCurves

The repo has such folders:
>   * app ---------------------------- router, controllers, database configuration
>       *   config ------------------
>           * mongodb.config.js           ------------------------------MongoDB connection string
>       * controllers
>            * push.controller.js
>            * user.controller.js
>   * resources ---------------------   All the resources 
>       * static ----------------   html, images, css, JavaScript files
>            * css ---------CSS Stylesheets
>            * img--------- Pictures used
>            * js -----------JavaScript Files
>            * json -----------GeoJson data, MongoDB JSON backups
>            * minigames---- Modularized Minigames
>   * views  -------------------------- ejs views and compenents
>   * app.js -------------------------- the entrance of the application, drives the app
>   * package.json  ------------------ contains module configuration
>   * readme.md
***

#### Setup for Development Environment

1. Download and install Node.js
2. When your node environment is set, clone the github repo to your folder by running the command line:

        > git clone https://github.com/Arora-Yash-coder/COMP_2800_Team-BBY-06_Happify.exe.git
3. Install the required Node modules using command line:

        >npm i      

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
7.  Congradulations, you have finished setting up the Development Environment




