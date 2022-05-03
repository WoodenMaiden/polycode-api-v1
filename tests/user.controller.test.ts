import 'dotenv/config'

import { connect, connection } from 'mongoose'

import { userController } from '../src/controllers'

import { Request, Response, NextFunction } from 'express';


describe("User Controller", () => {
    let mockResponse: Partial<any> //Partial<Request>
    mockResponse = {
        send: function(){ },
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
        it.skip('should return a user', async() => {

        })

        it.skip("should'nt return a user", async() => {

        })
    })


    describe('Delete an User', () => {
        it.skip('should delete a user', async() => {

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