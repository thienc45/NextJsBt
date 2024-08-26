import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: '%s | Productic',
    default: 'Productic'
  }

};
export default function Home() {
  return (
    <main className="w-[700px]  h-[700px] bg-red-300 flex justify-center w-96">
      Xin chaof
    </main>
  );
}
