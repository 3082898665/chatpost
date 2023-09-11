import {currentUser} from '@clerk/nextjs'
import styles from '../page.module.css'
import {redirect} from 'next/navigation'
import { fetchuser } from '@/lib/actions/user.actions'
import PostThread from '@/components/forms/PostThread';
async function page(){
 const user=await currentUser();
 if(!user) return null;
 const userInfo=await fetchuser(user.id);
   if(!userInfo.onboarded) redirect('/onboarding')



  return (
    <div className={styles.all} style={{position:'relative',paddingLeft :"1%"}}>
<h1 style={{fontSize:"25px",fontWeight:'600'}}>Content title</h1>
<PostThread userId={userInfo._id}></PostThread>
    </div>
  )
}

export default page