import { ClerkProvider } from '@clerk/nextjs'
import {Inter} from 'next/font/google'

import { Metadata } from 'next';
// import 'tailwindcss/tailwind.css'
const inter=Inter({subsets:['latin']})

export const metadata: Metadata = {
    title: "Threads",
    description: "A Next.js 13 Meta Threads App.",
  };
const Rootlayout = ({children}:{children:React.ReactNode}) => {


  return (
    <ClerkProvider>
        <html lang='en'>
<body >
{children}
</body>
        </html>
    </ClerkProvider>
  )
}

export default Rootlayout