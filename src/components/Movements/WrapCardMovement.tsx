import CardMovement from "./CardMovement";

export default function WrapCardMovement(){
  return (
    <section className="w-11/12 mx-auto grid grid-cols-2 md:grid-cols-3">
        <CardMovement />
        <CardMovement/>
        <CardMovement/>
      </section>
 
  )
}
