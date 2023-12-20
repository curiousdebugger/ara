import { ObjectId } from "mongodb";
import { Request,Response } from "express";
import { BadRequestError, JoiRequestValidationError } from "@global/helpers/error-handler";
import { joiValidation } from "@global/decorators/joi-validation.decorators";
import { signupSchema } from "@auth/schemes/signup";
import { authService } from "@service/db/auth.service";
import { IAuthDocument, ISignUpData } from "@auth/interfaces/auth.interface";
import { Helpers } from "@global/helpers/helpers";
import { UploadApiResponse } from "cloudinary";
import { uploads } from "@global/helpers/cloudinary-upload";


export class SignUp {

    @joiValidation(signupSchema)
    public async create(req:Request, res: Response): Promise<void> {
        const {username, email, password,avatarColor, avatarImage, } = req.body;
        const user : IAuthDocument = await authService.getUserByUserNameOrEmail(username, email);
        if (user){
            throw new BadRequestError('User already exists.');
        }

        const authObjectId : ObjectId = new ObjectId();
        const userObjectId : ObjectId = new ObjectId();
        const uId = `${Helpers.generateRandomIntegers(12)}`;
        const authData : IAuthDocument = SignUp.prototype.signupData({
            _id:authObjectId,
            uId,
            username,
            email,
            password,
            avatarColor
        })

        const result : UploadApiResponse  = await uploads(avatarImage, `${userObjectId}`, true, true) as UploadApiResponse;
        if(!result.public_id){
            throw new BadRequestError('File Upload : Error occured. Try Again.');
        }

    }

    private signupData (data : ISignUpData): IAuthDocument{
        const { _id, username, email, uId, password, avatarColor} =data;
        return {
            _id,
            uId,
            username: Helpers.firstLetterUppercase(username),
            email : Helpers.lowerCase(email),
            password,
            avatarColor,
            createdAt: new Date()
        } as IAuthDocument
    }
}