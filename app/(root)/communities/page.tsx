import { currentUser } from '@clerk/nextjs'
import styles from '../page.module.css'
import { redirect } from 'next/navigation'
import { fetchUsers, fetchuser } from '@/lib/actions/user.actions'
import { profileTabs } from '@/constants'
import style from '../../page.module.css'
import ProfileHeader from '@/components/shared/ProfileHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image'
import ThreadsTab from '@/components/shared/ThreadsTab'
import UserCard from '@/components/cards/UserCard'
import Searchbar from '@/components/shared/Searchbar'
import { fetchCommunities } from '@/lib/actions/community.actions'
import CommunityCard from '@/components/cards/CommunityCard'
async function page({
  searchParams
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchuser(user.id);
  if (!userInfo.onboarded) redirect('/onboarding')
  const result = await fetchCommunities({
    searchString: searchParams.q,
    pageNumber: 1,
    pageSize: 25,

  })

  return (
    <div className={styles.all}>
      <h1 className='head-text mb-10 ml-[2.5%]'>Search</h1>

      <Searchbar routeType='communities' />


      <div className='mt-14 flex flex-wrap gap-9 w-[95%] ml-[2.5%]'>
        {result.communities.length === 0 ? (
          <p className='no-result'>No Result</p>
        ) : (
          <>
            {result.communities.map((community) => (
              <CommunityCard
                key={community.id}
                id={community.id}
                name={community.name}
                username={community.username}
                imgUrl={community.image}
                bio={community.bio}
                members={community.members}
              />
            ))}
          </>
        )}
      </div>

      {/* <Pagination
  path='search'
  pageNumber={searchParams?.page ? +searchParams.page : 1}
  isNext={result.isNext}
/> */}
    </div>
  )
}

export default page