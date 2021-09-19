import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'
import CommentValidator from 'App/Validators/CommentValidator'

export default class CategoriesController {
    public async store({request,params,auth}:HttpContextContract){
        const {content} = await request.validate(CommentValidator)
        const post = await Post.findOrFail(params.post_id)
        const comment = await post.related('comments').create({
            userId: auth.user?.id,
            content,
        })  
        
        await comment.preload('user')
        await comment.preload('post')
        return comment
    }
}
