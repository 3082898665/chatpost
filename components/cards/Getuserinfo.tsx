import { fetchuser } from '@/lib/actions/user.actions'
import React from 'react'
import UserCard from './UserCard'

const Getuserinfo = async ({userId}:{userId:string}) => {
    const userInfo=await fetchuser(userId)
  return (
    <UserCard
    key={userInfo.id}
    id={userInfo.id}
    name={userInfo.name}
    username={userInfo.username}
    imgUrl={userInfo.image}
    personType='User'
  />
  )
}

export default Getuserinfo