import users from "../controllers/user.controller.js";

import express from 'express';
export const router = express.Router();
import  multipart  from 'connect-multiparty'; //Pour récupérer le fichier du formulaire (image)
const  multipartMiddleware  =  multipart();//Pour récupérer le fichier du formulaire (image)

//USER
router.post("/api/users", users.create);// Create a new User
router.post("/api/login", users.login);// Retrive a User with email and password
router.get("/api/users", users.findAll);// Retrieve all Users
router.get("/api/usersWithProfiles", users.findAllWithProfiles);// Retrieve all Users with profiles
router.get("/api/userProfiles", users.findAllUserProfiles);// Retrieve all User profiles
router.put("/api/updateUserFromAdmin/:userId", users.updateFromAdmin);// Update user
router.put("/api/updateUserProfile/:userId", users.updateUserProfile);// Update user profile
router.route("/api/users/:userId").put(multipartMiddleware, users.update);// Update an event with eventId
router.post("/api/usersMobile/:userId", users.updateFromAdmin);// Update a user with userId - Specific route from appMobile
router.get("/api/users/:userId", users.findOne);// Retrieve a single User with userId
router.delete("/api/users/:userId", users.delete);// Delete a User with userId
router.delete("/api/deleteUserProfile/:userId/:profileId", users.deleteUserProfile);// Delete a User profile with userId (doit être appelée avant la suppresion dans la table user à cause de la contrainte de la clé étrangère)
router.delete("/api/users", users.deleteAll);// Create a new User


//Les routes dans express sont éxécutés dans l'ordre, considerez qu'un chemin peut être interprêté comme un paramètre.


