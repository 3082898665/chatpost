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
import { CloseOutlined } from '@ant-design/icons';
import { usePathname, useRouter } from 'next/navigation'
import { Threadvalidation } from '../../lib/validations/thread'
import { useOrganization } from '@clerk/nextjs'
import { createThread } from '@/lib/actions/thread,action'
import { Input } from '../ui/input'
import { useEffect, useState } from 'react'
import TagCard from '../cards/TagCard'
import style from './allcardsty.module.css'
import { addtagstar } from '@/lib/actions/recommendstar.action'
interface Props {
    userId: string;
}


export default function PostThread({ userId }: Props) {
    const router = useRouter();
    const pathname = usePathname()
    const { organization } = useOrganization();
    const [tagarray, settag] = useState([])
    useEffect(() => {
        if (tagarray.length > 5) {
            console.log('asdada')
        }
    }, [tagarray])
    console.log(organization)
    const form = useForm({
        resolver: zodResolver(Threadvalidation),
        defaultValues: {
            thread: '',
            title: '',
            accountId: userId
        }
    })

    //删除标签
    function delecttag(tag: string) {
        const newarr = tagarray.filter((item: any) => (item != tag))
        settag(newarr);
    }

    const onSubmit = async (value: z.infer<typeof Threadvalidation>) => {
        console.log(organization)
        console.log(value.title)
        await createThread({
            text: value.thread,
            author: userId,
            communityId: organization ? organization.id : null,
            path: pathname,
            title: value.title,
            tag: tagarray
        })
        addtagstar(tagarray);
        router.push("/");
    }
    return (
        <Form {...form} >
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-5 flex flex-col justify-start gap-10">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem className='flex flex-col w-full gap-3 '>
                            <FormLabel className='text-base-semibold text-light-2 ml-[5%]'>
                                title

                            </FormLabel>
                            <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                                <Input className='w-[90%] ml-[5%] h-[10%]'
                                    type='text'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="thread"
                    render={({ field }) => (
                        <FormItem className='flex flex-col w-full gap-3 '>
                            <FormLabel className='text-base-semibold text-light-2 ml-[5%]'>
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
                <div className='ml-[5%]'
                >
                    <div className='mb-[10px]'>
                        Tags
                    </div>
                    <div style={{ width: '95%', height: '45px', backgroundColor: 'rgb(31,31,34)', border: '1px solid rgb(16,16,18)', borderRadius: '10px', marginBottom: '10px' }}>
                        {tagarray.map((item, index) => {
                            return <span key={index} className={style.tags} >{item}&nbsp;&nbsp;<CloseOutlined style={{ cursor: 'pointer' }} onClick={() => delecttag(item)} /></span>
                        })}
                    </div>
                    <TagCard settags={settag} />
                </div>
                <Button type="submit"
                    className='bg-primary-500'
                >Submit</Button>
            </form>
        </Form>
    )
}
