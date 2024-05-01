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
  path: string,
  title: string,
  tag: string[] | null
}
export async function createThread({ text, author, communityId, path, title, tag }: Params) {
  try {
    connectToDB();
    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    const createdThread = await Thread.create({
      text,
      author,
      community: communityIdObject, // Assign communityId if provided, or leave it null for personal account
      title,
      tag
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
  } catch (error: any) {
    throw new Error(`this is an error ${error.message}`)
  }

}
export const fetchposts = async (pageNumber: number) => {
  const pageSize = 15;
  connectToDB();
  const skipAmount = (pageNumber - 1) * pageSize;
  const pageQuery = Thread.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    }).populate({
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
  // const totalPOostCount = await Thread.countDocuments({ parentId: { $in: [null, undefined] } });
  // const postnum = await pageQuery.exec()
  // const isNext = totalPOostCount > postnum.length + skipAmount;
  return pageQuery

}
export const fetchThreadById = async (threadId: string) => {
  connectToDB();
  try {
    const thread = await Thread.findById(threadId)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      }) // 获取作者的id name image
      .populate({
        path: "community",
        model: Community,
        select: "_id id name image",
      }) // Populate the community field with _id and name
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
  } catch (error: any) {
    throw new Error(`Error fetching thread:${error.message}`)
  }
}
export async function addCommenToThread(
  threadId: string,
  commentText: string,
  userId: string,
  path: string,
) {
  connectToDB();
  try {
    const originalThread = await Thread.findById(threadId);
    if (!originalThread) throw new Error(`this is an errror`);
    const commentThread = new Thread({
      text: commentText,
      parentId: threadId,
      author: userId
    });
    const saveCommThread = await commentThread.save();
    //将评论的子评论存储起来
    await originalThread.children.push(saveCommThread._id);
    //保存
    await originalThread.save();

  } catch (error: any) {
    throw new Error(`this is an ${error.message}`)
  }
}
export async function fetchAllChildThreads(threadId: string): Promise<any[]> {
  const childThreads = await Thread.find({ parentId: threadId });

  const descendantThreads = [];
  for (const childThread of childThreads) {
    const descendants = await fetchAllChildThreads(childThread._id);
    descendantThreads.push(childThread, ...descendants);
  }

  return descendantThreads;
}
export async function deleteThread(id: string, path: string): Promise<void> {
  try {
    connectToDB();

    // Find the thread to be deleted (the main thread)
    const mainThread = await Thread.findById(id).populate("author community");

    if (!mainThread) {
      throw new Error("Thread not found");
    }

    // Fetch all child threads and their descendants recursively
    const descendantThreads = await fetchAllChildThreads(id);

    // Get all descendant thread IDs including the main thread ID and child thread IDs
    const descendantThreadIds = [
      id,
      ...descendantThreads.map((thread) => thread._id),
    ];

    // Extract the authorIds and communityIds to update User and Community models respectively
    const uniqueAuthorIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.author?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainThread.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    const uniqueCommunityIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.community?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainThread.community?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    // Recursively delete child threads and their descendants
    await Thread.deleteMany({ _id: { $in: descendantThreadIds } });

    // Update User model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    // Update Community model
    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete thread: ${error.message}`);
  }
}
export async function addpageview(id: string, view: string) {
  try {
    connectToDB()
    const thread = await Thread.findById(id)
    console.log(view)
    if (!thread.browserview.includes(view)) {
      await thread.browserview.push(view)
      thread.save();
      console.log('11111')
    }

  } catch (error: any) {
    throw new Error(`this is an error ${error}`)
  }
}
