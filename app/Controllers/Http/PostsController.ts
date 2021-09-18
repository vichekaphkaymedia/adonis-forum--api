import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'
import PostValidator from 'App/Validators/PostValidator'

export default class PostsController {
    public async store({request,auth}:HttpContextContract){
        const validatedData = await  request.validate(PostValidator)
        const post = await auth.user?.related('posts').create(validatedData)
        return post
    }
    public async show({params}:HttpContextContract){
        const post = await Post.query()
        .where('id',params.id)
        .preload('user')
        .preload('category')
        .firstOrFail()
        return post
    }
}
