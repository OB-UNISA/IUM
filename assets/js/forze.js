function customOnLoadForze () {
  // Event listener per bottone inserimento animali
  const dashboard = document.getElementById('dashboard')

  // Chiamo DB per ottenere tutti gli animali
  $.ajax({
    url: './forze/get',
    type: 'GET',
    timeout: 5000,
    success: function (segnalazioni) {
      // lista sidebar alla quale appendere tutti gli animali
      const myList = document.getElementById('listaSidebar')

      // append di tutti gli animali ritornati dal database
      segnalazioni.forEach((segnalazione, i) => {
        if (segnalazione.stato == 'aperta') {
          const myDiv = document.createElement('div')
          myDiv.innerHTML = "<a onclick='onListElementClick(" + segnalazione.id + ")' id='" + segnalazione.id + "' class='list-group-item list-group-item-action py-3 lh-tight' aria-current='true'><div class='d-flex w-100 align-items-center justify-content-between'><strong id='titoloAnimale' class='mb-1'>" + segnalazione.specie + "</strong><small id='dataPreview'>" + segnalazione.dataRitrovamento + "</small></div><div id='luogoPreview' class='col-10 mb-1 small'>" + segnalazione.luogoRitrovamento + '</div></a>'
          myList.appendChild(myDiv)
        }
      })
    },
    error: function (xhr, status, error) {
    }
  })
}

function onListElementClick (idSegnalazione) {
  // rendo invisibile l'input per i dettagli
  const inputDettagli = document.getElementById('divDettagliSegnalazione')
  inputDettagli.style.display = 'none'

  // rendo visibili bottoni risolvibile/non risolvibile
  const bottoniRisolvibile = document.getElementById('divPulsanti')
  bottoniRisolvibile.style.display = 'block'

  // rendo non active tutti gli elementi della lista
  const allAElements = Array.prototype.slice.call(document.getElementsByTagName('a')) // thanks stackoverflow xoxo
  allAElements.forEach((element) => {
    element.classList.remove('active')
  })

  // rendo active l'elemento che ho cliccato
  const aElement = document.getElementById(idSegnalazione)
  aElement.classList.add('active')

  // rendo visibile la dashboard
  const dashboard = document.getElementById('dashboard')
  dashboard.style.visibility = 'visible'

  // elementi da riempire
  const id = document.getElementById('idAnimale')
  const specie = document.getElementById('specie')
  const data = document.getElementById('data')
  const luogo = document.getElementById('luogo')
  const esemplari = document.getElementById('numeroEsemplari')

  // recupero dal database dettagli segnalazione
  $.ajax({
    url: './forze/getSegnalazioneDetails',
    data: { id: idSegnalazione },
    contentType: 'json',
    type: 'GET',
    timeout: 5000,
    success: function (segnalazione) {
      // riempio
      id.value = segnalazione.id
      specie.value = segnalazione.specie
      data.value = segnalazione.dataRitrovamento
      luogo.value = segnalazione.luogoRitrovamento
      esemplari.value = segnalazione.numeroEsemplari
    }
  })
}

function buttonListenerFunction (stato) {
  // rendo visibile l'input per i dettagli
  const inputDettagli = document.getElementById('divDettagliSegnalazione')
  inputDettagli.style.display = 'block'

  // nascondo bottoni risolvibile/non risolvibile
  const bottoniRisolvibile = document.getElementById('divPulsanti')
  bottoniRisolvibile.style.display = 'none'

  const bottoneChiudi = document.createElement('button')
  bottoneChiudi.id = 'confermaButton'
  bottoneChiudi.className = 'btn btn-primary btn-md center-block'
  bottoneChiudi.style = 'width: 100; margin-top: 15px'
  bottoneChiudi.innerHTML = 'Chiudi segnalazione'
  bottoneChiudi.addEventListener('click', function () {
    chiudiSegnalazione(stato)
  })

  inputDettagli.appendChild(bottoneChiudi)
}

function chiudiSegnalazione (stato) {
  const idAnimale = document.getElementById('idAnimale').value

  $.ajax({
    url: './forze/changeSegnalazioneStatus',
    type: 'GET',
    data: { id: idAnimale, stato: stato },
    contentType: 'json',
    timeout: 5000,
    success: function (users) {
      window.location.replace('/forze')
    }
  })
}
