import LeadForm from "@/components/LeadForm"

export default function Page(){

return(

<div className="max-w-6xl mx-auto px-4 mt-10">

<h1 className="text-4xl font-bold mb-4">
Få elektriker eller installatør til at vurdere dit byggeprojekt
</h1>

<p className="text-gray-600 mb-8">
Installation, el-tjek eller nye løsninger
</p>

<LeadForm
  category="el"
  tasks={[
    "Nye installationer",
    "El-tjek",
    "Fejlfinding",
    "Lysinstallation",
    "Smart home", 
    "Andre Opgaver"
  ]}
/>

</div>

)

}
