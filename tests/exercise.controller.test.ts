import 'dotenv/config'

import { connect, connection } from 'mongoose'

import { exerciseController } from '../src/controllers'

import { Request, Response, NextFunction } from 'express';


describe("User Controller", () => {
    let mockResponse: Partial<any> //Partial<Request>
    const dbname = Date.now().toString()

    beforeAll(async () => {
        try {
            await connection.close()

            if (!process.env.MONGO_URL) {
                console.log("Please fill environment variables!")
                process.exit(1)
            }

            const REGEX = /^(mongodb.+\/)polycode(.+)$/gm // to get rid of db name so we can replace it
            const MONGO_TEST_URI: string = REGEX.exec(process.env.MONGO_URL).slice(1,3).join(dbname)
            
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

    describe('Insert Exercise', () => {
        it('should add an exercise', async ()=> {
            const spy = jest.spyOn(exerciseController, "post")
            const spyStatus = jest.spyOn(mockResponse, "status")
            
            const mockRequest = {
                body: {
                    language: "javascript",
    
                    title: "An exercise",
                    statement: "a Statement", // markdown goes here
                    relatedCourse: {
                        courseName : "A course",
                        courseDescription: "A description",
                        exerciseNumber: 0
                    },
                    inputs: [""], //there can be several inputs per exercice
                    expectedOutputs: ["true"], //inputs[n] => expectedOutputs[n]

                    keyWords: [""],
                    initialCode: "console.log(true)"
                }
            } as Request

            const mockNext: NextFunction = jest.fn().mockImplementation()

            await exerciseController.post(mockRequest, mockResponse as Response, mockNext)

            expect(spy).toHaveBeenCalled()
            expect(spyStatus).toHaveBeenCalledWith(204)
        })

        it('should not add an exercise', async ()=> {
            const spy = jest.spyOn(exerciseController, "post")
            const spyStatus = jest.spyOn(mockResponse, "status")
            
            const mockRequest = {
                body: {
                    language: "",
    
                    title: "An exercise",
                    statement: "a Statement", // markdown goes here
                    relatedCourse: {
                        courseName : "A course",
                        courseDescription: "A description",
                        exerciseNumber: 0
                    },
                    inputs: [""], //there can be several inputs per exercice
                    expectedOutputs: ["true"], //inputs[n] => expectedOutputs[n]

                    keyWords: [""],
                    initialCode: "console.log(true)"
                }
            } as Request

            const mockNext: NextFunction = jest.fn().mockImplementation()

            await exerciseController.post(mockRequest, mockResponse as Response, mockNext)

            expect(spy).toHaveBeenCalled()
            expect(spyStatus).toHaveBeenCalledWith(400)
        })

        describe('Get exercise', () => {
            it ('should return an exercise', async ()=> {
                const spy = jest.spyOn(exerciseController, "get")
                const spyStatus = jest.spyOn(mockResponse, "status")

                const doc = await connection.db.collection("exercises").findOne({})

                const mockRequest = {
                    params: {
                        id: doc._id
                    }
                }

                await exerciseController.get(mockRequest as unknown as Request, mockResponse as Response)
                
                expect(spy).toHaveBeenCalled()
                expect(spyStatus).toHaveBeenCalledWith(200)
            })
        })
       

        describe('Patch exercise', () => {
            it('should patch', async() => {
                const spy = jest.spyOn(exerciseController, "patch")
                const spyStatus = jest.spyOn(mockResponse, "status")

                const doc = await connection.db.collection("exercises").findOne({})

                const mockRequest = {
                    params: {
                        id: doc._id,
                        toChange: "statement",
                        value: "A patched statement!"
                    }
                }

                await exerciseController.patch(mockRequest as unknown as Request, mockResponse as Response)
        
                expect(spy).toHaveBeenCalled()
                expect(spyStatus).toHaveBeenCalledWith(204)

            })

            it('should not patch because of wrong attribute', async() => {
                const spy = jest.spyOn(exerciseController, "patch")
                const spyStatus = jest.spyOn(mockResponse, "status")

                const doc = await connection.db.collection("exercises").findOne({})

                const mockRequest = {
                    params: {
                        id: doc._id,
                        toChange: "notvalidstufftochange",
                        value: "blablabla"
                    }
                }

                await exerciseController.patch(mockRequest as unknown as Request, mockResponse as Response)
        
                expect(spy).toHaveBeenCalled()
                expect(spyStatus).toHaveBeenCalledWith(400)

            })

            it('should not patch because exercise does not exist', async() => {
                const spy = jest.spyOn(exerciseController, "patch")
                const spyStatus = jest.spyOn(mockResponse, "status")

                const doc = await connection.db.collection("exercises").findOne({})

                const mockRequest = {
                    params: {
                        id: "absolutelyvalidid",
                        toChange: "statement",
                        value: "A patched statement!"
                    }
                }

                await exerciseController.patch(mockRequest as unknown as Request, mockResponse as Response)
        
                expect(spy).toHaveBeenCalled()
                expect(spyStatus).toHaveBeenCalledWith(404)

            })
        })

        describe('Delete exercise', () => {
            it('should delete', async() => {
                const spy = jest.spyOn(exerciseController, "delete")
                const spyStatus = jest.spyOn(mockResponse, "status")
                
                const doc = await connection.db.collection("exercises").findOne({})

                const mockRequest = {
                    params: {
                        id: doc._id,
                    }
                }


                await exerciseController.delete(mockRequest as unknown as Request, mockResponse as Response)
        
                expect(spy).toHaveBeenCalled()
                expect(spyStatus).toHaveBeenCalledWith(204)
            })
        })

    })


    describe('Courses', () => {
        it('should get courses and a specific one', async() => {
            const spyGetOne = jest.spyOn(exerciseController, "getCourse")
            const spyGetAll = jest.spyOn(exerciseController, "getCourses")

            const spyStatus = jest.spyOn(mockResponse, "status") 

            const postmockRequest = {
                body: {
                    language: "javascript",
    
                    title: "An exercise",
                    statement: "a Statement", // markdown goes here
                    relatedCourse: {
                        courseName : "A course",
                        courseDescription: "A description",
                        exerciseNumber: 0
                    },
                    inputs: [""], //there can be several inputs per exercice
                    expectedOutputs: ["true"], //inputs[n] => expectedOutputs[n]

                    keyWords: [""],
                    initialCode: "console.log(true)"
                }
            } as Request

            const postmockRequest2 = {
                body: {
                    language: "javascript",
    
                    title: "An other exercise",
                    statement: "a Statement", // markdown goes here
                    relatedCourse: {
                        courseName : "An other course",
                        courseDescription: "A description",
                        exerciseNumber: 0
                    },
                    inputs: [""], //there can be several inputs per exercice
                    expectedOutputs: ["true"], //inputs[n] => expectedOutputs[n]

                    keyWords: [""],
                    initialCode: "console.log(true)"
                }
            } as Request

            const mockNext: NextFunction = jest.fn().mockImplementation()

            await exerciseController.post(postmockRequest, mockResponse as Response, mockNext)
            await exerciseController.post(postmockRequest2, mockResponse as Response, mockNext)


            const mockRequest = {
                params : {
                    name : "An other course"
                }
            }

            await exerciseController.getCourses(mockRequest as unknown as Request, mockResponse as Response)
            await exerciseController.getCourse(mockRequest as unknown as Request, mockResponse as Response)


            expect(spyGetAll).toHaveBeenCalled()
            expect(spyGetOne).toHaveBeenCalled()
            expect(spyStatus).toHaveBeenCalledTimes(4)
        })

        it('should get exercices of course', async() => {
            const spy = jest.spyOn(exerciseController, "getExercises")
            const spyStatus = jest.spyOn(mockResponse, "status") 

            const mockRequest = {
                params: {
                    name: "A course"
                }
            }

            await exerciseController.getExercises(mockRequest as unknown as Request, mockResponse as Response)
            
            expect(spy).toHaveBeenCalled()
            expect(spyStatus).toHaveBeenCalledWith(200)
        })

        it('should patch exercices of course', async() => {
            const spy = jest.spyOn(exerciseController, "patchCourse")
            const spyStatus = jest.spyOn(mockResponse, "status") 

            const mockRequest = {
                params: {
                    name: "A course",
                    toChange: "courseDescription",
                    value: "A new Description"
                }
            }

            await exerciseController.patchCourse(mockRequest as unknown as Request, mockResponse as Response)
            
            expect(spy).toHaveBeenCalled()
            expect(spyStatus).toHaveBeenCalledWith(204)
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