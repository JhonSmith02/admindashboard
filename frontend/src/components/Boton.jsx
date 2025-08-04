
function MiPrimerBoton(){
    function handleEditClick(){
        alert(('Me hiciste click!!'));
    }

    return (
        <button onClick={handleEditClick}>
            Primer boton
        </button>
    )
}

export default MiPrimerBoton;