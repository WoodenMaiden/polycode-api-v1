import 'dotenv/config'

import { connect, connection } from 'mongoose'

import { userController } from '../src/controllers'

import { Request, Response, NextFunction } from 'express';


describe("User Controller", () => {
    let mockResponse: Partial<any> //Partial<Request>

    beforeAll(async () => {
        try {
            await connection.close()

            if (!process.env.MONGODB_URI) {
                console.log("Please fill environment variables!")
                process.exit(1)
            }

            const REGEX = /^(mongodb.+\/)polycode(.+)$/gm // to get rid of db name so we can replace it
            const MONGO_TEST_URI: string = REGEX.exec(process.env.MONGODB_URI).slice(1,3).join(Date.now().toString())
            
            try {
                await connect(MONGO_TEST_URI)
            }
            catch (e) {
                console.log(e)
            }
        }
        catch (e) {
                console.log(e)
        }
    })

    beforeEach(() => {
        mockResponse = {
            send: function(body: any){ },
            json: function(err: any){
                console.log("\n : " + err);
            },
            status: function(responseStatus: number) {
                // This next line makes it chainable
                return this; 
            }
        }
    })

    describe('User Signup', () => {
        it('should add a user', async () => {
                const spyStatus = jest.spyOn(mockResponse, "status")


	            const mockRequest = {
	                body: {
	                    "userName": "xVoban",
	                    "userEmail": "voban_trapper@warframemail.com",
	                    "password": "TrapsAreCool",
	                    "passwordVerify": "TrapsAreCool"
	                }
	            }
	
	            const expectedCode = 204

                const mockNext: NextFunction = jest.fn().mockImplementation()
	
	            await userController.post(mockRequest as Request, mockResponse as Response, mockNext)
	
	            expect(spyStatus).toBeCalledWith(expectedCode)
        })

        it('should login xVoban', async () => {
            const spy = jest.spyOn(userController, "login")
            const spyStatus = jest.spyOn(mockResponse, "status")
            
            const mockRequest = {
                body: {
                    "userName": "xVoban",
                    "password": "TrapsAreCool",

                }
            }

            const expectedCode = 200

            await userController.login(mockRequest as Request, mockResponse as Response)

            expect(spy).toHaveBeenCalled()
	        expect(spyStatus).toBeCalledWith(expectedCode)

        })

        it('should reject user creation because of wrong email', async () => {
            
	            const spy = jest.spyOn(userController, "post")
                const spyStatus = jest.spyOn(mockResponse, "status")

	            const mockRequest = {
	                body: {
	                    "userName": "Excalibur",
	                    "userEmail": "excalibur_at_warframemail.com",
	                    "password": "ImAGoodWarframe",
	                    "passwordVerify": "ImAGoodWarframe"
	                }
	            }
	
	            const expectedCode = 201
	
                const mockNext: NextFunction = jest.fn().mockImplementation()

	            await userController.post(mockRequest as Request, mockResponse as Response, mockNext)
	
                expect(spy).toHaveBeenCalled()
	            expect(spyStatus).not.toBeCalledWith(expectedCode)
        })

        it('should reject user creation because of already existing username', async () => {
            const spy = jest.spyOn(userController, "post")
            const spyStatus = jest.spyOn(mockResponse, "status")

            const mockRequest = {
                body: {
                    "userName": "xVoban",
                    "userEmail": "voban_trapper@gmail.com",
                    "password": "TrapsAreCool",
                    "passwordVerify": "TrapsAreCool"
                }
            }

            const expectedCode = 201

            const mockNext: NextFunction = jest.fn().mockImplementation()


            await userController.post(mockRequest as Request, mockResponse as Response, mockNext)

            expect(spy).toHaveBeenCalled()
            expect(spyStatus).not.toBeCalledWith(expectedCode)
        })

        it('should reject user creation because of passwords', async () => {
            const spy = jest.spyOn(userController, "post")
            const spyStatus = jest.spyOn(mockResponse, "status")
            const spySend = jest.spyOn(mockResponse, "send")

            const mockRequest = {
                body: {
                    "userName": "Garuda",
                    "userEmail": "gimmedatshit@blooddonations.com",
                    "password": "aPassword",
                    "passwordVerify": "aPassword"
                }
            }

            const expectedCode = 201

            const mockNext: NextFunction = jest.fn().mockImplementation()

            await userController.post(mockRequest as Request, mockResponse as Response, mockNext)

            expect(spy).toHaveBeenCalled()
            expect(spyStatus).not.toBeCalledWith(expectedCode)

        })
    })

    describe('Get an User', () => {
        it('should return a user', async() => {
            //creating another Warframe first
        
	            const spy = jest.spyOn(userController, "get")
                const spyStatus = jest.spyOn(mockResponse, "status")

	            const mockRequestPOST = {
	                body: {
	                    "userName": "WomboLimbo",
	                    "userEmail": "limbo@warframemail.com",
	                    "password": "WTF Am I doing ?",
	                    "passwordVerify": "WTF Am I doing ?"
	                }
	            }

                const mockRequestGET = {
	                params: {
	                    name: "WomboLimbo",
	                }
	            }
	
                const mockNext: NextFunction = jest.fn().mockImplementation()

	            await userController.post(mockRequestPOST as Request, mockResponse as Response, mockNext)

                mockResponse = {
                    send: function(body: any){ },
                    json: function(err: any){
                        console.log("\n : " + err);
                    },
                    status: function(responseStatus: number) {
                        // This next line makes it chainable
                        return this; 
                    }
                }

                await userController.get(mockRequestGET as unknown as Request, mockResponse as Response)
                const expected = 204

                                    
                expect(spy).toHaveBeenCalled()
                expect(spyStatus).toBeCalledWith(expected)
        
        })

        it("shouldn't return a user", async() => {
	            const spy = jest.spyOn(userController, "get")
                const spyStatus = jest.spyOn(mockResponse, "status")
                const spySend = jest.spyOn(mockResponse, "send")

                const mockRequest = {
                    params: {
                        name: "Valkyr"
                    }
                }

                const expected = 404
                const expectedMessage = {
                    message: "No user found"
                }

                await userController.get(mockRequest as unknown as Request, mockResponse as Response)  
                
                expect(spy).toHaveBeenCalled()
                expect(spyStatus).toBeCalledWith(expected)
                expect(spySend).toBeCalledWith(expectedMessage)

        })
    })


    describe('Delete an User', () => {
        it('should delete a user', async() => {
            //creating another Warframe first
  
            const spy = jest.spyOn(userController, "delete")

            const spyStatus = jest.spyOn(mockResponse, "status")
            const spySend = jest.spyOn(mockResponse, "send")


            const mockRequestPOST = {
                body: {
                    "userName": "deleteMe",
                    "userEmail": "deleteMe@plz.com",
                    "password": "DELETEME",
                    "passwordVerify": "DELETEME"
                }
            }
            const mockNext: NextFunction = jest.fn().mockImplementation()

            await userController.post(mockRequestPOST as Request, mockResponse as Response, mockNext)


            const mockRequest = {
                params: {
                    name: "deleteMe"
                }
            }

            const expectedCode = 204

            await userController.delete(mockRequest as unknown as Request, mockResponse as Response)  
            expect(spy).toHaveBeenCalled()
            expect(spyStatus).toBeCalledWith(expectedCode)
            expect(spySend).toBeCalledWith({
                message: "Deleted"
            })
        })
    })


    describe('Change an User', () => {
        it('should change user', async () => {

        
        const spy = jest.spyOn(userController, "patch")
        const spyStatus = jest.spyOn(mockResponse, "status")
        const spySend = jest.spyOn(mockResponse, "send")

        const mockRequest = {
            params: {
                name: "xVoban",
                toChange: "email",
                value : "someotheremail@mail.net"
            },
            body: {
                original: "someotheremail@mail.net",
                confirm: "someotheremail@mail.net"
            } 
        }
        await userController.patch(mockRequest as unknown as Request, mockResponse as Response)

        const expected = 204

        expect(spy).toHaveBeenCalled()
        expect(spyStatus).toBeCalledWith(expected)
           
        })
   

        it("shouldn't change user's email because it already exists", async() => {
            const spy = jest.spyOn(userController, "patch")
            const spyStatus = jest.spyOn(mockResponse, "status")
            const spySend = jest.spyOn(mockResponse, "send")

            const mockRequest = {
                params: {
                    name: "xVoban",
                    toChange: "email",
                    value : "limbo@warframemail.com"
                },
                body: {
                    original: "someotheremail@mail.net",
                    confirm: "limbo@warframemail.com"
                } 
            }
            await userController.patch(mockRequest as unknown as Request, mockResponse as Response)

            const expectedCode = 400
            const expected = {
                message: "Could not change email because it already exists"
            }

            expect(spy).toHaveBeenCalled()
            expect(spyStatus).toBeCalledWith(expectedCode)
            expect(spySend).toBeCalledWith(expected)
        
        })

        it("shouldn't change user's password because verification is different", async() => {
            const spy = jest.spyOn(userController, "patch")
            const spyStatus = jest.spyOn(mockResponse, "status")
            const spySend = jest.spyOn(mockResponse, "send")

            const mockRequest = {
                params: {
                    name: "xVoban",
                    toChange: "password",
                    value : "password"
                },
                body: {
                    original: "WTF Am I doing ?",
                    confirm: "differentPassword"
                } 
            }
            await userController.patch(mockRequest as unknown as Request, mockResponse as Response)

            const expectedCode = 400
            const expected = {
                message: "Values are different!"
            }

            expect(spy).toHaveBeenCalled()
            expect(spyStatus).toBeCalledWith(expectedCode)
            expect(spySend).toBeCalledWith(expected)
        
        })
    })


    afterAll( async () => {
        try {    
            await connection.db.dropDatabase();
            await connection.close();
        }
        catch (e) {

        }
    })
})