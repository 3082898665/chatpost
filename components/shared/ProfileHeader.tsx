import { fetchuser } from '@/lib/actions/user.actions'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
interface Props {
    accountId: string,
    authUserId: string,
    name: string,
    username: string,
    imgUrl: string,
    bio: string,
    type?:string
}

const ProfileHeader = async ({
    accountId,
    authUserId,
    name,
    username,
    imgUrl,
    bio,
    type
}: Props) => {
    const newuser=await fetchuser(authUserId);

    return (
        <div className='flex w-full flex-col justify-start ml-[2%] mt-[2%]' >
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <div className='relative h-20 w-20 object-cover'>
                        <Image
                            className='rounded-full object-cover shadow-2xl'
                            src={imgUrl}
                            alt='profile_photo'
                            fill
                        ></Image>
                    </div>

                    <div className='flex-1'>
                       <h2 className='text-left text-heading3-bold text-light-1' >
                   {name}
                       </h2>
                       <p className='flex text-base-medium '>
                       {(accountId === authUserId && type !== "Community")?(
                        <>
                        <Link 
                        href={`/profile/import/${authUserId}/funs`}>
                        <span>funs:&nbsp;&nbsp;{newuser.funs?newuser.funs.length:'0'}</span>
                        </Link>
                       <Link 
                       href={`/profile/import/${authUserId}/subscribe`}
                       >
                       <span style={{marginLeft:'10px'}}>subscribe:&nbsp;&nbsp;{newuser.interes?newuser.interes.length:'0'}</span>
                       </Link>
                       
                        <span style={{marginLeft:'10px'}}>liked:&nbsp;&nbsp;{newuser.getlove?newuser.getlove:'0'}</span>
                        </>
                            
                       ):(
                        <>
                       <span>funs:&nbsp;&nbsp;{newuser.funs?newuser.funs.length:'0'}</span>
                        <span style={{marginLeft:'10px'}}>subscribe:&nbsp;&nbsp;{newuser.interes?newuser.interes.length:'0'}</span>
                        <span style={{marginLeft:'10px'}}>liked:&nbsp;&nbsp;{newuser.getlove?newuser.getlove:'0'}</span>
                        </>

                       )}
                   </p>
                   <p className='text-base-medium text-gray-1'>
                @{username}
                   </p>
                    </div>
                </div>
                {accountId === authUserId && type !== "Community" && (
          <Link href='/onboarding'>
            <div className='flex cursor-pointer gap-3 rounded-lg bg-dark-3 px-2 py-2 ' style={{position:'relative',left:'-10vw'}}>
              <Image
                src='/assets/edit.svg'
                alt='logout'
                width={16}
                height={16}
              />

              <p className='text-light-2 max-sm:hidden'>Edit</p>
            </div>
          </Link>
        )}


                </div>
                <p className='mt-6 max-w-lg text-base-regular text-light-2'>
                       {bio}
                </p>
                <div className='mt-12 h-0.5 w-[94%]  bg-dark-3'/>
         
        </div>
    )
}

export default ProfileHeader