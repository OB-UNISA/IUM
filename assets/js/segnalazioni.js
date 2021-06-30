
function get_segnalazione(){

    $.ajax({
        url: './segnalazioni/get',
        data: JSON.stringify({id: document.getElementById('num_segnalazione').value}),
        contentType: 'application/json; charset=utf-8', 
        type: 'POST',
        timeout: 5000,
        success: function (segnalazione) {
            document.getElementById('segnalazione_search').innerHTML = segnalazione
        },
        error: function (xhr, status, error) {
      }
    })

}

function save_segnalazione(){

    let segnalazione = {
        'specie': document.getElementById('specie').value,
        'dataRitrovamento': document.getElementById('dataRitrovamento').value,
        'numeroEsemplari': document.getElementById('numeroEsemplari').value,
        'coordinate': document.getElementById('coordinate').value,
    }

    $.ajax({
        url: './segnalazioni/save',
        data: JSON.stringify(segnalazione),
        contentType: 'application/json; charset=utf-8', 
        type: 'POST',
        timeout: 5000,
        success: function (result) {
            document.getElementById('num_segnalazione').value = result.id
            document.getElementById('code').value = result.id
            document.getElementById("code").style.display = "block";
        },
        error: function (xhr, status, error) {
      }
    })

}
