import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import RegisterValidator from 'App/Validators/RegisterValidator'

export default class AuthController {
    public async register({request,auth,response}: HttpContextContract){
        const validated = await request.validate(RegisterValidator)
        const user = await User.create(validated)
        const token = await auth.login(user)
        return response.ok({data: token})
    }

    public async login({request,auth,response}:HttpContextContract){
        const {email,password } = request.all()
        try{
            const token = await auth.attempt(email,password)
            return response.ok({data: token})
        }catch(error){
            return 'we could not verify your credentials'
        }
    }
}
