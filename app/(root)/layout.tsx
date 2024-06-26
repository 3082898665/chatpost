import { ClerkProvider } from '@clerk/nextjs'
import '../globals.css'
import type { Metadata } from 'next'
import style from './page.module.css'
import { Inter } from 'next/font/google'
import dynamic from 'next/dynamic'
import React from 'react'
const Myhead = React.lazy(() => import('@/components/shared/Topbar'))
const LeftContain = React.lazy(() => import('@/components/shared/LeftSiderbar'))
const RightFinish = dynamic(
  () => import('@/components/shared/RightSiderbar'),
  { loading: () => <section className='custom-scrollbar' style={{ margin: '0', padding: '1rem', width: '30vw', backgroundColor: 'rgb(19,20,23)', color: 'white' }}>Loading...</section> }
)
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'impossible',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang='en'>

        <head>
          <link rel="preload" href="style.css" as="style" />
        </head>
        <body className={`${inter.className}`} style={{ margin: '0', overflow: 'hidden' }}>
          <Myhead />
          <main style={{ overflow: 'hidden' }}>
            <div className={style.contain}>
              <LeftContain />
              <div style={{ height: '101vh' }}>
                {children}
              </div>
              {/* <RightSiderbar /> */}
              <RightFinish />
            </div>

          </main>
          {/* <Bottombar/> */}
        </body>
      </html>
    </ClerkProvider>
  )
}
