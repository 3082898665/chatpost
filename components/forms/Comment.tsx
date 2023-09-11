"use client"
import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from "zod"
import { usePathname, useRouter } from 'next/navigation'
import { Commentvalidation } from '../../lib/validations/thread'
import Image from 'next/image'
import { addCommenToThread } from '@/lib/actions/thread,action'
interface Props{
  threadId:string,
  currentUserImg:string,
  currentUserId:string
}

const Comment = ({threadId,currentUserImg,currentUserId}:Props) => {

  const router = useRouter();
  const pathname = usePathname()

  const form = useForm({
      resolver: zodResolver(Commentvalidation),
      defaultValues: {
          thread: '',
      }
  })
  const onSubmit = async (value:z.infer<typeof Commentvalidation>) => {
   await addCommenToThread(threadId,value.thread,JSON.parse(currentUserId),pathname
   )
 router.push("/");
  }
  return (
    <Form {...form} >
    <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="comment-form" style={{height:'80px'}}>
        <FormField
            control={form.control}
            name="thread"
            render={({ field }) => (
                <FormItem className='flex w-full items-center gap-3 '>
                    <FormLabel className='text-base-semibold text-light-2 ml-[2%]'>
                     <Image
                     src={currentUserImg}
                     alt='Profile image'
                     className=' rounded-full object-cover'
                     width={48}
                     height={48}
                     />

                    </FormLabel>
                    <FormControl className='border-none bg-transparent'>
                        <Input 
                        className='no-focus text-light-1 outline-none w-[90%]'
                            placeholder='comment...'
                            {...field}
                        />
                    </FormControl>
                    
                </FormItem>
            )}
        />

        <Button type="submit"
            className='comment-form_btn'
            style={{position:'relative',left:'-20px'}}
        >Reply</Button>
    </form>
</Form>
  )
}

export default Comment