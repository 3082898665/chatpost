import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { fetchuser } from '@/lib/actions/user.actions'
import { profileTabs_people } from '@/constants'
import style from '../../page.module.css'
import ProfileHeader from '@/components/shared/ProfileHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image'
import '../../../globals.css'
import dynamic from 'next/dynamic'
const ThreadTabs = dynamic(
  () => import('@/components/shared/ThreadsTab'),
  { loading: () => <p>loading...</p> }
)
const LoveCollPosts = dynamic(
  () => import('@/components/shared/LoveandcollectPosts'),
  { loading: () => <p>loading...</p> }
)
async function page({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchuser(params.id);
  if (!userInfo.onboarded) redirect('/onboarding')



  return (
    <div className={style.all} style={{ paddingBottom: '20px' }}>
      <ProfileHeader
        accountId={userInfo.id}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
      />
      <div className='mt-7 '>
        <Tabs defaultValue="threads" className="w-[95%] ml-[2.5%]" >
          <TabsList className="tab">

            {
              profileTabs_people.map((tab) => {

                return (
                  <TabsTrigger key={tab.label} value={tab.value} className="tab">
                    <Image
                      alt={tab.label}
                      src={tab.icon}
                      width={24}
                      height={24}
                      className='object-contain'
                    >

                    </Image>
                    <p className='max-sm:hidden'>
                      {tab.label}
                    </p>
                    {
                      tab.label === 'Threads' && (
                        <p className='ml-1 round-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                          {userInfo?.threads?.length}
                        </p>
                      )
                    }

                  </TabsTrigger>
                )

              })
            }
          </TabsList>
          <TabsContent
            value='threads'
            className='w-full text-light-1'
          >
            <ThreadTabs
              currentUserId={userInfo.id}
              accountId={userInfo.id}
              accountType='User'
            />
          </TabsContent>

          <TabsContent
            value='like'
            className='w-full text-light-1'
          >
            <LoveCollPosts
              currentUserId={userInfo.id}
              accountId={userInfo.id}
              accountType='User'
              islove='Like'
            />

          </TabsContent>
          <TabsContent
            value='tagged'
            className='w-full text-light-1'
          >

            <ThreadTabs
              currentUserId={userInfo.id}
              accountId={userInfo.id}
              accountType='User'
            />
          </TabsContent>
          <TabsContent
            value='collect'
            className='w-full text-light-1'
          >

            <LoveCollPosts
              currentUserId={userInfo.id}
              accountId={userInfo.id}
              accountType='User'
              islove='Collect'
            />
          </TabsContent>


        </Tabs>
      </div>

    </div>
  )
}

export default page