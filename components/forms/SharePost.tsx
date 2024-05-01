"use client";
import { FacebookIcon, FacebookShareButton } from 'next-share'
import React from 'react'
import Image from 'next/image'

const SharePost = () => {
  return (
    // <FacebookShareButton
                               
    //                                 url={'https://github.com/next-share'}
    //                                 quote={'next-share is a social share buttons for your next React apps.'}
    //                                 hashtag={'#nextshare'}
    //                             >
    //                                 <FacebookIcon size={32} round />
    //                             </FacebookShareButton>
        <Image
                                    src='/assets/share.svg'
                                    alt="heart"
                                    width={24}
                                    height={24}
                                    className="cursor-pointer object-contain" ></Image> 
  )
}

export default SharePost