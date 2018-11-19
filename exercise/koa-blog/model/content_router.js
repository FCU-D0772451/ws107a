const Router = require('koa-router')
const router=module.exports=new Router
const content=require('./content')

router
    .get('/',content.index)
    .post('/post',content.create)
    .post('/update/:id',content.update)
    .get('/delete/:a',content.remove)
    .get('/login',content.login)
    .get('/create',content.get_create)
    .get('/edit/:id',content.get_edit)
    .get('/:email/:id',content.content_id)
    .post('/:email/:id',content.commit)
    .get('/:email',content.other_index)