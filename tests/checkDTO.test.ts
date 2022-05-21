import { checkDTO } from '../src/middlewares/checkDTO'

import { Request, Response, NextFunction } from 'express';

describe('CheckDTO', () => {
    let mockResponse: Partial<any> //Partial<Response>
    let mockNext: Partial<NextFunction> 

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

        mockNext = jest.fn().mockImplementation()

    })

    it('should validate', async() => {
        const spyStatus = jest.spyOn(mockResponse, "status")

        const mockRequest = {
            method: 'PATCH',
            url: "/user",
            body : {
                original: "og",
                confirm: "confirm"
            }
        } as Request  

        checkDTO(mockRequest, mockResponse as Response, mockNext as NextFunction)

        expect(spyStatus).not.toHaveBeenCalled()
    })

    it("shouldn't validate because of method and url", async() => {
        const spyStatus = jest.spyOn(mockResponse, "status")

        const mockRequest = {
            method: 'DELETE',
            url: "/user",
            body : {
                original: "og",
                confirm: "confirm"
            }
        } as Request  

        checkDTO(mockRequest, mockResponse as Response, mockNext as NextFunction)

        expect(spyStatus).toHaveBeenCalled()
    })

    it("shouldn't validate because of invalidate", async() => {
        const spyStatus = jest.spyOn(mockResponse, "status")

        const mockRequest = {
            method: 'POST',
            url: "/answer",
            body : {
                language: "*igkhljm",
                /*inputs:  [""]*/
                expectedOutputs: [""],
                submitted: "jihgfdfhjkl" 
            }
        } as Request  

        checkDTO(mockRequest, mockResponse as Response, mockNext as NextFunction)

        expect(spyStatus).toHaveBeenCalled()
    })
})