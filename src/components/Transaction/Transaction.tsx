import Menu from "../Menu";
import TitleTransaction from "./TitleTransaction";

export default function Transaction(){
    return <>
        <TitleTransaction/>
        <form>
          <section className="w-11/12 mx-auto">
            <h3>Datos Cabecera</h3>
            <div>
              <label>Categoria</label>
              <select>
                <option>--Selecciona--</option>
            </select>
            </div>
            <label>Subcategoria</label> 
            <select>
              <option>--Selecciona--</option>
            </select>
             <label>Tipo</label> 
            <select>
              <option>--Selecciona--</option>
            </select>
            <label>Fecha ingreso</label>
            <input type="date"/>
            <label>Fecha vencimiento</label>
            <input type="date"/>
          </section>  
          <section className="w-11/12 mx-auto">
            <h3>Detalle</h3>
            <div>
              <label>Monto</label>
              <input type="number"/>
            </div>
             <div>
              <label>Pagado/Terminado</label>
              <input type="checkbox"/>
            </div>
            <div>
              <label>Cantidad cuotas</label>
              <input type="number"/>
            </div>
            <div>
              <label>Día vencimiento cuota</label>
              <input type="date"/>
            </div>
          </section>
        </form> 
        <Menu/>
    </>
}
