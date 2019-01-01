const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const path = require('path')
const fs = require('fs')
var Hashids = require('hashids');
const Account_data = new Schema({
    account: String,
    name: String,
    password: String,
});
const Account_friend = new Schema({
    friend_email: String,
    friend_ID: String,
    friend_name: String,
    chatroom: String,
})
const Account = mongoose.model('account', Account_data);
async function login(ctx) {
    if (ctx.session.body != null)
        ctx.redirect('/')
    else
        await ctx.render('login', { user: ctx.session })
}
async function post_register(ctx) {
    var body = await ctx.request.body
    var hashpassord = new Hashids(body.password);
    var hash_password = hashpassord.encode(1, 2, 3)
    var body_data = {
        account: body.account,
        name: body.account_name,
        password: hash_password
    }
    account_save = new Account(body_data)
    docs = await account_save.save()
    ctx.session.body = docs
    ctx.session.picture = null
    ctx.redirect(`/${ctx.session.body.account}`);
}
async function post_login(ctx) {
    var body = await ctx.request.body
    var hashpassord = new Hashids(body.password);
    var hash_password = hashpassord.encode(1, 2, 3)
    var body_data = {
        account: body.account,
        password: hash_password
    }
    dosc = await Account.find(body_data)
    if (dosc.length == 1) {
        ctx.session.status = null
        ctx.session.body = dosc[0]
        ctx.redirect(`/${ctx.session.body.account}`);
    }
    else {
        ctx.session.status = 'yes'
        ctx.session.body = null;
        ctx.redirect('/login');
    }
}
async function logout(ctx) {
    ctx.session.body = null
    ctx.redirect('/login');
}
module.exports = {
    post_login: post_login,
    logout: logout,
    post_register: post_register,
    post_email: async function (ctx) {
        let body = await ctx.request.body;
        //console.log(body);
        dosc = await Account.find(body)
        //console.log(dosc);
        if (dosc.length >= 1)
            ctx.body = 'false';
        else
            ctx.body = 'true';
    },
    search: async function (ctx) {
        let search = await ctx.request.body.search;
        dosc = await Account.find({}, ['name', 'account'])
        var allsearch = [];
        for (content of dosc) {
            if (content.name.indexOf(search) != -1 || content.account.indexOf(search) != -1) {
                allsearch.push(content);
            }
        }
        await ctx.render('search', { user: ctx.session.body.name, search: allsearch, user_id: ctx.session.picture })
    },
    update: async function (ctx) {
        await ctx.render('account_update', { user: ctx.session.body.name, user_id: ctx.session.picture })
    },
    upload_picture: async function (ctx) {
        const file = ctx.request.files.file
        console.log(file);
        const name = ctx.session.body._id + '.jpg'
        const reader = fs.createReadStream(file.path);
        const stream = fs.createWriteStream(path.join(__dirname, '..', 'public', 'image', name));
        reader.pipe(stream);
        console.log('uploading %s -> %s', file.name, stream.path);
        ctx.session.picture = ctx.session.body._id
        ctx.redirect('/');
    },
    add_firend: async function (ctx) {
        var friend = ctx.params.id;
        var docs = await Account.findOne({ account: friend })
        var chatroom = ctx.session.body._id + docs._id;
        var friends_db = mongoose.model(`friend_${ctx.session.body.account}`, Account_friend);
        var confirm = await friends_db.find({ friend_email: friend })
        if (confirm.length == 0) {
            var body_data = {
                friend_ID: docs._id,
                friend_email: docs.account,
                friend_name: docs.name,
                chatroom: chatroom
            }
            var friends_save = new friends_db(body_data)
            var a=await friends_save.save();
            // console.log(a)
        }
        var friends_db = mongoose.model(`friend_${friend}`, Account_friend);
        var confirm = await friends_db.find({ friend_email: ctx.session.body.account })
        if (confirm.length == 0) {
            var body_data = {
                friend_ID: ctx.session.body._id,
                friend_email: ctx.session.body.account,
                friend_name: ctx.session.body.name,
                chatroom: chatroom
            }
            var friends_save = new friends_db(body_data)
            await friends_save.save();
        }
        ctx.redirect('/')
    },
    friend_find:async function(ctx){
        var friends_db = mongoose.model(`friend_${ctx.session.body.account}`, Account_friend);
        var friends = await friends_db.find({});
        ctx.body = friends;
    }
}