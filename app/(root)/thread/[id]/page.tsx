import React from 'react'
import { currentUser } from '@clerk/nextjs'
import { fetchuser } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import { addpageview, fetchThreadById } from '@/lib/actions/thread,action';
import Comment from '@/components/forms/Comment';
import style from '../../page.module.css'
import dynamic from 'next/dynamic';
const CommentPost = dynamic(
  () => import('@/components/cards/ThreadCard'),
  { loading: () => <p>loading...</p> }
)
const page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null
  const user = await currentUser()
  if (!user) return null
  const userInfo = await fetchuser(user.id)
  if (!userInfo?.onboarded) redirect('onboarding')
  const thread = await fetchThreadById(params.id)
  await addpageview(params.id, userInfo.id)

  return (
    <div className={style.all} style={{ paddingTop: '10px', paddingBottom: '20px' }}>
      <CommentPost
        id={thread._id}
        currentUserId={user?.id || ""}
        parentId={thread.parentId}
        content={thread.text}
        author={thread.author}
        community={thread.community}
        createdAt={thread.createdAt}
        comments={thread.children}
        islike={userInfo.love.includes(thread._id) ? true : false}
        isinterest={userInfo.interes.includes(thread.author.id) ? true : false}
        title={thread.title}
        tags={thread.tag ? thread.tag : null}
        pageviwe={thread.browserview ? thread.browserview : 0}
      />
      <div className='mt-7'>
        <Comment
          threadId={thread.id}
          currentUserImg={userInfo.image}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>
      <div className='mt-10'>
        {
          thread.children.map((child: any) => {
            return (
              <CommentPost
                key={child._id}
                id={child._id}
                currentUserId={child?.id || ""}
                parentId={child.parentId}
                content={child.text}
                author={child.author}
                community={child.community}
                createdAt={child.createdAt}
                comments={child.children}
                iscomment
              />
            )
          })
        }
      </div>
    </div>
  )
}

export default page