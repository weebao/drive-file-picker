import FileManager from "@/components/file-manager";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-24">
      <div className="w-[1000px] min-h-[500px] p-4 border border-neutral-300 rounded-lg">
        <FileManager />
      </div>
    </main>
  );
}
