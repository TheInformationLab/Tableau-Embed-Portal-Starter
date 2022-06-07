import Image from 'next/image'
import dynamic from 'next/dynamic'
import config from '../config.json'

import useSWR from 'swr'
import Header from '../components/Header'
import ProjectCard from '../components/ProjectCard'
import { fetcher } from '../lib/func'
const SignIn = dynamic(() => import('../components/SignIn'), { ssr: false })
import { useLocalStorage } from 'react-use'
import Layout from '../components/Layout'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import Breadcrumb from '../components/BreadCrumb'

export default function Home() {
  const [userName, setUserName, removeUserName] = useLocalStorage<string>(
    'username',
    config.userName || ''
  )
  const [password, setPassword, removePassWord] = useLocalStorage<string>(
    'password',
    config.password || ''
  )
  const [signedIn, setSignedIn, removeSignedIn] = useLocalStorage<boolean>(
    'singedIn',
    false
  )
  const { data, error } = useSWR(
    signedIn ? '/api/tableau/projects' : null,
    fetcher,
    {
      revalidateIfStale: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  )
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    console.log({ signedIn })
  }, [signedIn])

  useEffect(() => {
    function checkLoggedIn() {
      const item = localStorage.getItem('signedIn')
      console.log('Checking log in status')
      if (item) {
        console.log('You are logged in!', item)
      }
    }

    window.addEventListener('storage', checkLoggedIn)

    return () => {
      window.removeEventListener('storage', checkLoggedIn)
    }
  }, [])

  return (
    <>
      <Head>
        <title>{config.siteName}</title>
      </Head>
      {!signedIn && isClient && (
        <div className="h-full">
          <SignIn
            setUserName={setUserName}
            setPassword={setPassword}
            setSignedIn={setSignedIn}
          />
        </div>
      )}
      {signedIn && isClient && (
        <Layout>
          {!data && signedIn && !error && isClient && (
            <p className="text-2xl mt-6">Loading... </p>
          )}
          {error && !data && signedIn && isClient && (
            <p className="text-2xl mt-6 text-red-600">
              An Error occured, have you configured your env variables?{' '}
            </p>
          )}
          {signedIn && isClient && !error && data && (
            <div className="flex min-h-screen flex-col items-center justify-center py-2">
              <main className="flex w-full flex-1 flex-col items-center  px-20 text-center mt-8">
                <h1 className="text-4xl font-bold">
                  Welcome to your{' '}
                  <a className="text-blue-600" href="https://nextjs.org">
                    Tableau Portal
                  </a>
                </h1>

                <p className="mt-3 text-2xl">
                  This is a list of all projects in your
                  <code className="rounded-md bg-gray-100 p-3 font-mono text-lg">
                    Tableau Server / Tableau Cloud Site
                  </code>
                </p>
                {data && (
                  <div className="h-full mt-6 flex max-w-7xl flex-wrap items-center justify-around sm:w-full">
                    {data?.projects.project.map((project: any, idx: number) => {
                      return (
                        <ProjectCard
                          key={idx}
                          name={project.name}
                          description={project.description}
                        />
                      )
                    })}
                  </div>
                )}
              </main>

              <footer className="flex h-24 w-full items-center justify-center border-t mt-6">
                <a
                  className="flex items-center justify-center gap-2"
                  href="https://www.andredevries.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Created by Andre de Vries{' '}
                  <Image
                    src="/image_andre.webp"
                    alt="Andre Image"
                    width={36}
                    height={36}
                  />
                </a>
              </footer>
            </div>
          )}
        </Layout>
      )}
    </>
  )
}
