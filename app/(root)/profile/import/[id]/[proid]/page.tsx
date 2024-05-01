import React from 'react'
import style from '../../../../page.module.css'
import { fetchuser } from '@/lib/actions/user.actions'
import UserCard from '@/components/cards/UserCard'
import Getuserinfo from '@/components/cards/Getuserinfo'
const page =async ({params}:{params:{id:string,proid:string}}) => {
    const userInfo=await fetchuser(params.id)

  return (
    <section className={style.all}>
        <h1 className='head-text mb-10 ml-[2.5%]'>{userInfo.name}'s {params.proid}</h1>
        <div className='mt-14 flex flex-col gap-9 w-[95%] ml-[2.5%]'>
            {
                params.proid=='funs'?(
                    <>
  {userInfo.funs.length === 0 ? (
    <p className='no-result'>No Result</p>
  ) : (
    <>
      {userInfo.funs.map((person:any) => (
        <Getuserinfo
        userId={person}
        />
      ))}
    </>
  )}
                    </>
                    ):(
                        //订阅信息
                        <>
                    {userInfo.interes.length === 0 ? (
    <p className='no-result'>No Result</p>
  ) : (
    <>
      {userInfo.interes.map((person:any) => (
       <Getuserinfo
       userId={person}
       />
      ))}
                        </>
                    
                )
      }
                </>
                    )
            }

</div>
        
        </section>
  )
}

export default page