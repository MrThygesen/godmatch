import LeadForm from "@/components/LeadForm"

export default function Page(){

return(

<div className="max-w-6xl mx-auto px-4 mt-10">

<h1 className="text-4xl font-bold mb-4">
Få en specialist til at vurdere opsætning af badeværelse.
</h1>

<p className="text-gray-600 mb-8">
Indhent tilbud på badeværelse eller lignende opgaver.
</p>

<LeadForm
  category="badevaerelse"
  tasks={[
    "Totalrenovering",
    "Nyt badeværelse",
    "Fliser",
    "VVS arbejde", 
    "Andre Opgaver"
  ]}
/>

</div>

)

}



