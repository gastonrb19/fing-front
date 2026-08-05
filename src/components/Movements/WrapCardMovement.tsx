import CardMovement from "./CardMovement";

export default function WrapCardMovement(){
  return (
    <section className="w-11/12 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-10">
        <CardMovement />
        <CardMovement/>
        <CardMovement/>
      </section>
 
  )
}
