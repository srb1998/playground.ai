import Link from "next/link"

const Navbar = () => {
  return (
    <nav className="w-full max-w-7xl relative top-0 flex justify-between h-[60px] backdrop-blur-sm bg-opacity-90 bg-blue-500 p-6">
        <Link href="/" className="flex items-center mx-5">
            <p className="text-2xl text-white font-bold">Playground.ai</p>
        </Link>
        <div className="sm:flex hidden">
            <div className="flex gap-3 md:gap-5 mx-3 sm:mx-10 items-center">
                <Link href="/" className="text-lg font-bold text-white hover:text-blue-100">
                    Summarize
                </Link>
                <Link href="/text-to-speech" className="text-lg font-bold text-white hover:text-blue-100">
                    Text2Speech
                </Link>
            </div>
        </div>
        {/* <div className="text-white text-2xl font-bold">
            <a href="/">Document.ai</a>
        </div>
        <div className="relative">
            <a href="/" className="text-white">Summarizer</a>
            <a href="/chat-with-doc" className="text-white">Chatbot</a>
        </div> */}
    </nav>
  )
}

export default Navbar