import { currentUser } from '@clerk/nextjs'
import styles from '../page.module.css'
import { redirect } from 'next/navigation'
import { fetchUsers, fetchuser } from '@/lib/actions/user.actions'
import Searchbar from '@/components/shared/Searchbar'
import React from 'react'
const Userinfos = React.lazy(() => import('@/components/cards/UserCard'))

async function page({
  searchParams
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchuser(user.id);
  if (!userInfo.onboarded) redirect('/onboarding')
  const result: any = await fetchUsers({
    userId: user.id,
    searchString: searchParams.q,
    pageNumber: 1,
    pageSize: 25,

  })

  return (
    <div className={styles.all}>
      <h1 className='head-text mb-10 ml-[2.5%]'>Search</h1>

      <Searchbar routeType='search' />


      <div className='mt-14 flex flex-col gap-9 w-[95%] ml-[2.5%]'>
        {result.users.length === 0 ? (
          <p className='no-result'>No Result</p>
        ) : (
          <>
            {result.users.map((person: any) => (
              <Userinfos
                key={person.id}
                id={person.id}
                name={person.name}
                username={person.username}
                imgUrl={person.image}
                personType='User'
              />

            ))}
          </>
        )}
      </div>

    </div>
  )
}

export default page