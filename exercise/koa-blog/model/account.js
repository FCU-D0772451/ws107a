const mongoose=require('mongoose')
const Schema = mongoose.Schema;
var Hashids = require('hashids');
const Account_data = new Schema({
    account: String,
    name:String,
    password: String
});
const Account=mongoose.model('account',Account_data);
async function login(ctx)
{
    if(ctx.session.body!=null)
    ctx.redirect('/')
    else 
    await ctx.render('login',{user:ctx.session})
}
async function post_register(ctx)
{
    var body=await ctx.request.body
    var hashpassord = new Hashids(body.password);
    var hash_password=hashpassord.encode(1, 2, 3)
    var body_data={
        account:body.account,
        name:body.account_name,
        password:hash_password
    }
    account_save=new Account(body_data)
    docs=await account_save.save()
    ctx.session.body=docs
    ctx.redirect(`/${ctx.session.body.account}`);
}
async function post_login(ctx)
{
    var body=await ctx.request.body
    var hashpassord = new Hashids(body.password);
    var hash_password=hashpassord.encode(1, 2, 3)
    var body_data={
        account:body.account,
        password:hash_password
    }
    dosc=await Account.find(body_data)
    if(dosc.length==1)
    {
    ctx.session.status=null
    ctx.session.body=dosc[0]
    ctx.redirect(`/${ctx.session.body.account}`);
    }
    else
    {
        ctx.session.status='yes'
        ctx.session.body=null;
        ctx.redirect('/login');
    }
}
async function logout(ctx){
    ctx.session.body=null
    ctx.redirect('/login');
}
module.exports={
    post_login:post_login,
    logout:logout,
    post_register:post_register,
    post_email:async function(ctx){
        let body=await ctx.request.body;
        console.log(body);
        dosc=await Account.find(body)
        console.log(dosc);
        if(dosc.length>= 1)
        ctx.body='false';
        else
        ctx.body='true';
    },
    search:async function(ctx)
    {
        let search=await ctx.request.body.search;
        dosc=await Account.find({},['name','account'])
        var allsearch=[];
        for(content of dosc)
        {
            if(content.name.indexOf(search)!=-1 || content.account.indexOf(search)!=-1)
            {
                allsearch.push(content);
            }
        }
        await ctx.render('search',{user:ctx.session.body.name,search:allsearch})
    }
}