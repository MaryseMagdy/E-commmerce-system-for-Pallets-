import Link from "next/link";
export default function Home() {
  return (
    <>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet" integrity="sha384QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
        crossorigin="anonymous" />
      <h1>
        Welcome To Pallets Plus
      </h1>
      <Link href="/home"> Home </Link>
    </>

  );
}
