import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Study Smart</h1>
      <Link href={"./study/plinko"}>Start Studying</Link>
    </main>
  )
}
