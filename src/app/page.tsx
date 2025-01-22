import FileManager from '@/components/file-manager'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-stretch p-24">
      <FileManager />
    </main>
  )
}
