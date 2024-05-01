import * as z from 'zod'
export const Threadvalidation=z.object({
    thread:z.string().nonempty().min(3,{message:'Minimum is 3 character'}),
    title:z.string().nonempty().min(3,{message:'Minimum is 3 character'}),
accountId:z.string()
})
export const Commentvalidation=z.object({
    thread:z.string().nonempty().min(3,{message:'Minimum is 3 character'}),
})