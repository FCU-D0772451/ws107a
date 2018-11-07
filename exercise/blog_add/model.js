const M = module.exports = {}

const posts = []

M.add = function (post) {
  const id = posts.push(post) - 1
  post.created_at = new Date()
  post.id = id
}

M.get = function (id) {
  return posts[id]
}

M.list = function () {
  return posts
}
M.modify=function(id,body)
{
  posts[id].title=body.title;
  posts[id].body=body.body;
}
M.del=function(id)
{
  posts.splice(id,1)
  for(let i=0;i<posts.length;i++)
  {
    if(posts[i].id>id)
    {
      posts[i].id--;
    }
  }
  return posts;
}