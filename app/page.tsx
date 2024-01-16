import { Hero,Navbar,Footer } from './components';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Navbar />
      <Hero />
      <Footer />
    </main>
  )
}
