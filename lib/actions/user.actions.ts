"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";
import Community from "../models/community.model";

export async function updataUser(
userId:string,
username:string,
bio:string,
name:string,
image:string,
path:string

):Promise<void>{
connectToDB();
try {
    await User.findOneAndUpdate(
        {id:userId},
        {
            username:username.toLowerCase(),
            name,
           image,
            bio,
            onboarded:true
        },
        {upsert:true}
    );
    if(path=='/profile/edit'){
        revalidatePath(path)
    }
} catch (error:any) {
    throw new Error('Fail')
}
}
export async function fetchuser(userId:string){
    try {
         connectToDB();
        return await User.findOne({id:userId}).populate({
            path: "communities",
            model: Community,
          });
    } catch (error:any) {
        throw new Error(`this error is ${error.message}`)
    }
}
export async function fetchUserPosts(userId:string){
    connectToDB();
    try {
        const threads=await User.findOne({id:userId})
        .populate({
            path:'threads',
            model:Thread,
            populate:[ 
                {
                    path: "community",
                    model: Community,
                    select: "name id image _id", // Select the "name" and "_id" fields from the "Community" model
                  },
                 {
                path: "children",
                model: Thread,
                populate: {
                  path: "author",
                  model: User,
                  select: "name image _id", // Select the "name" and "_id" fields from the "User" model
                },
              }],
        })
               return threads

    } catch (error:any) {
        throw new Error(`this is an error ${error.message}`)
    }
}
export async function fetchlovePost(userId:string){
try {
    connectToDB();
    const threads=User.findOne({id:userId}).populate({
        path:'love',
        model:Thread,
        populate:[
             {
                path: "author",
                model: User,
                select: "name image _id", // Select the "name" and "_id" fields from the "User" model
              },
              {
             path: "children",
             model: Thread,
             populate: {
               path: "author",
               model: User,
               select: "name image _id", // Select the "name" and "_id" fields from the "User" model
             },
           }
        ]
    })
    return threads;
} catch (error:any) {
    throw new Error(`this is an error ${error}`) 
}
}
export async function fetchcollectPost(userId:string){
    try {
        connectToDB();
        const threads=User.findOne({id:userId}).populate({
            path:'collect',
            model:Thread,
            populate:[
                 {
                    path: "author",
                    model: User,
                    select: "name image _id", // Select the "name" and "_id" fields from the "User" model
                  },
                  {
                 path: "children",
                 model: Thread,
                 populate: {
                   path: "author",
                   model: User,
                   select: "name image _id", // Select the "name" and "_id" fields from the "User" model
                 },
               }
            ]
        })
        return threads;
    } catch (error:any) {
        throw new Error(`this is an error ${error}`) 
    }
    }
export async function fetchUsers({
    userId,
    searchString="",
    pageNumber=1,
    pageSize=20,
    sortBy='desc'
}:{
    userId:string
searchString?:string,
pageNumber?:number,
pageSize?:number,
sortBy?:SortOrder
    
}){
    connectToDB();
    try {
        const skipAmount=(pageNumber-1)*pageSize;
        const regex=new RegExp(searchString,'i')    //创造正则表达式，i表示不区分大小写
        const query:FilterQuery<typeof User>={
            id:{$ne:userId}
        }
      // 创建一个初始的查询对象，用于过滤用户。查询对象中，排除了当前用户的 id ，并且如果搜索字符串不为空，就使用 $or 运算符来匹配用户名或姓名字段。
    if (searchString.trim() !== "") {
        query.$or = [
          { username: { $regex: regex } },
          { name: { $regex: regex } },
        ];
      }
  
      // 定义一个排序选项对象，根据 createdAt 字段和提供的排序顺序来对获取的用户进行排序。
      const sortOptions = { createdAt: sortBy };
  //使用 User.find (query) 方法来查找符合条件的用户，并使用 .sort (sortOptions) ， .skip (skipAmount) 和 .limit (pageSize) 方法来进行排序和分页。
      const usersQuery = User.find(query)
        .sort(sortOptions)
        .skip(skipAmount)
        .limit(pageSize);
          // 使用 User.countDocuments (query) 方法来计算符合搜索条件的用户总数（不分页）。
    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    //检查是否还有更多的用户在当前页之后，并将结果赋值给 isNext 变量。
    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
    } catch (error) {
        
    }
}
export async function getAacivity(userId:string){
    connectToDB();
    try {
         const userThreads=await Thread.find({author:userId});
         const childThreadIds=userThreads.reduce((acc,userThread)=>{//acc是累加器，表示上一次调用函数的返回值，usethread表示数组中的一个用户线程。
            return acc.concat(userThread.children)  //表示累加器和当前线程返回起来得到一个包含说有线程id的数组
         },[])
         const replies = await Thread.find({
            _id: { $in: childThreadIds }, //只查找id在childthread里面的
            author: { $ne: userId }, // 派出自己的帖子
          }).populate({
            path: "author",
            model: User,
            select: "name image _id",
          });
          return replies;
    } catch (error:any) {
        throw new Error(`this is an error ${error.message}`)
    }
}
export async function savelikethread(userId:string,threadId:string,authorId:string){
try {
    connectToDB();
    const auth=await fetchuser(authorId);

    await User.findOneAndUpdate({id: userId}, {
        $push: {love: threadId}, // 向love数组中添加帖子id

      });
      if(!auth.getlove){
      await  User.findOneAndUpdate({id: authorId}, {$set: {getlove: 1}});
      }else{
        await User.findOneAndUpdate({id: authorId}, {
            $inc:{getlove:1}
    
          });
      }
     
} catch (error:any) {
    throw new Error('Fail')
}
}
export async function delectlikethread(userId:string,threadId:string,authorId:string){
    try {
        connectToDB();
       await User.findOneAndUpdate({id: userId}, {
        $pull: {love: threadId}, // 向love数组中添加帖子id
      });
      await User.findOneAndUpdate({id: authorId}, {
        $inc:{getlove:-1}

      });
    } catch (error:any) {
        throw new Error('Fail')
    }
    }
export async function addsubscribe(currentId:string,authorId:string){
try {
     connectToDB();
     const userInfo=await User.findOne({id:currentId});
     const authInfo=await User.findOne({id:authorId});
     await authInfo.funs.push(currentId)
     await userInfo.interes.push(authorId);
     userInfo.save();
     authInfo.save();

} catch (error:any) {
    throw new Error('Fail')
}
}
export async function delectsubscribe(userId:string,authorId:string){
    try {
        connectToDB();
       const userInfo=await fetchuser(userId);
       const authInfo=await fetchuser(authorId);
       await userInfo.updateOne({ $pull: { interes: authorId } });
       await authInfo.updateOne({ $pull: { funs: userId } });
    } catch (error:any) {
        throw new Error('Fail')
    }
    }
export async function collectPosts(userId:string,threadId:string){
    try {
        connectToDB();
        await User.findOneAndUpdate({id: userId}, {
            $push: {collect: threadId}, // 向love数组中添加帖子id
          });
    } catch (error:any) {
        throw new Error('this is an error')
    }
}
export async function delectcollectPosts(userId:string,threadId:string){
    try {
        connectToDB();
        await User.findOneAndUpdate({id: userId}, {
            $pull: {collect: threadId}, // 向love数组中添加帖子id
          });
    } catch (error:any) {
        throw new Error('this is an error')
    }
}