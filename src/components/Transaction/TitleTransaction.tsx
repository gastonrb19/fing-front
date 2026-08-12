export default function TitleTransaction({name = "Nueva transacción"} : {name: string}){
  return(
    <h1 className="text-4xl w-11/12 mx-auto mt-10 text-center md:text-left tracking-wider font-black underline text-cyan-900">{name}</h1>
  )
}
