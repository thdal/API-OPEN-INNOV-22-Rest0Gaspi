//Requirement
import http from 'http';
import https from 'https';
import fs from 'fs';
//app
import app from './app.js';

//On récupére l'argument passer dans l'invite de commande ex: node server.js arg
//Si rien on est en environnement de dev
var env = process.argv[2] || 'dev';

switch (env) {
  case 'dev':
    var httpServer = http.createServer(app);
    httpServer.listen(3000, () => {
      console.log("Server is running on port 3000 without ssl certificate.");
    });
    // Setup development config
    break;
  case 'prod':
    var privateKey  = fs.readFileSync('/etc/ssl/www-thibaut-dalens-com/thibaut-dalens.com_private_key.key', 'utf8');
    var certificate = fs.readFileSync('/etc/ssl/www-thibaut-dalens-com/thibaut-dalens.com_ssl_certificate.cer', 'utf8');
    var credentials = {key: privateKey, cert: certificate};
    var httpsServer = https.createServer(credentials, app);
    httpsServer.listen(3000, () => {
      console.log("Server is running on port 3000 with ssl certificate.");
    });
    // Setup production config
    break;
}
// set port, listen for requests
/*app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});*/