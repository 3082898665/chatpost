import { fetchUserPosts, fetchlovePost,fetchcollectPost, fetchuser } from '@/lib/actions/user.actions'
import React from 'react'
import ThreadCard from '../cards/ThreadCard';
import { redirect } from 'next/navigation'
import { fetchCommunityPosts } from '@/lib/actions/community.actions';
import { currentUser } from "@clerk/nextjs";
interface Props {
  currentUserId: string,
  accountId: string,
  accountType: string,
  islove:string
}

const LoveandcollPosts = async ({
  currentUserId,
  accountId,
  accountType,
  islove
}: Props) => {
  let results: any;
  const user = await currentUser();
  if (!user) return null;
  const userInfo=await fetchuser(currentUserId)
  if(islove=='Like'){
    results=await fetchlovePost(currentUserId);
    if (!results) redirect('/')
    return (
        <div className='mt-9 flex flex-col gap-10'>
          {results.love.map((thread: any) => {
            return (
              <ThreadCard
                key={thread._id}
                id={thread._id}
                currentUserId={currentUserId}
                parentId={thread.parentId}
                content={thread.text}
                author={{
                  name: thread.author.name, image: thread.author.image, id: thread.author.id
                }}
                community={accountType === 'User' ?thread.community:{
                  name:results.name,
                  image:results.image,
                  id:results.id
                }}
                createdAt={thread.createdAt}
                comments={thread.children}
                islike={userInfo.love.includes(thread._id) ? true : false}
                isinterest={userInfo.interes.includes(thread.author.id) ? true : false}
                iscollect={userInfo.collect.includes(thread._id) ? true : false}
              />
            )
    
          })}
        </div>
      )
  }else{
    results=await fetchcollectPost(currentUserId)
    if (!results) redirect('/')
    return (
        <div className='mt-9 flex flex-col gap-10'>
          {results.collect.map((thread: any) => {
            return (
              <ThreadCard
                key={thread._id}
                id={thread._id}
                currentUserId={currentUserId}
                parentId={thread.parentId}
                content={thread.text}
                author={{
                  name: thread.author.name, image: thread.author.image, id: thread.author.id
                }}
                community={accountType === 'User' ?thread.community:{
                  name:results.name,
                  image:results.image,
                  id:results.id
                }}
                createdAt={thread.createdAt}
                comments={thread.children}
                islike={userInfo.love.includes(thread._id) ? true : false}
                isinterest={userInfo.interes.includes(thread.author.id) ? true : false}
                iscollect={userInfo.collect.includes(thread._id) ? true : false}
              />
            )
    
          })}
        </div>
      )
  }


  
}

export default LoveandcollPosts