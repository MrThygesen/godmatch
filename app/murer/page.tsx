import LeadForm from "@/components/LeadForm"

export default function Page(){

return(

<div className="max-w-6xl mx-auto px-4 mt-10">

<h1 className="text-4xl font-bold mb-4">
Få en murer til at vurdere dit byggeprojekt
</h1>

<p className="text-gray-600 mb-8">
Skal du ha ændret dit hus eller bygge nyt?
</p>

<LeadForm
  category="murer"
  tasks={[
    "Facaderenovering",
    "Tilbygning",
    "Pudsning",
    "Fundament",
    "Fliser"
  ]}
/>

</div>

)

}
