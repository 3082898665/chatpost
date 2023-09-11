import React from 'react'
import styles from './board.module.css'
import AccountProfile from '@/components/forms/AccountProfile'
import { currentUser } from '@clerk/nextjs'
import '../../globals.css'
async function page() {
  const user = await currentUser();
  const userInfo = {}
  const userData = {
    id: user?.id,
    objectId: userInfo?._id,
    username: userInfo?.username||user?.username,
    name:  userInfo?.name||user?.firstName||"",
    bio: userInfo?.bio||"",
    image:userInfo?.image||user?.imageUrl,
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