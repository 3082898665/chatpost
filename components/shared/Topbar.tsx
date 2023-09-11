"use client"
import React from 'react'
import style from './Top.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { OrganizationSwitcher, SignOutButton, SignedIn } from '@clerk/nextjs'
import {dark} from '@clerk/themes'
const Topbar = () => {
  const router=useRouter()
  return (
    <nav className={style.dao}>
  <Link href='/' className={style.Tlink}>
    <Image src='/assets/catlogo.png' className={style.picc} width={80} height={100} alt='null'>
    </Image>
    <p className={style.headfont}>
    Chating and Posting System
    </p>
  </Link>
  <div className={style.rig}>
    <div  className={style.rr} title='sign out'>
   
    {/* <SignedIn >
  <SignOutButton 
  signOutCallback={()=>{
  router.push('/sign-in')
  }
}>
<Image alt='signout' src='/assets/goout.png' width={30} height={30}>
</Image>

  </SignOutButton>
</SignedIn> */}
    </div>
 
<OrganizationSwitcher
appearance={{
  baseTheme:dark,
  elements:{
    organizationSwitcherTrigger:
    "py-2 px-4"
  }
}}/>
  </div>

    </nav>
  )
}

export default Topbar