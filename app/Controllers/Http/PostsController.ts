import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PostValidator from 'App/Validators/PostValidator'

export default class PostsController {
    public async store({request,auth}:HttpContextContract){
        const validatedData = await  request.validate(PostValidator)
        const post = await auth.user?.related('posts').create(validatedData)
        return post
    }
}
