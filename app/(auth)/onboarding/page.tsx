import React from 'react'
import styles from './board.module.css'
import AccountProfile from '@/components/forms/AccountProfile'
import { currentUser } from '@clerk/nextjs'
import '../../globals.css'
import { fetchuser } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation'
async function page() {
  const user = await currentUser();
  if(!user) return null;
  const userInfo = await fetchuser(user.id);
  if(userInfo?.onboarded) redirect('/')
  const userData = {
    id: user?.id,
    objectId: userInfo?._id,
    username: userInfo ? userInfo?.username : user.username,
    name: userInfo ? userInfo?.name : user.firstName ?? "",
    bio: userInfo ? userInfo?.bio : "",
    image: userInfo ? userInfo?.image : user.imageUrl,
  };
  return (
    <div className={styles.all}
    >
      <div className={styles.tit}>
        Onboarding
        
      </div>

      <p className={styles.titfont}>Now complete your profile using threads.</p>
      <div className={styles.bor}>
        <AccountProfile
        user={userData}
          btnTitle="Continue"
        />
      </div>
    </div>
  )
}

export default page