import { pool } from "../database/index"
import * as Query from "../database/queries"
import { HomePost, Post, Comment } from "../database/Post"
import { QueryResult } from "pg"

async function createPost(
  userId: number,
  title: string,
  desc: string,
  audio: string
): Promise<void> {

  await pool.query(Query.createPost, [userId, title, desc, audio])
}

async function createComment(
  postId: string,
  userId: number,
  comment: string
): Promise<void> {
  await pool.query(Query.createComment, [postId, userId, comment])
}

async function getPosts(amount: string): Promise<HomePost[]> {
  const firstPosts: QueryResult = await pool.query(Query.getPosts, [amount])
  return firstPosts.rows
}

async function getAllLikes(postId: string): Promise<{ count: number }> {
  const allLikes = await pool.query(Query.getAllLikes, [postId])
  return allLikes.rows[0]
}

async function findById(id: string): Promise<Post | undefined> {
  const getPost: QueryResult = await pool.query(Query.findPostById, [id])
  if (getPost.rows.length === 0) {
    return undefined
  }
  return getPost.rows[0]
}

async function findCommentsById(id: string): Promise<Comment[]> {
  const getComments: QueryResult = await pool.query(Query.findCommentsById, [id])
  return getComments.rows
}

async function userLikedPost(postId: string, userId: number): Promise<boolean> {
  const isLiked = await pool.query(Query.didUserLikePost, [userId, postId])
  if (isLiked.rows.length === 0) {
    return false
  }
  return true
}

async function likePost(postId: string, userId: number): Promise<void> {
  await pool.query(Query.createLike, [postId, userId])
}

async function unlikePost(postId: string, userId: number): Promise<void> {
  await pool.query(Query.removeLike, [postId, userId])
}

export {
  getPosts,
  getAllLikes,
  createPost,
  findById,
  findCommentsById,
  userLikedPost,
  createComment,
  likePost,
  unlikePost
}

