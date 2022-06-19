import type { NextPage } from "next"
import Head from "next/head"
import Image from "next/image"
import Header from "../components/Header.js"

const Home: NextPage = () => {
  return (
    <div className="my-20 mx-auto max-w-5xl">
      <Head>
        <title>Message Portal</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
    </div>
  )
}

export default Home
