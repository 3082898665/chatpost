import { fetchposts } from '@/lib/actions/thread,action';
import styles from './page.module.css'
import { currentUser } from "@clerk/nextjs";
import ThreadCard from '@/components/cards/ThreadCard';
import Testpp from '@/components/cards/Testpp';
import { redirect } from 'next/navigation';
export default async function Home() {

  const results = await fetchposts(1, 30);
  let user = await currentUser();
  if (!user){
    return <p>未登录</p>;
  }



  return (
    <div className={`${styles.all} `} style={{ paddingBottom: '20px' }}>
      <h1 className='head-text text-left ml-[2%]'> Home</h1>
      {/* <Testpp/> */}
      <div className='mt-9 flex flex-col gap-10'>
        {results.postnum.length == 0 ?
          <>
            <p className='no-results'>
              this is not exist posts
            </p>
          </> :
          <>
            {results.postnum.map((post) => (
              <ThreadCard
                key={post._id}
                id={post._id}
                currentUserId={user.id||organization.id|| ""}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
              />
            ))}
          </>
        }
      </div>
    </div>
  )
}
