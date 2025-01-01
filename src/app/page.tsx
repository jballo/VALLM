import Header from "@/components/custom/header"
import PromptForm from "@/components/custom/promptform"


export default function Home() {
  return (
    <div className="w-full min-h-screen p-12 gap-4">
      <Header />
      <PromptForm />
      <div></div>
    </div>
  );
}
