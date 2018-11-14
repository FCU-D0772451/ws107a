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