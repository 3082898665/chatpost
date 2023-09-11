"use server"
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import Community from "../models/community.model";
import { connectToDB } from "../mongoose";
interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string
}
export async function createThread({ text, author, communityId, path }: Params) {
  try {
    connectToDB();
    console.log(communityId)
    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    const createdThread = await Thread.create({
      text,
      author,
      community: communityIdObject, // Assign communityId if provided, or leave it null for personal account
    });

    // Update User model
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });

    if (communityIdObject) {
      // Update Community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { threads: createdThread._id },
      });
    }
    revalidatePath(path)
  } catch (error:any) {
    throw new Error(`this is an error ${error.message}`)
  }
    
}
export const fetchposts = async (pageNumber = 1, pageSize = 20) => {
    connectToDB();
    const skipAmount = (pageNumber - 1) * pageSize;
    const pageQuery = Thread.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    }) .populate({
      path: "community",
      model: Community,
    })
    .populate({
      path: "children", // Populate the children field
      populate: {
        path: "author", // Populate the author field within children
        model: User,
        select: "_id name parentId image", // Select only _id and username fields of the author
      },
    });
    const totalPOostCount = await Thread.countDocuments({ parentId: { $in: [null, undefined] } });
    const postnum = await pageQuery.exec()
    const isNext = totalPOostCount > postnum.length + skipAmount;
    return { postnum, isNext }

}
export const fetchThreadById=async (threadId:string)=>{
connectToDB();
try {
  const thread = await Thread.findById(threadId)
  .populate({
    path: "author",
    model: User,
    select: "_id id name image",
  }) // 获取作者的id name image
  .populate({
    path: "children", // 获取子评论的信息
    populate: [
      {
        path: "author", // 获取子评论作者的信息
        model: User,
        select: "_id id name parentId image", // 获取 _id and username fields of the author
      },
      {
        path: "children", // 获取 子评论的子评论信息
        model: Thread, // 嵌套子项的模型（假设它是相同的“线程”模型）
        populate: {
          path: "author", //填充嵌套子项中的作者字段
          model: User,
          select: "_id id name parentId image", // 仅选择作者的_id和用户名字段
        },
      },
    ],
  })
  .exec();
return thread
} catch (error:any) {
  throw new Error(`Error fetching thread:${error.message}`)
}
}
export async function addCommenToThread(
  threadId:string,
  commentText:string,
  userId:string,
  path:string,
){
connectToDB();
 try {
   const originalThread= await Thread.findById(threadId);
   if(!originalThread) throw new Error(`this is an errror`);
   const commentThread=new Thread({
    text:commentText,
    parentId:threadId,
    author:userId
   });
   const saveCommThread=await commentThread.save();
   //将评论的子评论存储起来
   await originalThread.children.push(saveCommThread._id);
   //保存
   await originalThread.save();
   revalidatePath(path);

 } catch (error:any) {
  throw new Error(`this is an ${error.message}`)
 }
}