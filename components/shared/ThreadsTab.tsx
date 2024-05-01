import { fetchUserPosts, fetchuser } from '@/lib/actions/user.actions'
import React from 'react'
import ThreadCard from '../cards/ThreadCard';
import { redirect } from 'next/navigation'
import { fetchCommunityPosts } from '@/lib/actions/community.actions';
import { currentUser } from "@clerk/nextjs";
interface Props {
  currentUserId: string,
  accountId: string,
  accountType: string
  isreply?: Boolean
}

const ThreadsTab = async ({
  currentUserId,
  accountId,
  accountType,
  isreply
}: Props) => {
  let result: any;
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchuser(user.id);

  if (accountType == 'Community') {
    result = await fetchCommunityPosts(accountId)
  } else {
    result = await fetchUserPosts(currentUserId);
  }
  if (!result) redirect('/')
  if (!isreply) {
    return (
      <div className='mt-9 flex flex-col gap-10'>
        {result.threads.map((thread: any) => {
          return (
            <ThreadCard
              key={thread._id}
              id={thread._id}
              currentUserId={currentUserId}
              parentId={thread.parentId}
              content={thread.text}
              author={accountType === 'User' ? {
                name: result.name, image: result.image, id: result.id
              } : {
                name: thread.author.name, image: thread.author.image, id: thread.author.id
              }}
              community={accountType === 'User' ? thread.community : {
                name: result.name,
                image: result.image,
                id: result.id
              }}
              createdAt={thread.createdAt}
              comments={thread.children}
              title={thread.title}
              tags={thread.tag ? thread.tag : null}
              islike={userInfo.love.includes(thread._id) ? true : false}
              isinterest={userInfo.interes.includes(thread.author.id) ? true : false}
              iscollect={userInfo.collect.includes(thread._id) ? true : false}
            />
          )

        })}
      </div>
    )
  }
  if (isreply) {
    return (
      <div>
        isreply
      </div>
    )
  }

}

export default ThreadsTab