import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'
import PostSortingValidator from 'App/Validators/PostSortingValidator';
import PostValidator from 'App/Validators/PostValidator'
import UpdatePostValidator from 'App/Validators/UpdatePostValidator';

export default class PostsController {
    public async  index({request}:HttpContextContract) {
        const validated = await request.validate(PostSortingValidator)
        let sortBy = validated.sortBy || 'created_at'
        let orderBy = validated.orderBy || 'desc'
        const page = request.input('page',1)
        const limit = request.input('limit',10)
        const userId = request.input('user_id')
        const categoryId = request.input('category_id')
        const posts = Post.query().
            if(userId,(query) => {
                query.where('user_id',userId)
            }).
            if(categoryId,(query) => {
                query.where('category_id',categoryId)
            })
            .orderBy(sortBy,orderBy)
            .preload('user')
            .preload('category')
            .preload('comments')
            .paginate(page,limit)
        return posts;
    }
    public async store({request,auth}:HttpContextContract){
        const validatedData = await request.validate(PostValidator)
        const post = await auth.user?.related('posts').create(validatedData)
        await post?.preload('user')
        await post?.preload('category')
        await post?.preload('comments')
        return post
    }
    public async show({params}:HttpContextContract){
        const post = await Post.query()
        .where('id',params.id)
        .preload('user')
        .preload('category')
        .preload('comments')
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
        await post.preload('comments')
        return post
    }
    public async destroy({params}:HttpContextContract){
        const post = await Post.findOrFail(params.id)
        return post.delete()
    }
}
