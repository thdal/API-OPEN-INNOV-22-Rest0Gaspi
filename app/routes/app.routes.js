import users from "../controllers/user.controller.js";
import menu from "../controllers/menu.controller.js";

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
router.route("/api/users/:userId").put(multipartMiddleware, users.update);// Update an menu-restau with menuId
router.post("/api/usersMobile/:userId", users.updateFromAdmin);// Update a user with userId - Specific route from appMobile
router.get("/api/users/:userId", users.findOne);// Retrieve a single User with userId
router.delete("/api/users/:userId", users.delete);// Delete a User with userId
router.delete("/api/deleteUserProfile/:userId/:profileId", users.deleteUserProfile);// Delete a User profile with userId (doit être appelée avant la suppresion dans la table user à cause de la contrainte de la clé étrangère)
router.delete("/api/users", users.deleteAll);// Create a new User

//menu
//router.route("/api/menu/:menuId").put(multipartMiddleware, menu.update);// Update an menu with menuId
router.post("/api/menuMobile/:menuId", menu.update); // Update an menu with menuId - Specific route from appMobile
router.route("/api/menu").post(multipartMiddleware, menu.create);// post menu with img
router.get("/api/menu", menu.findAll);// Retrieve all menu
router.get("/api/menuWithDates", menu.findAllWithDate);// Retrieve all menu with dates
router.get("/api/menuWithDates/:userId", menu.findAllWithDateByUser);// Retrieve all menu with dates with userId
router.get("/api/menu/oftheday", menu.findAllOfTheDay);// Retrieve all menu of the day
router.get("/api/menu/oftheday/:userId", menu.findAllOfTheDayByUser);// Retrieve all menu of the day by user
router.get("/api/menu/:userId", menu.findAllByUser);// Retrieve all menu for one user
router.delete("/api/menu/:menuId", menu.delete);// Delete an menu with menuId
router.get("/api/menu/:menuId", menu.findOne);// Retrieve a single menu with menuId
router.get("/api/menu/type/:typeId/:userId", menu.findAllByType);// Retrieve all menu with typeId
router.get("/api/menu/canal/:canalId/:userId", menu.findAllByCanal);// Retrieve all menu with canalId
router.get("/api/menuTypes", menu.findAllMenuTypes);// Retrieve all menu types
router.get("/api/menuCanals", menu.findAllMenuCanals);// Retrieve all menu canals
router.post("/api/searchmenu", menu.findWithWord);// Retrieve all menu canals


//Les routes dans express sont éxécutés dans l'ordre, considéré qu'un chemin peut être interprêté comme un paramètre.


