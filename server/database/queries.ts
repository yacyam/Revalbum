const getUsers = "SELECT * FROM users"
const findByUsername = "SELECT * FROM users WHERE username = $1"
const findByEmail = "SELECT * FROM users WHERE email = $1"
const findById = "SELECT * FROM users WHERE id = $1"

const createUser = "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)"

//
// POSTS
//
const tags = "electronic, hiphop, pop, rock, punk, metal, jazz, classical"
const searchQuery = "WHERE LOWER(title) LIKE ('%' || LOWER($2) || '%')"
const getPostTemplate = "SELECT posts.id, posts.userId, username, title, description FROM posts JOIN users ON posts.userId = users.id"

function createSearchQuery(sortQuery: string, tagsQuery: undefined | string[]) {
  let orderQuery = ""
  let joinQuery = ""
  let tagQuery = ""
  let searchAndTagQ = searchQuery
  const limit = "LIMIT $1"
  if (tagsQuery !== undefined) {
    joinQuery = "JOIN posttags ON posts.id = posttags.postId"
    tagQuery = "(" + tagsQuery.reduce((prev, curr) => {
      if (prev === "") {
        return curr + " = TRUE"
      }
      return prev + " OR " + curr + " = TRUE"
    }, "") + ")"
    searchAndTagQ += " AND " + tagQuery
  }

  if (sortQuery === '') {
    orderQuery = searchAndTagQ
  }
  if (sortQuery === 'ASC' || sortQuery === 'DESC') {
    orderQuery = searchAndTagQ + " ORDER BY time_posted " + (sortQuery === 'ASC' ? 'ASC' : 'DESC')
  }
  if (sortQuery === 'LIKES') {
    joinQuery += " LEFT JOIN postlikes ON posts.id = postlikes.postId "
    orderQuery = searchAndTagQ + " GROUP BY 1, 3 " + "ORDER BY COUNT(postlikes.id) DESC"
  }
  return getPostTemplate + " " + joinQuery + " " + orderQuery + " " + limit
}

const findPostById = "SELECT posts.id, posts.userId, username, title, description, audio FROM posts JOIN users ON posts.userId = users.id WHERE posts.id = $1"
const findCommentsById = "SELECT comments.id, comments.userId, username, comment FROM comments JOIN users ON comments.userId = users.id WHERE postId = $1"
const didUserLikePost = "SELECT * FROM postlikes WHERE userId = $1 AND postId = $2"
const getAllLikes = "SELECT COUNT(*) FROM postlikes WHERE postId = $1"
const getCommentId = "SELECT comments.id FROM comments WHERE postId = $1 AND userId = $2"
const getTags = `SELECT ${tags} FROM posttags WHERE postId = $1`

const createPost = "INSERT INTO posts (userId, title, description, audio) VALUES ($1, $2, $3, $4) RETURNING id"
const createComment = "INSERT INTO comments (postId, userId, comment) VALUES ($1, $2, $3)"
const createLike = "INSERT INTO postlikes (postId, userId) VALUES ($1, $2)"
const createDefaultTags = "INSERT INTO posttags (postId) VALUES ($1)"
const createTags = `INSERT INTO posttags (postId, ${tags}) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`


const updateDescription = "UPDATE posts SET description = $1 WHERE id = $2"

const removeLike = "DELETE FROM postlikes WHERE postId = $1 AND userId = $2"
const deletePost = "DELETE FROM posts WHERE id = $1"
const deleteComments = "DELETE FROM comments WHERE postId = $1"
const deleteLikes = "DELETE FROM postlikes WHERE postId = $1"
const deleteTags = "DELETE FROM posttags WHERE postId = $1"


//
// Profile
//

const findProfileById = "SELECT id, username, contact, bio FROM users JOIN userprofile ON users.id = userprofile.userId WHERE id = $1"
const getAllPosts = "SELECT posts.id, posts.userId, username, title, description FROM posts JOIN users ON posts.userId = users.id WHERE posts.userId = $1"
const getAllPostsFromLikes = "SELECT posts.id, posts.userId, username, title, description FROM posts JOIN users ON posts.userId = users.id JOIN postlikes ON posts.id = postlikes.postId WHERE postlikes.userId = $1"

const createDefaultProfile = "INSERT INTO userprofile (userId) VALUES ($1)"

const updateContact = "UPDATE userprofile SET contact = $2 WHERE userId = $1"
const updateBio = "UPDATE userprofile SET bio = $2 WHERE userId = $1"

export {
  getUsers,
  findByUsername,
  findByEmail,
  findById,
  createUser,
  createSearchQuery,
  getAllLikes,
  getCommentId,
  findPostById,
  findCommentsById,
  getTags,
  didUserLikePost,
  createPost,
  createComment,
  createLike,
  createDefaultTags,
  createTags,
  removeLike,
  deletePost,
  deleteComments,
  deleteLikes,
  deleteTags,
  updateDescription,
  findProfileById,
  getAllPosts,
  getAllPostsFromLikes,
  createDefaultProfile,
  updateContact,
  updateBio
}