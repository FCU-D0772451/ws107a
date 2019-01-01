const mongoose = require('mongoose')
const Schema = mongoose.Schema;
var Hashids = require('hashids');
const post_data = new Schema({
    type: String,
    subject: String,
    content: String,
    commit: [String],
    name: [String]
});
async function post_content(ctx) {
    var body = await ctx.request.body
    let post_content = mongoose.model(ctx.session.body.account, post_data);
    var body_data = {
        type: body.type,
        subject: body.subject,
        content: body.content
    }
    content_save = new post_content(body_data)
    await content_save.save()
    ctx.redirect('/')
}
async function del_content(ctx) {
    let post_content = mongoose.model(ctx.session.body.account, post_data);
    await post_content.remove(ctx.request.query);
    ctx.redirect('/');
}
async function update_content(ctx) {
    var body = await ctx.request.body
    id = await ctx.params.id;
    let post_content = mongoose.model(ctx.session.body.account, post_data);
    body_data = {
        subject: body.subject,
        type: body.type,
        content: body.content
    }
    await post_content.updateOne({ _id: id }, body_data)
    ctx.redirect('/')
}
async function login(ctx) {
    if (ctx.session.body != null)
        ctx.redirect('/')
    else {
        await ctx.render('login', { user: ctx.session.body, status: ctx.session.status })
        ctx.session.status = null;
    }
}
async function get_index(ctx) {
    if (ctx.session.body != null) {
        //console.log(ctx.session.body);
        ctx.redirect(`/${ctx.session.body.account}`)
    }
    else
        await ctx.render('index', { user: ctx.session.body })
}
module.exports = {
    create: post_content,
    index: get_index,
    update: update_content,
    remove: del_content,
    login: login,
    get_create: async function (ctx) {
        await ctx.render('createcontent', { user: ctx.session.body.name ,user_id:ctx.session.picture})
    }
    ,
    get_edit: async function (ctx) {
        article_id = await ctx.params.id;
        let post_content = mongoose.model(ctx.session.body.account, post_data);
        dosc = await post_content.find({ _id: article_id })
        await ctx.render('editcontent', { user: ctx.session.body.name, article: dosc[0] ,user_id:ctx.session.picture});
    },
    content_id: async function (ctx) {
        let email =await ctx.params.email;
        let post_content = mongoose.model(email, post_data);
        article_id = await ctx.params.id;
        dosc = await post_content.find({ _id: article_id })
        await ctx.render('content', { user: ctx.session.body.name, article: dosc[0],email:email ,user_id:ctx.session.picture});
    },
    commit: async function (ctx) {
        let email=ctx.params.email
        let body = await ctx.request.body;
        let post_content = mongoose.model(email, post_data);
        article_id = await ctx.params.id;
        dosc = await post_content.find({ _id: article_id })
        var data = dosc[0];
        data.commit.push(body.commit)
        data.name.push(ctx.session.body.name)
        await post_content.updateOne({ _id: article_id }, data)
        var reurl = "/" + email+ "/" + article_id
        return ctx.redirect(reurl);
    },
    other_index: async function (ctx) {
        let email=await ctx.params.email;
        let isme=false;
        if(ctx.session.body.account == email)
        isme =true;
        let post_content = mongoose.model(email, post_data);
        docs = await post_content.find({})
        docs = docs.reverse();
        var alltype = typeselect(docs)
        await ctx.render('index', { email: email, user: ctx.session.body.name, articles:docs, types: alltype,me:isme,user_id:ctx.session.picture })
    }
}
function typeselect(docs) {
    var alltype = [];
    var j, flag;
    for (var i of docs) {
        flag = 0;
        for (j = 0; j < alltype.length; j++) {
            if (alltype[j].type.indexOf(i.type) != -1) {
                alltype[j].subject.push(i.subject)
                alltype[j].id.push(i._id)
                flag = 1;
            }
        }
        if (flag == 0) {
            alltype[j] = {};
            alltype[j].type = i.type;
            alltype[j].subject = [i.subject]
            alltype[j].id = [i._id]
        }
    }
    return alltype;
}