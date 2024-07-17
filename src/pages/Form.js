import React, { useState } from 'react'

import { useNavigate } from 'react-router-dom'

const Form = ({ isSignInPage = false }) => {
  const [data, setData] = useState({
    ...(!isSignInPage && { fullName: '' }),
    email: '',
    password: ''
  })
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(data)
    const res = await fetch(`https://chatapp-backend-o1em.onrender.com/${isSignInPage ? 'signin' : 'signup'}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    if (res.status === 400) {
      alert('Fill all fields')
    } else {
      const resData = await res.json()
      if (resData.token) {
        localStorage.setItem('user:token', resData.token)
        localStorage.setItem('user:detail', JSON.stringify(resData.user))
        navigate('/')
      } else {
        alert(resData)
      }
    }
  }
  if (!localStorage.getItem('user:token')) {
    return <div><h1>You are not logged in</h1></div>;
  }
  return (
    <div className='h-screen flex flex-col items-center justify-center bg-gray-100'>
      <div className='bg-white w-full max-w-md p-8 shadow-lg rounded-lg flex flex-col justify-center items-center'>
        <h1 className='text-4xl font-extrabold mb-6'>
          Welcome {isSignInPage && 'back'}
        </h1>
        <form className="flex flex-col items-center w-full" onSubmit={(e) => { handleSubmit(e) }}>
          {!isSignInPage && (
            <input
              name='name'
              placeholder='Enter your name'
              value={data.fullName}
              onChange={(e) => setData({ ...data, fullName: e.target.value })}
              className="mb-4 p-2 w-3/4 border border-gray-300 rounded-lg"
            />
          )}
          <input
            type='email'
            name='email'
            placeholder='Enter your e-mail'
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            className="mb-4 p-2 w-3/4 border border-gray-300 rounded-lg"
          />
          <input
            name='password'
            type='password'
            placeholder='Enter a password'
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            className="mb-6 p-2 w-3/4 border border-gray-300 rounded-lg"
          />
          <button
            type="submit"
            className='w-3/4 bg-primary text-white py-2 rounded-lg mb-4 hover:bg-primary-dark transition duration-300'
          >
            {isSignInPage ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        <div className='text-center'>
          {isSignInPage ? "Don't have an account?" : "Already have an account?"}{' '}
          <span
            className='text-primary cursor-pointer underline'
            onClick={() => navigate(`/${isSignInPage ? 'signup' : 'signin'}`)}
          >
            {isSignInPage ? 'Sign up' : 'Sign in'}
          </span>
        </div>
        {!isSignInPage && (
          <div className='mt-4 text-center text-sm text-gray-600'>
            If you are not automatically redirected to your dashboard, try logging in.
          </div>
        )}
      </div>
    </div>
  )
}

export default Form
