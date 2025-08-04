import { useState } from "react";
import { sculptureList } from "../js/data.js";

function Galeria() {
    const [index, setIndex] = useState(0);

    function handleCancelClick() {
        setIndex(index + 1);
    }

    let sculpture = sculptureList[index];

    return (
        <>
            <button onClick={handleCancelClick}>
                Siguiente Imagen
            </button>

            <h2>
                <i>{sculpture.name}</i>
                por {sculpture.artist}
            </h2>

            <h3>
                ({index + 1} de {sculptureList.length})
            </h3>

            <img src={sculpture.url} alt={sculpture.alt} />

            <p>
                {sculpture.description}
            </p>
        </>
    )
}

export default Galeria;