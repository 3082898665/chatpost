"use client";
import { useState } from 'react'
import Image from 'next/image'
import { collectPosts, delectcollectPosts, delectlikethread, savelikethread } from '@/lib/actions/user.actions'
const CollectPost = ({
    userId,
    threadId,
    islike,
}:
    {
        userId: string,
        threadId: string,
        islike?: Boolean,
    }) => {
const [pic,setpic] =useState(islike?'/assets/collected.svg':'/assets/collect.svg')
       async  function gosubmit(){
        if(pic=='/assets/collect.svg'){
            await collectPosts(userId,JSON.parse(threadId));
                setpic('/assets/collected.svg')
        }else{
            await  delectcollectPosts(userId,JSON.parse(threadId));
            setpic('/assets/collect.svg')
        }
                
        }
    return (
        <Image
            src={pic}
            alt="heart"
            width={24}
            height={24}
            className="cursor-pointer object-contain" 
            onClick={gosubmit}
            />
    )
}

export default CollectPost