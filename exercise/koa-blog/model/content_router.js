const Router = require('koa-router')
const router=module.exports=new Router
const content=require('./content')

router
    .get('/',content.index)
    .post('/post',content.create)
    .post('/update',content.update)
    .get('/delete/:a',content.remove)
    .get('/login',content.login)
    .get('/create',content.get_create)
    .get('/edit/:id',content.get_edit)
    .get('/content/:id',content.content_id)
    .post('/commit/:id',content.commit)