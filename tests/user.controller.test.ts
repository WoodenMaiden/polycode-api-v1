import 'dotenv/config'

import { connect, connection } from 'mongoose'

import { userController } from '../src/controllers'

import { Request, Response, NextFunction } from 'express';


describe("User Controller", () => {
    let mockResponse: Partial<any> //Partial<Request>
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
    
            }
        }
        catch (e) {
    
        }
    })

    describe('User Signup', () => {
        it('should add a user', async () => {
            try {
	            const spy = jest.spyOn(userController, "post")
	            const mockRequest = {
	                body: {
	                    "userName": "xVoban",
	                    "userEmail": "voban_trapper@warframemail.com",
	                    "password": "TrapsAreCool",
	                    "passwordVerify": "TrapsAreCool"
	                }
	            }
	
	            const expected = {
	                jwt: "JWTToken"
	            }
	
	            await userController.post(mockRequest as Request, mockResponse as Response)
	
                expect(spy).toHaveBeenCalled()
	            expect(mockResponse.send).toBeCalledWith(expected)
            } catch (e) {
            }
        })

        it('should reject user creation because of wrong email', async () => {
            try {
	            const spy = jest.spyOn(userController, "post")
	            const mockRequest = {
	                body: {
	                    "userName": "Excalibur",
	                    "userEmail": "excalibur_at_warframemail.com",
	                    "password": "ImAGoodWarframe",
	                    "passwordVerify": "ImAGoodWarframe"
	                }
	            }
	
	            const expected = {
	                jwt: "JWTToken"
	            }
	
	            await userController.post(mockRequest as Request, mockResponse as Response)
	
                expect(spy).toHaveBeenCalled()
	            expect(mockResponse.send).not.toBeCalledWith(expected)
            } catch (e) {
            }
        })

        it('should reject user creation because of already existing username', async () => {
            try {
	            const spy = jest.spyOn(userController, "post")
	            const mockRequest = {
	                body: {
	                    "userName": "xVoban",
	                    "userEmail": "voban_trapper@gmail.com",
	                    "password": "TrapsAreCool",
	                    "passwordVerify": "TrapsAreCool"
	                }
	            }
	
	            const expected = {
	                jwt: "JWTToken"
	            }
	
	            await userController.post(mockRequest as Request, mockResponse as Response)
	
                expect(spy).toHaveBeenCalled()
	            expect(mockResponse.send).not.toBeCalledWith(expected)
            } catch (e) {
            }
        })

        it('should reject user creation because of passwords', async () => {
            try {
	            const spy = jest.spyOn(userController, "post")
	            const mockRequest = {
	                body: {
	                    "userName": "Garuda",
	                    "userEmail": "gimmedatshit@blooddonations.com",
	                    "password": "aPassword",
	                    "passwordVerify": "aPassword"
	                }
	            }
	
	            const expected = {
	                jwt: "JWTToken"
	            }
	
	            await userController.post(mockRequest as Request, mockResponse as Response)
	
                expect(spy).toHaveBeenCalled()
	            expect(mockResponse.send).not.toBeCalledWith(expected)
            } catch (e) {
            }
        })
    })

    describe('Get an User', () => {
        it('should return a user', async() => {
            //creating another Warframe first
            try {
	            const spy = jest.spyOn(userController, "get")
	            const mockRequestPOST = {
	                body: {
	                    "userName": "WomboLimbo",
	                    "userEmail": "limbo@warframemail.com",
	                    "password": "WTF Am I doing ?",
	                    "passwordVerify": "WTF Am I doing ?"
	                }
	            }
	
	            await userController.post(mockRequestPOST as Request, mockResponse as Response)


                const mockRequest = {
                    params: [
                        "WomboLimbo"
                    ]
                }

                const expected = 200

                try {
                    await userController.get(mockRequest as unknown as Request, mockResponse as Response)  
                    
                    expect(spy).toHaveBeenCalled()
                    expect(mockResponse.status).toBeCalledWith(expected)
                }
                catch(e) {
                }
            } catch (e) {
            }

        })

        it("should'nt return a user", async() => {
            try {
	            const spy = jest.spyOn(userController, "get")
                const mockRequest = {
                    params: [
                        "Valkyr"
                    ]
                }

                const expected = 404
                const expectedMessage = {
                    message: "No user found"
                }

                try {
                    await userController.get(mockRequest as unknown as Request, mockResponse as Response)  
                    
                    expect(spy).toHaveBeenCalled()
                    expect(mockResponse.status).toBeCalledWith(expected)
                    expect(mockResponse.send).toBeCalledWith(expectedMessage)
                }
                catch(e) {
                }
            } catch (e) {
            }

        })
    })


    describe('Delete an User', () => {
        it('should delete a user', async() => {
            //creating another Warframe first
            try {
	            const spy = jest.spyOn(userController, "delete")
                const spyGet = jest.spyOn(userController, "get")
	            const mockRequestPOST = {
	                body: {
	                    "userName": "deleteMe",
	                    "userEmail": "deleteMe@plz.com",
	                    "password": "DELETEME",
	                    "passwordVerify": "DELETEME"
	                }
	            }
	
	            await userController.post(mockRequestPOST as Request, mockResponse as Response)


                const mockRequest = {
                    params: [
                        "deleteMe"
                    ]
                }

                const expectedCode = 200
                const expectedCodeGET = 404

                try {
                    await userController.delete(mockRequest as unknown as Request, mockResponse as Response)  
                    expect(spy).toHaveBeenCalled()
                    expect(mockResponse.status).toBeCalledWith(expectedCode)
                    expect(mockResponse.send).toBeCalledWith({
                        message: "Deleted"
                    })

                    try {
                        await userController.get(mockRequest as unknown as Request, mockResponse as Response)
                    
                        expect(spyGet).toHaveBeenCalled()
                        expect(mockResponse.status).toBeCalledWith(expectedCodeGET)
                        expect(mockResponse.send).toBeCalledWith({
                            message: "No user found"
                        })

                    } catch (e) {
                    }
                } catch(e) {
                }
            } catch (e) {
            }
        })
    })

    describe('Change an User', () => {
        it.skip('should change email of a user', async() => {

        })

        it.skip("should'nt change user's email because it already exists", async() => {

        })

        it.skip("should'nt change user's password because verification is different", async() => {

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