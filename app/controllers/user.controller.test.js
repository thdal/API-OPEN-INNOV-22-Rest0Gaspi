import userController from "./user.controller.js";
import user from "../models/user.model.js";
import sql from "../models/db.js"
import event from "../models/menu-restau.model";

const mockRequest = () => {
    const req = {}
    req.body = jest.fn().mockReturnValue(req)
    req.params = jest.fn().mockReturnValue(req)
    return req
}

const mockResponse = () => {
    const res = {}
    res.send = jest.fn().mockReturnValue(res)
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    return res
}
jest.mock('../models/user.model.js');

jest.mock('../models/db.js', ()=>{
    return jest.fn();
});
describe('Test user controller :', () => {
    beforeEach(()=>{
        user.mockClear();
    });
    test('FindOne - Testing 400 error has been called :', () => {
        let req = mockRequest();
        req.params.userId = null;
        const res = mockResponse();
        const result = userController.findOne(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({message: 'UserId can not be null!'});
    });
    test('FindAll - Testing getAll has been called :', () => {
        let req = mockRequest();
        const res = mockResponse();
        const result = userController.findAll(req, res);
        expect(user.getAll).toHaveBeenCalled();

    });
});
