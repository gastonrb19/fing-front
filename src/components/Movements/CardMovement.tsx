export default function CardMovement({nro, description, amount, category, subcategory}: {nro: number, description: string, amount: number, category: string,subcategory: string}){
  return (
  <article className="w-12/12 text-center">
          <h3>
            <span className="font-bold">nro:</span>
            1
          </h3>
          <p>Descripción de la carta y el movimiento que se ejecuto (title)  </p>
          <div className="hide-section">
            <p>$[Monto]</p>
            <p>Categoria</p>
            <p>Subcategoria</p>
          </div>
        </article>   

  )}
