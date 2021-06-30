function customOnLoadForze () {
  // Event listener searchBar
  const searchButton = document.getElementById('searchButton')
  const searchInput = document.getElementById('searchInput')
  searchButton.addEventListener('click', () => {
    const inputValue = searchInput.value
    fillList(inputValue)
  })
  searchInput.addEventListener('input', () => {
    const inputValue = searchInput.value
    fillList(inputValue)
  })

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
          createListEntry(myList, segnalazione)
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
  const nomeImmagine = document.getElementById('nomeImmagine')
  const nomeImmagineModal = document.getElementById('immagineAnimaleModal')

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

      // per scegliere foto giusta
      let nomeImmagineString
      switch (segnalazione.specie.toLowerCase()) {
        case 'lupo':
          nomeImmagineString = '/assets/media/lupo.jpg'
          break
        case 'cane':
          nomeImmagineString = '/assets/media/cane.jpg'
          break
        case 'gatto':
          nomeImmagineString = '/assets/media/gatto.jpg'
          break
        case 'cinghiale':
          nomeImmagineString = '/assets/media/cinghiale.jpg'
          break
        default:
          nomeImmagineString = '/assets/media/20820a81a70a4bd79f5fa77e1efa5d33.png'
          break
      }
      nomeImmagine.removeAttribute('src')
      nomeImmagine.setAttribute('src', nomeImmagineString)

      nomeImmagineModal.removeAttribute('src')
      nomeImmagineModal.setAttribute('src', nomeImmagineString)

      // setto mappa
      mapboxgl.accessToken = 'pk.eyJ1IjoieWFudCIsImEiOiJja3FjeWZ1bzcwMmZqMnFwZ3I1b2d0dzFmIn0.PlX5QglV9zgy3oI8ILOtaw'
      const mapboxClient = mapboxSdk({ accessToken: mapboxgl.accessToken })
      mapboxClient.geocoding.forwardGeocode({
        query: segnalazione.luogoRitrovamento,
        autocomplete: false,
        limit: 1
      })
        .send()
        .then(function (response) {
          if (response && response.body && response.body.features && response.body.features.length) {
            const feature = response.body.features[0]
            const map = new mapboxgl.Map({
              container: 'mappaDiv',
              style: 'mapbox://styles/mapbox/streets-v11',
              center: feature.center,
              zoom: 15
            })
            map.addControl(new mapboxgl.FullscreenControl())
            map.addControl(new mapboxgl.NavigationControl())
            // creo marker
            new mapboxgl.Marker().setLngLat(feature.center).addTo(map)
          }
        }) // fine mappa
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

  // let bottoneChiudi = document.createElement('button');
  // bottoneChiudi.id = 'confermaButton';
  // bottoneChiudi.className = 'btn btn-primary btn-md center-block';
  // bottoneChiudi.style = 'width: 100; margin-top: 15px';
  // bottoneChiudi.innerHTML = "Chiudi segnalazione";
  const bottoneChiudi = document.getElementById('confermaButton')
  const bottoneChiudiClone = bottoneChiudi.cloneNode(true)
  // per rimuovere gli event listeners precedenti
  bottoneChiudi.parentNode.replaceChild(bottoneChiudiClone, bottoneChiudi)
  // aggiungo nuovo el
  bottoneChiudiClone.addEventListener('click', function () {
    chiudiSegnalazione(stato)
  })

  // inputDettagli.appendChild(bottoneChiudi);
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

function createListEntry (myList, segnalazione) {
  const myDiv = document.createElement('div')
  myDiv.innerHTML = "<a onclick='onListElementClick(" + segnalazione.id + ")' id='" + segnalazione.id + "' class='list-group-item list-group-item-action py-3 lh-tight' aria-current='true'><div class='d-flex w-100 align-items-center justify-content-between'><strong id='titoloAnimale' class='mb-1'>" + segnalazione.specie + "</strong><small id='dataPreview'>" + segnalazione.dataRitrovamento + "</small></div><div id='luogoPreview' class='col-10 mb-1 small'>" + segnalazione.luogoRitrovamento + '</div></a>'
  myList.appendChild(myDiv)
}

function fillList (searchInput) {
  // Chiamo DB per ottenere tutti gli animali
  $.ajax({
    url: './forze/get',
    type: 'GET',
    timeout: 5000,
    success: function (segnalazioni) {
      // lista sidebar alla quale appendere tutti gli animali
      const myList = document.getElementById('listaSidebar')
      myList.innerHTML = ''

      // append di tutti gli animali ritornati dal database
      segnalazioni.forEach((segnalazione, i) => {
        if (searchInput == '' || segnalazione.luogoRitrovamento.toLowerCase().includes(searchInput.toLowerCase()) || segnalazione.specie.toLowerCase() == searchInput.toLowerCase()) {
          createListEntry(myList, segnalazione)
        }
      })
    }
  })
}
