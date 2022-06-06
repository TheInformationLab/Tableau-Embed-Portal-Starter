import Router from 'next/router'

import React, { useEffect } from 'react'

function FakeAuth({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // onMount check if user is signed in
    const saved = localStorage.getItem('singedIn')
    // parse localstorage to boolean
    const signedIn = saved
    if (signedIn) {
      console.log('You are signed in!', signedIn)
    } else {
      console.log('You are not signed in!', signedIn)
      //   redirect back to index
      Router.push('/')
    }
    // if signedIn is true, redirect to /projects
  }, [])
  return <div>{children}</div>
}

export default FakeAuth
