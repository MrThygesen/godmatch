import LeadForm from "@/components/LeadForm"

export default function Page(){

return(

<div className="max-w-6xl mx-auto px-4 mt-10">

<h1 className="text-4xl font-bold mb-4">
Få en tømrer til at vurdere dit byggeprojekt
</h1>

<p className="text-gray-600 mb-8">
Indhent tilbud på terrasse, gulve eller tilbygning
</p>

<LeadForm
  category="toemrer"
  tasks={[
    "Terrasse",
    "Nyt gulv",
    "Tilbygning",
    "Carport",
    "Tagkonstruktion", 
    "Andet"
  ]}
/>

</div>

)

}
