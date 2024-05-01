import { fetchposts } from '@/lib/actions/thread,action';
import styles from './page.module.css'
import { currentUser } from "@clerk/nextjs";

import { redirect } from 'next/navigation';
import { fetchuser } from '@/lib/actions/user.actions';
import React, { useEffect } from 'react';
const ThreadPosts = React.lazy(() => import('@/components/cards/ThreadCard'))
export default async function Home() {

  const results = await fetchposts(1);
  let user = await currentUser();
  if (!user) {
    return null;

  }


  const userInfo = await fetchuser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <div className={styles.all} style={{ paddingBottom: '20px' }}>
      <h1 className='head-text text-left ml-[2%]'> Home</h1>
      {/* <Testpp/> */}
      <div className='mt-9 flex flex-col gap-10'>
        {results.length == 0 ?
          <>
            <p className='no-results'>
              this is not exist posts
            </p>
          </> :
          <>
            {results.map((post, index) => (
              <ThreadPosts
                key={post._id}
                id={post._id}
                currentUserId={user?.id || ''}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
                islike={userInfo.love.includes(post._id) ? true : false}
                isinterest={userInfo.interes.includes(post.author.id) ? true : false}
                iscollect={userInfo.collect.includes(post._id) ? true : false}
                title={post.title}
                tags={post.tag ? post.tag : null}
                pageviwe={post.browserview ? post.browserview : null}
              />

            )

            )}
          </>
        }
      </div>
    </div>
  )
}
