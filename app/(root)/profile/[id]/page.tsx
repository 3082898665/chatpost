import {currentUser} from '@clerk/nextjs'
import styles from '../page.module.css'
import {redirect} from 'next/navigation'
import { fetchuser } from '@/lib/actions/user.actions'
import {profileTabs} from '@/constants'
import style from '../../page.module.css'
import ProfileHeader from '@/components/shared/ProfileHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image'
import ThreadsTab from '@/components/shared/ThreadsTab'
async function page({params}:{params:{id:string}}){
 const user=await currentUser();
 if(!user) return null;
 const userInfo=await fetchuser(params.id);
   if(!userInfo.onboarded) redirect('/onboarding')



  return (
    <div className={style.all} style={{paddingBottom:'20px'}}>
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
  profileTabs.map((tab)=>{

    return(
  <TabsTrigger  key={tab.label} value={tab.value} className="tab">

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
    tab.label==='Threads' &&(
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
      {profileTabs.map((tab) => (
            <TabsContent
              key={`content-${tab.label}`}
              value={tab.value}
              className='w-full text-light-1'
            >
              
              <ThreadsTab
                currentUserId={userInfo.id}
                accountId={userInfo.id}
                accountType='User'
              />
            </TabsContent>
          ))}


     </Tabs>
       </div>
       
      </div>
  )
}

export default page