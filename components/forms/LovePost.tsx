"use client";
import { useState } from 'react'
import Image from 'next/image'
import { delectlikethread, savelikethread } from '@/lib/actions/user.actions'
const LovePost = ({
    userId,
    threadId,
    islike,
    authorId
}:
    {
        userId: string,
        threadId: string,
        islike?: Boolean,
        authorId:string
    }) => {
const [pic,setpic] =useState(islike?'/assets/love.svg':'/assets/heart.svg')
       async  function gosubmit(){
        if(pic=='/assets/heart.svg'){
            await savelikethread(userId,JSON.parse(threadId),authorId);
                setpic('/assets/love.svg')
        }else{
            await  delectlikethread(userId,JSON.parse(threadId),authorId);
            setpic('/assets/heart.svg')
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

export default LovePost