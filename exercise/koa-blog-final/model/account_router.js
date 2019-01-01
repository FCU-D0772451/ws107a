const Router = require('koa-router')
const router=module.exports=new Router({
    prefix:'/account'
})
const action=require('./account');
router
  .post('/login',action.post_login)
  .post('/register',action.post_register)
  .get('/logout',action.logout)
  .post('/email',action.post_email)
  .post('/search',action.search)
  .get('/update',action.update)
  .post('/upload_picture',action.upload_picture)
   .get('/add_person/:id',action.add_firend)
   .post ('/find',action.friend_find)