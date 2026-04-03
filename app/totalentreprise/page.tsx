import LeadForm from "@/components/LeadForm"

export default function Page(){

return(

<div className="max-w-6xl mx-auto px-4 mt-10">

<h1 className="text-4xl font-bold mb-4">
Få entreprenører til at vurdere dit byggeprojekt
</h1>

<p className="text-gray-600 mb-8">
Få hele projektet samlet hos én entreprenør – fra start til slut
</p>

<LeadForm
  category="totalentreprise"
  tasks={[
    "Renovering af bolig",
    "Tilbygning",
    "Nyt hus",
    "Ombygning",
    "Erhvervsprojekt",
    "Lejlgheder",
    "Andet"
  ]}
/>

</div>

)

}
