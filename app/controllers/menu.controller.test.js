import eventController from "./menu.controller.js";
import event from "../models/menu-restau.model.js";
//Mock la requête HTTP
const mockRequest = () => {
    const req = {}
    req.body = jest.fn().mockReturnValue(req)
    req.params = jest.fn().mockReturnValue(req)
    return req
}
//Mock la reponse HTTP
const mockResponse = () => {
    const res = {}
    res.send = jest.fn().mockReturnValue(res)
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    return res
}
//Mock du fichier model
jest.mock('../models/menu-restau.model.js');
//Mock de la Connexion à la base de données
jest.mock('../models/db.js', ()=>{
    return jest.fn();
});
//Tests du controller menu-restau
describe('Test create into menu-restau controller :', () => {
    beforeEach(()=>{
        event.mockClear();
    });
    //Premier test
    test('Testing 400 error has been called :', () => {
        let req = mockRequest();
        //On déclare null le body
        req.body = null;
        const res = mockResponse();
        //On appel la méthode create en lui passant nos objets HTTP mockés
        const result = eventController.create(req, res);
        //Le code 400 doit être appelé pour un body vide
        expect(res.status).toHaveBeenCalledWith(400);
        //Le message d'erreur doit être valide
        expect(res.send).toHaveBeenCalledWith({message: 'Content can not be empty!'});
    });
    //Second test
    test('Testing create model has been called', async() => {
        //Mock de la requête HTTP
        let req = mockRequest();
        //Init l'objet menu-restau du body
        req.body.event = "{}";
        //Mock de la reponse HTTP
        const res = mockResponse();
        //Appel la fonction create du controller
        const result = eventController.create(req,res);
        //La méthode create du model a été appelée
        expect(event.create).toHaveBeenCalled();
    });
});
