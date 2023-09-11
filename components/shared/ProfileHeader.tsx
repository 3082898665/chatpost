import Image from 'next/image'
import React from 'react'
interface Props {
    accountId: string,
    authUserId: string,
    name: string,
    username: string,
    imgUrl: string,
    bio: string,
}

const ProfileHeader = ({
    accountId,
    authUserId,
    name,
    username,
    imgUrl,
    bio,
}: Props) => {
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
                   <p className='text-base-medium text-gray-1'>
                @{username}
                   </p>
                    </div>
                </div>
                </div>
                <p className='mt-6 max-w-lg text-base-regular text-light-2'>
                       {bio}
                </p>
                <div className='mt-12 h-0.5 w-[94%]  bg-dark-3'/>
         
        </div>
    )
}

export default ProfileHeader