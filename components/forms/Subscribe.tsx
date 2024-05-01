"use client";
import { addsubscribe, delectsubscribe } from '@/lib/actions/user.actions';
import React, { useState } from 'react'
const Subscribe = ({ issub, currentid, authorid }:
  { issub?: boolean, currentid: string, authorid: string }) => {
  const [subfont, setfont] = useState(!issub ? 'subscribe' : 'subscribed')
  async function onsub() {
    if (subfont == 'subscribe') {
      await addsubscribe(currentid, authorid);
      setfont('subscribed')
    } else {
      await delectsubscribe(currentid, authorid);
      setfont('subscribe')
    }
  }
  // rgb(57 57 61)
  return (
    <span
      className='flex cursor-pointer gap-3 rounded-lg
     px-2 py-2 mt-[-5px]  h-[30px] w-[100px]'
      style={{
        lineHeight: '15px',
        backgroundColor: subfont == 'subscribe' ? 'rgb(93 86 180)' : '',
        color: subfont == 'subscribe' ? 'white' : 'rgb(193,199,198)',
        border: subfont == 'subscribe' ? 'none' : '1px solid',
        textAlign: 'center',
        paddingLeft: subfont == 'subscribe' ? '11px' : ''
      }}
      onClick={onsub}
    >
      <p className='text-light-2 max-sm:hidden'>{subfont}</p>
    </span>
  )
}

export default Subscribe