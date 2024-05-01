import { currentUser } from '@clerk/nextjs'
import { communityTabs } from '@/constants'
import style from '../../page.module.css'
import ProfileHeader from '@/components/shared/ProfileHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image'
import ThreadsTab from '@/components/shared/ThreadsTab'
import { fetchCommunities, fetchCommunityDetails } from '@/lib/actions/community.actions'
import UserCard from '@/components/cards/UserCard'
async function page({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) return null;
  const community = await fetchCommunityDetails(params.id)


  return (
    <div className={style.all} style={{ paddingBottom: '20px' }}>
      <ProfileHeader
        accountId={community.id}
        authUserId={user.id}
        name={community.name}
        username={community.username}
        imgUrl={community.image}
        bio={community.bio}
        type='Commity'
      />
      <div className='mt-7 '>
        <Tabs defaultValue="threads" className="w-[95%] ml-[2.5%]" >
          <TabsList className="tab">

            {
              communityTabs.map((tab) => {

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
                          {community?.threads?.length}
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

            <ThreadsTab
              currentUserId={user.id}
              accountId={community._id}
              accountType='Community'
            />
          </TabsContent>

          <TabsContent
            value='reply'
            className='w-full text-light-1'
          >

            <ThreadsTab
              currentUserId={user.id}
              accountId={community._id}
              accountType='Community'
              isreply
            />
          </TabsContent>
          <TabsContent
            value='pageview'
            className='w-full text-light-1'
          >
            <section className='mt-9 flex flex-col gap-10'>
              {
                community?.members.map((member: any) => {
                  return (
                    <UserCard
                      key={member.id}
                      id={member.id}
                      name={member.name}
                      username={member.username}
                      imgUrl={member.image}
                      personType='User'

                    />

                  )
                })
              }
            </section>
          </TabsContent>
          <TabsContent
            value='appraisal'
            className='w-full text-light-1'
          >
            <ThreadsTab
              currentUserId={user.id}
              accountId={community._id}
              accountType='Community'
            />
          </TabsContent>


        </Tabs>
      </div>

    </div>
  )
}

export default page