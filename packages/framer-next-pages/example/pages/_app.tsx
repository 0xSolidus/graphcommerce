import '../demo.css'
import { PageComponent, FramerNextPages } from '@reachdigital/framer-next-pages'
import { LazyMotion } from 'framer-motion'
import { AppPropsType } from 'next/dist/next-server/lib/utils'
import dynamic from 'next/dynamic'
import { Router } from 'next/router'
import React from 'react'

const Fallback = dynamic(() => import('./index'), { ssr: false })

export default function MyApp(props: AppPropsType<Router> & { Component: PageComponent }) {
  return (
    <LazyMotion features={async () => (await import('../components/lazyMotion')).default}>
      <FramerNextPages {...props} fallback={<Fallback />} fallbackKey='/' />
    </LazyMotion>
  )
}
