import Header from "@/components/custom/header"
import PromptForm from "@/components/custom/promptform"
import TextComparison from "@/components/custom/textComparison";


export default function Home() {
  return (
    <div className="w-full min-h-screen p-12 flex flex-col gap-6">
      <Header />
      <PromptForm />
      <TextComparison />
    </div>
  );
}
