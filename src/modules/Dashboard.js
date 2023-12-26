import React, { useEffect, useRef, useState } from 'react'
import Avatar from '../assets/Avatar.svg'
import Input from '../components/Input'
// import sendIcon from '../assets/sendIcon.svg'
import {io} from 'socket.io-client'
const Dashboard = () => {

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user:detail')))
    const [people, setPeople] = useState([])
    const [conversations, setConversations] = useState([])
    const [messages, setMessages] = useState({})
    const [partner, setPartner] = useState()
    const [partnerMail, setPartnerMail] = useState()
    const [partnerId, setPartnerId] = useState()
    const [typedMessage, setTypedMessage] = useState()
    const [currentConversationId, setCurrectConversationId] = useState()
    const [socket,setSocket]=useState(null)
    const messageRef=useRef(null)

    console.log('messages :>>',messages)
    //socket io
    useEffect(()=>{
        setSocket(io('https://chatapp-backend-o1em.onrender.com/'))
    },[])

	useEffect(() => {
		socket?.emit('addUser', user?.id);
		socket?.on('getUsers', users => {
			console.log('activeUsers :>> ', users);
		})
		socket?.on('getMessage', data => {
            console.log("data :>>",data)
            console.log("data ka text : >>",data.text)
			setMessages(prev => ([...prev,{text:data.text,user:data.user}]))
		})
	}, [socket])

    // Displaying existing contacts
    useEffect(() => {
        const loggedUser = JSON.parse(localStorage.getItem('user:detail'))
        const fetchConversation = async () => {
            const res = await fetch(`https://chatapp-backend-o1em.onrender.com/conversation/${loggedUser?.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const resData = await res.json()
            setConversations(resData)
            console.log(conversations)
        }
        fetchConversation()
    }, [])

    //Dispalying all people
    useEffect(() => {
        const fetchPeople = async () => {
            const res = await fetch(`https://chatapp-backend-o1em.onrender.com/users/${user?.id}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                }
            })
            const resData = await res.json()
            // console.log(resData)
            setPeople(resData)
        }
        fetchPeople()
    }, [])


    const fetchMessages = async (conversationId) => {
        const res = await fetch(`https://chatapp-backend-o1em.onrender.com/message/${conversationId}?senderId=${user?.id}?receiverId:${partnerId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },

        })
        setCurrectConversationId(conversationId)
        const resData = await res.json()
        // console.log('resData',resData)
        setMessages(resData)
    }

    const sendMessage = async (e) => {
        setTypedMessage('')
		socket?.emit('sendMessage', {
			conversationId: currentConversationId,
            senderId: user?.id,
            text: typedMessage,
            receiverId: partnerId
		});
        const res = await fetch(`https://chatapp-backend-o1em.onrender.com/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                conversationId: currentConversationId,
                senderId: user?.id,
                text: typedMessage,
                receiverId: partnerId
            })
        })
        setTypedMessage('')
    }

    return (
        <div className='w-screen flex'>
            <div className='w-[25%]  h-screen bg-secondary overflow-scroll'>
                <div className='flex justify-center items-center my-8'>
                    <img src={Avatar} width={75} height={75} className='border border-primary p-[2px] rounded-full'/>
                    <div className='ml-4'>
                        <h2 className='text-2xl'>{user.fullName}</h2>
                        <p className='text-xl font-light'>{user.email}</p>
                    </div>
                </div>
                <hr />
                <div>
                    <div className=' text-lg mx-10 mt-10'>
                    <h1>My Contacts</h1>
                        {
                            conversations.length > 0 ?
                                conversations.map(({ user, conversationId }) => {
                                    return (
                                        <div>
                                            <div className='flex items-center my-8' onClick={() => {
                                                fetchMessages(conversationId)
                                                setPartner(user?.fullName)
                                                setPartnerMail(user?.email)
                                                setPartnerId(user?.id)
                                            }}>
                                                <img src={Avatar} width={50} height={50} />
                                                <div className='ml-4'>
                                                    <h2 className='text-2xl'>{user?.fullName}</h2>
                                                    <p className='text-xl'>{user?.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }) : <div className='text-center text-lg font-semibold mt-24'>No Contacts</div>
                        }
                    </div>
                </div>
            </div>
            <div className='w-[50%] h-screen flex flex-col items-center'>
                {
                    partnerId?
                    <div className='w-[75%] h-[80px] bg-secondary mt-14 rounded-full flex items-center px-6'>
                        <div className='cursor-pointer'><img src={Avatar} width={40} height={40} className='rounded-full'/></div>
                        <div className='ml-6 mr-auto'>
                            <h1>{partner}</h1>
                            <p>{partnerMail}</p>
                        </div>
                    </div>:<div></div>
                }
                <div className='w-[75%] w-full border overflow-scroll border-b'>
                    <div className='p-14'>
                        {
                            messages.length > 0 ?
                                messages.map(({ text, user: { id } }) => {
                                    if (id === user?.id) {
                                        return (
                                            <div className='max-w-[50%] rounded-b-xl rounded-xl bg-secondary ml-auto p-4 mb-6 break-words'>
                                                <p>{text}</p>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div className='max-w-[50%] rounded-b-xl rounded-xl bg-light p-4 mb-6 break-words'>
                                                <p>{text}</p>
                                            </div>
                                        )
                                    }
                                }) :
                                <div>Start Talking</div>
                        }
                    </div>
                </div>

                {
                    partner ?
                        <div className='w-full p-5 flex items-center'>
                            <Input placeholder='Write a message' className='w-full' value={typedMessage} onChange={(e) => setTypedMessage(e.target.value)} inputclassName='p-4 shadow-lg bg-tertiary rounded-full outline-none' />
                            <div className={`cursor-pointer ${!typedMessage && 'pointer-events-none'}`} onClick={(e) => sendMessage()}>
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-telegram" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4" />
                                </svg>
                            </div>
                        </div>
                        : <div></div>
                }
            </div>
            <div className='w-[25%] h-screen bg-light px-8 py-16 overflow-scroll'>
            <div className=' text-lg'>People</div>
                <div>
                    {
                        people.length > 0 ?
                            people.map(({ fullName, id, email }) => {
                                return (
                                    <div>
                                        <div className='flex items-center my-8' onClick={() => {
                                            fetchMessages('new')
                                            setPartner(fullName)
                                            setPartnerMail(email)
                                            setPartnerId(id)
                                        }}>
                                            <img src={Avatar} width={50} height={50} />
                                            <div className='ml-4'>
                                                <h2 className='text-2xl'>{fullName}</h2>
                                                <p className='text-xl'>{email}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                            : <div className='text-center text-lg font-semibold mt-24'>No People</div>
                    }
                </div>
            </div>

        </div>
    )
}
export default Dashboard
