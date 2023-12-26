import React, { useState } from 'react'
import Input from '../components/Input'
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom'

const Form = ({
  isSignInPage=false,
}) => {
  const [data,setData]=useState({
    ...(!isSignInPage && {fullName:''}),
    email:'',
    password:'',
  })
  const navigate=useNavigate()
const handleSubmit=async(e)=>{
  e.preventDefault()
  console.log(data)
  const res=await fetch(`https://chatapp-backend-o1em.onrender.com/${isSignInPage?'signin':'signup'}`,{
    method:'POST',
    headers:{
      'Content-Type':'application/json',
    },
    body:JSON.stringify(data)
  })
  if (res.status===400) {
    alert('Fill all fields')
  }else{
    const resData=await res.json()
    if (resData.token) {
      localStorage.setItem('user:token',resData.token)
      localStorage.setItem('user:detail',JSON.stringify(resData.user))
      navigate('/dashboard')
    }else{
      alert(resData)
    }
  }
}

  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      <div className='bg-light w-[400px] h-[500px] shadow-lg rounded-lg flex flex-col justify-center items-center'>
        <h1 className=' text-4xl font-extrabold'>Welcome {isSignInPage && `back`}</h1>
        <form className="flex flex-col items-center w-full" onSubmit={(e)=>{handleSubmit(e)}}>
        {!isSignInPage && <Input label='Name' name='name' placeholder='Enter your name' value={data.fullName} onChange={(e)=>setData({...data,fullName:e.target.value})} />}
        <Input label='E-mail' type='email' name='email' placeholder='Enter your email'   value={data.email} onChange={(e)=>setData({...data,email:e.target.value})}/>
        <Input label='Password' name='password' type='password' placeholder='Enter a password'  value={data.password} onChange={(e)=>setData({...data,password:e.target.value})}/>
        <Button label={isSignInPage?'Sign In':'Sign Up'} type='submit' className='w-[75%] mb-2'/>
        </form>
        <div>{ isSignInPage ? "Don't have an account?" : "Alredy have an account?"} <span className=" text-primary cursor-pointer underline" onClick={() => navigate(`/${isSignInPage ? 'signup' : 'signin'}`)}>{ isSignInPage ? 'Sign up' : 'Sign in'}</span></div>

      </div>
      <div className='flex items-center justify-center break-words'>
          <p>{!isSignInPage?"If you are not automatically redirected to your dashboard, try logging in":""}</p>
        </div>
    </div>
  )
}

export default Form