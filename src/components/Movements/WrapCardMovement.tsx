import CardMovement from "./CardMovement";

export default function WrapCardMovement(){
  return (
    <section className="w-11/12 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-10 mb-30">
        {/* Descripción corta */}
        <CardMovement nro={1} description={"Café"} amount={1500} category={"Comida"} subcategory={"Chatarra"}/>

        {/* Descripción media */}
        <CardMovement nro={2} description={"Compra semanal en el supermercado del barrio"} amount={28450} category={"Comida"} subcategory={"Proteina"}/>

        {/* Descripción larga (150 caracteres exactos) */}
        <CardMovement nro={3} description={"Pago del alquiler mensual correspondiente al departamento, incluye expensas comunes, servicio de agua caliente central y mantenimiento del ascensor."} amount={185000} category={"Vivienda"} subcategory={"Alquiler"}/>

        {/* Monto negativo (gasto) */}
        <CardMovement nro={4} description={"Suscripción mensual a plataforma de streaming"} amount={-4990} category={"Ocio"} subcategory={"Entretenimiento"}/>

        {/* Monto alto */}
        <CardMovement nro={5} description={"Sueldo mensual acreditado por transferencia bancaria"} amount={950000} category={"Ingresos"} subcategory={"Salario"}/>

        {/* Monto decimal / pequeño */}
        <CardMovement nro={6} description={"Propina en cafetería"} amount={350.5} category={"Comida"} subcategory={"Salidas"}/>

        {/* Descripción sin espacios largos + categoría distinta */}
        <CardMovement nro={7} description={"Transporte: carga de tarjeta SUBE para viajes en colectivo y subte durante toda la semana laboral, ida y vuelta al trabajo diariamente."} amount={12000} category={"Transporte"} subcategory={"Público"}/>
      </section>

  )
}
