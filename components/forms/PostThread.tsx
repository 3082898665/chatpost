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
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from "zod"
import { useUploadThing } from '@/lib/uploadting'
import { usePathname, useRouter } from 'next/navigation'
import { Threadvalidation } from '../../lib/validations/thread'
import { useOrganization } from '@clerk/nextjs'
import { createThread } from '@/lib/actions/thread,action'
interface Props {
    userId: string;
  }
  

export default function PostThread({ userId }:Props){
    const router = useRouter();
    const pathname = usePathname()
    const {organization} =useOrganization();
    console.log(organization)
    const form = useForm({
        resolver: zodResolver(Threadvalidation),
        defaultValues: {
            thread: '',
            accountId: userId
        }
    })
    const onSubmit = async (value:z.infer<typeof Threadvalidation>) => {
        console.log(organization)
   await createThread({
    text:value.thread,
    author:userId,
    communityId:organization?organization.id:null,
    path:pathname
   })
   router.push("/");
    }
    return (
        <Form {...form} >
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-5 flex flex-col justify-start gap-10">
                <FormField
                    control={form.control}
                    name="thread"
                    render={({ field }) => (
                        <FormItem className='flex flex-col w-full gap-3 '>
                            <FormLabel className='text-base-semibold text-light-2'>
                                content

                            </FormLabel>
                            <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                                <Textarea className='w-[90%] ml-[5%]'
                                    rows={10}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit"
                    className='bg-primary-500'
                >Submit</Button>
            </form>
        </Form>
    )
}
