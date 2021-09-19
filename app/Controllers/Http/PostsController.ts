import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'
import PostValidator from 'App/Validators/PostValidator'
import UpdatePostValidator from 'App/Validators/UpdatePostValidator';

export default class PostsController {
    public async  index() {
        const posts = Post.query()
        .preload('user')
        .preload('category')
        return posts;
    }
    public async store({request,auth}:HttpContextContract){
        const validatedData = await  request.validate(PostValidator)
        const post = await auth.user?.related('posts').create(validatedData)
        await post?.preload('user')
        await post?.preload('category')
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
    public async update({request,params}:HttpContextContract) {
        const post = await Post.findOrFail(params.id)
        const validatedData = await  request.validate(UpdatePostValidator);
        post.merge(validatedData)
        await post.save()
        await post.preload('user')
        await post.preload('category')
        return post
    }
    public async destroy({params}:HttpContextContract){
        const post = await Post.findOrFail(params.id)
        return post.delete()
    }
}
