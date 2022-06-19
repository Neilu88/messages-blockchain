import Image from "next/image"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import abi from "../utils/MessagePortal.json"
import { ethers } from "ethers"
import Message from "../components/Message.js"

const Header = () => {
  const [currentAccount, setCurrentAccount] = useState(null)
  const connectWallet = async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        alert("Get MetaMask!")
        return
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" })

      console.log("Connected", accounts[0])
      setCurrentAccount(accounts[0])
      getTotalMessages()
      getAllMessages()
    } catch (error) {
      console.log(error)
    }
  }

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        console.log("Make sure you have metamask!")
        return
      } else {
        console.log("We have the ethereum object", ethereum)
      }

      /*
       * Check if we're authorized to access the user's wallet
       */
      const accounts = await ethereum.request({ method: "eth_accounts" })

      if (accounts.length !== 0) {
        const account = accounts[0]
        console.log("Found an authorized account:", account)
        setCurrentAccount(account)
        getTotalMessages()
        getAllMessages()
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  const { register, handleSubmit, setValue } = useForm()

  const contractAddress = "0x8c28FA814CC339c6561f968791B6Cddf752EC3D3"
  const contractABI = abi.abi
  const [totalMessages, setTotalMessages] = useState()

  const getTotalMessages = async () => {
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const msgPortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )

        let count = await msgPortalContract.getTotalMessages()
        setTotalMessages(count.toNumber())
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getTotalMessages()
  }, [])

  const sendMessage = async (message) => {
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const msgPortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )

        /*
         * Execute the actual wave from your smart contract
         */
        const sendTxn = await msgPortalContract.sendMsg(message)

        await sendTxn.wait()
        getTotalMessages()
        getAllMessages()
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const [allMessages, setAllMessages] = useState([])
  const getAllMessages = async () => {
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const msgPortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const messages = await msgPortalContract.getAllMessages()
        console.log(messages)
        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let messagesCleaned = []
        messages.forEach((msg) => {
          messagesCleaned.push({
            address: msg.sender,
            message: msg.message,
            timestamp: new Date(msg.timestamp * 1000),
          })
        })

        /*
         * Store our data in React State
         */
        setAllMessages(messagesCleaned.reverse())
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getAllMessages()
  }, [])
  console.log(allMessages)
  return (
    <main>
      <div className="m-10 flex flex-col justify-center space-y-2 rounded-md bg-gradient-to-l from-green-200 via-green-300 to-blue-500 p-10">
        <h1 className="text-5xl font-bold">Hi! I'm Neil</h1>
        <p className="text-xl font-semibold">
          I am learning about blockchain and smart-contracts
        </p>
        <div className="relative h-96 rounded-lg border-2 border-black">
          <Image
            className="absolute object-cover"
            layout="fill"
            src="https://media.istockphoto.com/photos/blockchain-technology-on-blue-background-picture-id1153383523?k=20&m=1153383523&s=612x612&w=0&h=fhoRtSUMDQl0xG4fxmhM18eIIOyCFNVWCv1AOsTCDkk="
          />
        </div>

        <button
          onClick={connectWallet}
          className="w-full rounded-lg bg-black p-4 text-3xl font-semibold text-white"
        >
          Connect Wallet
        </button>
        <form
          onSubmit={handleSubmit((data) => {
            sendMessage(data.message)
            setValue("message", "")
          })}
          className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0"
        >
          <input
            {...register("message")}
            placeholder="Hello"
            className="flex-grow rounded-lg border border-black p-4 text-3xl font-semibold"
          />
          <button className="rounded-lg bg-black p-4 text-3xl font-semibold text-white">
            Send Message
          </button>
        </form>
        {currentAccount && (
          <h1 className="rounded-lg border border-black p-2 text-3xl font-bold">
            Total Messages: {totalMessages - 5}
          </h1>
        )}
      </div>

      {allMessages.reverse().map(({ message, timestamp, address }) => (
        <Message sender={address} message={message} timestamp={timestamp} />
      ))}
    </main>
  )
}
export default Header
