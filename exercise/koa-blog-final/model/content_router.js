const Router = require('koa-router')
const router = module.exports = new Router
const content = require('./content')
const io = require('../app')
var chatroom;
router
    .get('/', content.index)
    .post('/post', content.create)
    .post('/update/:id', content.update)
    .get('/delete/:a', content.remove)
    .get('/login', content.login)
    .get('/create', content.get_create)
    .get('/edit/:id', content.get_edit)
    .get('/:email/:id', content.content_id)
    .post('/:email/:id', content.commit)
    .get('/:email', content.other_index)
    .post('/chatroom', async function (ctx) {
        chatroom = ctx.request.body.name
        ctx.body = "success get chatroom"
        console.log(chatroom)
    })
    io.on('connection', function (socket) {
        setTimeout(()=>{ console.log('connection')
        console.log('chatroom is %s',chatroom)
        socket.on(chatroom, function (msg) {
            console.log(chatroom);
            console.log(msg)
            io.emit(chatroom,  msg);
        });},1000)
    });