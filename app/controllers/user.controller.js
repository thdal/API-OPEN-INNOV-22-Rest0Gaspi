//const User = require("../models/user.model.js");
import User from '../models/user.model.js';
import fs from "fs";
import bcrypt from 'bcrypt';


const users = {
  // Create and Save a new User
  create(req, res){
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
    // Create a User
    const user = new User({
      firstName: req.body.firstName,
      lastName : req.body.lastName,
      profile_id: req.body.profile_id,
      email: req.body.email,
      password: req.body.password,
      genre_id: req.body.genre_id,
      userImg: req.body.userImg,
      isBanned: req.body.isBanned
    });

    // On hash le mot de passe
    hashMDP(req.body.password, callback => {
        user.password = callback.hashedPassword;
      // Save User in the database
      User.create(user, (err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the User."
          });
        else{
          //Associates the profile with the user
          User.insertUserProfile(data.id, data.profile_id, (err, data) => {
            if (err)
              res.status(500).send({
                message:
                    err.message || "Some error occurred while inserting the user profile."
              });
          });
          res.send(data);
        }
      });
    });
  },

  // Retrieve all Users from the database.
  findAll(req, res){
    User.getAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving users."
        });
      else res.send(data);
    });
  },

  // Retrieve all Users from the database with profiles.
  findAllWithProfiles(req, res){
    User.getAllWithProfiles((err, data) => {
      if (err)
        res.status(500).send({
          message:
              err.message || "Some error occurred while retrieving users with profiles."
        });
      else res.send(data);
    });
  },

  // Retrieve all user profiles from the database.
  findAllUserProfiles(req, res){
    User.getAllUserProfiles((err, data) => {
      if (err)
        res.status(500).send({
          message:
              err.message || "Some error occurred while retrieving user profiles."
        });
      else res.send(data);
    });
  },

  // Find a single User with a userId
  login(req, res){
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
    // Create a tmp User
    const user = new User({
      email: req.body.email,
      password: req.body.password
    });

    //On vérifie que le mail existe en base
    User.getPassword(req.body.email, (errPW,dataPW)=>{
      if (errPW) {
          if (errPW.kind === "not_found") {
            res.status(404).send({
              message: `Email invalide.`
            });
          }else{
            res.status(500).send({
              message:
                  err.message || "Some error occurred while retrieving user password with email."
            });
          }
      }
      //Si on a bien un mot de passe pour cet email
      else{
        //On vérifie que le hash correspond bien au mot de passe envoyé
        compareHashedMDP(dataPW.password, user.password, callback => {
          //Si oui on récupére notre utilisateur
          if(callback.passwordIsValid){
              user.password = dataPW.password;
            User.login(user, (errLogin, dataLogin) => {
              if (errLogin) {
                if (errLogin.kind === "not_found") {
                  res.status(404).send({
                    message: `User not found.`
                  });
                } else {
                  res.status(500).send({
                    message: "Error retrieving User."
                  });
                }
              } else res.send(dataLogin);
            });
          }
          //Si non le mot de passe ne correspond pas
          else{
            res.status(404).send({
              message: `Password invalide.`
            });
          }
        });
      }
    });
  },

  // Find a single User with a userId
  findOne(req, res){
    if (!req.params.userId) {
      res.status(400).send({
        message: "UserId can not be null!"
      });
    }
    User.findById(req.params.userId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found User with id ${req.params.userId}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving User with id " + req.params.userId
          });
        }
      } else res.send(data);
    });
  },

  // Update a User identified by the userId in the request
  update(req, res){
    // Validate Request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }

    var userJson = JSON.parse(req.body.user)//On récupére le json du formData

    User.updateById(
      req.params.userId,
      new User(userJson),
      (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found User with id ${req.params.userId}.`
            });
          } else {
            res.status(500).send({
              message: "Error updating User with id " + req.params.userId
            });
          }
        }
        //Si pas d'erreur on change l'image si besoin
        else{
          //Mais seulement si on utilise une image perso
          //Et si le fichier n'est pas vide
          if(data.userImg && Object.keys(req.files).length != 0) {
            var userId = data.id; //L'id de l'utilisateur pour créer un dossier unique
            //On enregistre l'image sur le serveur
            saveImageUser(req.files, userId,(err, dataImg)=>{
              if(err){
                if(err.kind === "file_too_big"){
                  res.status(413).send({
                    message: "File is too big, choose another one please."
                  });
                }else {
                  res.status(500).send({
                    message: "Error inserting img from user with id " + userId
                  });
                }
              }else{
                res.send(data);
              }
            });
            //Si pas d'image
          }else{
            res.send(data);
          }
        }
      }
    );
  },

  // Update a User identified by the userId in the request
  updateFromAdmin(req, res){
    // Validate Request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
    User.updateByIdFromAdmin(
        req.params.userId,
        new User(req.body),
        (err, data) => {
          if (err) {
            if (err.kind === "not_found") {
              res.status(404).send({
                message: `Not found User with id ${req.params.userId}.`
              });
            } else {
              res.status(500).send({
                message: "Error updating User with id " + req.params.userId
              });
            }
          }
          else{
              res.send(data);
          }
        }
    );
  },

  // Update a User profile identified by the userId in the request
  updateUserProfile(req, res){
    // Validate Request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
    User.updateUserProfile(req.params.userId, req.body.profileId, (err, data) => {
          if (err) {
            if (err.kind === "not_found") {
              res.status(404).send({
                message: `Not found User with id ${req.params.userId}.`
              });
            } else {
              res.status(500).send({
                message: "Error updating User with id " + req.params.userId
              });
            }
          }
          else{
            res.send(data);
          }
        }
    );
  },

  // Delete a User with the specified userId in the request
  delete(req, res) {
    User.remove(req.params.userId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found User with id ${req.params.userId}.`
          });
        } else {
          res.status(500).send({
            message: "Could not delete User with id " + req.params.userId
          });
        }
      } else{
      delUserImage(req.params.userId,(err, dataImg)=>{
        if(err){
          res.status(500).send({
            message: "Error deleting img from user with id " + userId
          });
        }else{
          //res.send({ message: `User was deleted successfully!` });
        }
      });
        res.send({ message: `User was deleted successfully!` });
      }
    });
  },

  // Delete a User with the specified userId in the request
  deleteUserProfile(req, res) {
    User.deleteUserProfile(req.params.userId, req.params.profileId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found User profile with userId : ${req.params.userId} && profileId : ${req.params.profileId}.`
          });
        } else {
          res.status(500).send({
            message: "Could not delete User profile with userId : " + req.params.userId + "&& profileId : " + req.params.profileId
          });
        }
      } else res.send({ message: `User Profile was deleted successfully!` });
    });
  },


  // Delete all Users from the database.
  deleteAll(req, res){
    User.removeAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all users."
        });
      else res.send({ message: `All Users were deleted successfully!` });
    });
  }
}

//Fonction privée on manipule les images de nos utilisateurs
// Peut être à déplacer dans un nouveau fichier
function saveImageUser(file, userId, result){
  var file = file.userImgFile;//eventImgFile, le nom de formData set côté client
  var fileName = file.originalFilename;
  var fileNameGeneric = "userImg.jpg";
  var fileSize = file.size;
  var filePath = file.path;
  //On enregistre pas de fichier trop gros, fileSize en octets ici < 10Mo
  if((fileSize > 10000000)){
    result({ kind: "file_too_big" }, null);
    return;
  }
  //On crée un dossier particulier pour chaque événement. (sous la forme: event+eventId)
  var userDir = "app/public/usersImgs/userId"+userId;

  if (!fs.existsSync(userDir)){
    fs.mkdirSync(userDir);
  }

  fs.copyFile(filePath, userDir + "/" + fileNameGeneric, (err) => {
    if (err){
      result(err, null);
      return;
    }
    var msg = filePath + ' was copied to ' + userDir + "/" + fileNameGeneric;
    console.log(msg);
    result(null, msg)
  });
}

//Fonction privée on supprime l'image associé à un utilisateur
function delUserImage(userId, result){

  var userDir = "app/public/usersImgs/userId"+userId;

  if (fs.existsSync(userDir)) {
    fs.rmdirSync(userDir, {recursive: true}, (err) =>{
      if (err){
        result(err, null);
        return;
      }
    })
    var msg = userDir + ' was deleted successfully.';
    console.log(msg);
    result(null, msg)
  }
}

async function hashMDP(password, callback){
  const salt = await bcrypt.genSalt(6);
  const hashed = await bcrypt.hash(password, salt);
   callback({hashedPassword:hashed});
}

async function compareHashedMDP(hashedPassword, password, callback){
  const validPassword = await bcrypt.compare(password, hashedPassword);
  callback({passwordIsValid: validPassword})
}

export default users;
