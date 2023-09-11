"use client"
import React, { ChangeEvent, useState } from 'react'
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
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from "zod"
import { Uservalidation } from '@/lib/validations/user'
import Image from 'next/image'
import { isBase64Image } from '@/lib/utils'
import { ourFileRouter } from '@/app/api/uploadthing/core'
import { useUploadThing } from '@/lib/uploadting'
import { fetchuser, updataUser } from '@/lib/actions/user.actions'
import {usePathname,useRouter} from 'next/navigation'
interface Props {
    user: {
        id: string,
        objectId: string,
        username: string,
        name: string,
        image: string,
        bio: string;
    },
    btnTitle: string
}
const AccountProfile = ({ user, btnTitle }: Props) => {
    const form = useForm({
        resolver: zodResolver(Uservalidation),
        defaultValues: {
            profile_photo: user?.image || "",
            name: user?.name || "",
            username: user?.username || "",
            bio: user?.bio || "",
        },
    })

    const [files, setfiles] = useState<File[]>([]);
    const handleImage = (e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
        e.preventDefault();
        const filereader = new FileReader();
        console.log(e.target.files)
        if (e.target.files && e.target.files.length > 0) {

            const file = e.target.files[0];
            setfiles(Array.from(e.target.files))
            if (!file.type.includes('image')) {
                return
            };
            filereader.onload = async (event) => {        //最后执行
                const imageDateUrl = event.target?.result?.toString() || "";
                fieldChange(imageDateUrl)
            }
            filereader.readAsDataURL(file)
        }

    }

    // 2. Define a submit handler.
const router=useRouter();
const pathname=usePathname()
    const { startUpload } = useUploadThing('media')
    async function onSubmit(values: z.infer<typeof Uservalidation>) {
        const imageurl = values.profile_photo;
        const imagechange = isBase64Image(imageurl);
        if (imagechange) {
            const imagecurrent = await startUpload(files);
            if (imagecurrent && imagecurrent[0].fileUrl) {
                values.profile_photo = imagecurrent[0].fileUrl;
            }
        }
     
await updataUser(
    user.id,
    values.username,
    values.bio,
    values.name,
    values.profile_photo,
    pathname
)
const userInfo= await fetchuser(user.id);
localStorage.setItem('systemuser',userInfo.id)
if(pathname=='/profile/edit'){
     router.back()
}else{
    router.push('/')
}

    }


    return (
        <Form {...form} >
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col justify-start gap-10">
                <FormField
                    control={form.control}
                    name="profile_photo"
                    render={({ field }) => (
                        <FormItem className='flex items-center gap-4'>
                            <FormLabel className='account-form_image-label'>
                                {
                                    field.value ? (
                                        <Image
                                            src={field.value}
                                            alt='picture'
                                            width={96}
                                            height={96}
                                            priority
                                            className='rounded-full object-contain'
                                        >

                                        </Image>
                                    ) : (
                                        <Image
                                            src="/assets/onpic.svg"
                                            alt='picture'
                                            width={24}
                                            height={24}

                                            className='object-contain'
                                        >

                                        </Image>
                                    )
                                }

                            </FormLabel>
                            <FormControl className='flex-1 text-base-semibold text-gray-200'>
                                <Input className='account-form_image-input'
                                    type='file'
                                    onChange={(e) => handleImage(e, field.onChange)}
                                    accept="image/*"
                                    placeholder='Upload a photo'

                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className='flex flex-col w-full gap-3 '>
                            <FormLabel className='text-base-semibold text-light-2'>
                                Name

                            </FormLabel>
                            <FormControl className='flex-1 text-base-semibold text-gray-200'>
                                <Input className='account-form_input no-focus'
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
                    name="username"
                    render={({ field }) => (
                        <FormItem className='flex flex-col w-full gap-3 '>
                            <FormLabel className='text-base-semibold text-light-2'>
                                UserName

                            </FormLabel>
                            <FormControl className='flex-1 text-base-semibold text-gray-200'>
                                <Input className='account-form_input no-focus'
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
                    name="bio"
                    render={({ field }) => (
                        <FormItem className=' flex-col gap-3 w-full'>
                            <FormLabel className='text-base-semibold text-light-2'>
                                Bio

                            </FormLabel>
                            <FormControl className='flex-1 text-base-semibold text-gray-200'>
                                <Textarea className='account-form_input no-focus h-28'

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

export default AccountProfile