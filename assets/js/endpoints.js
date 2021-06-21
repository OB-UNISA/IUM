function changeEndpoint (endpoint) {
  for (let i = 1; i < 8; i++) {
    document.getElementById('endpoint' + i).classList.remove('active')
    document.getElementById('doc' + i).classList.add('d-none')
  }
  document.getElementById('endpoint' + endpoint).classList.add('active')
  document.getElementById('doc' + endpoint).classList.remove('d-none')
  document.getElementById('doc' + endpoint).classList.add('d-block')
}

function updateApiKey (api_key) {
  doc1_apikey = document.getElementById('doc1_keyvalue')
  doc1_apikey.innerHTML = api_key
  document.getElementById('api_key').value = api_key
  document.getElementById('doc4_api_key').value = api_key
}

function doc1apikey () {
  $.ajax({
    url: './api/get',
    type: 'GET',
    timeout: 5000,
    success: function (api_key) {
      updateApiKey(api_key)
      doc1_apikey = document.getElementById('doc1_apikey')
      doc1_apikey.classList.remove('d-none')
      doc1_apikey.classList.add('d-block')
      document.getElementById('doc1_button').disabled = true
    },
    error: function (xhr, status, error) {
    }
  })
}

function doc4_output () {
  const date1 = document.getElementById('doc4_date1')
  if (date1.value.length < 2) {
    date1.value = new Date().toISOString()
  }

  const date2 = document.getElementById('doc4_date2')
  if (date2.value.length < 2) {
    date2.value = new Date().toISOString()
  }

  doc1_apikey = document.getElementById('doc4_output')
  doc1_apikey.classList.remove('d-none')
  doc1_apikey.classList.add('d-block')

  let data = {}
  let _api_key = document.getElementById('api_key').value
  if (_api_key.length < 5){
    data = {
        status: 401
    }
  } else{
    data = {
        api_key: _api_key,
        status: 200,
        date_begin: date1.value,
        date_end: date2.value,
        count: 3,
        reports: [
        {
            id: '23974bnf2834fnw8',
            place: 'IT/SA',
            animal: 'serpente',
            datetime: '2021-06-25T16:06:432'
        },
        {
            id: 'erfwerffnw8er',
            place: 'IT/NA',
            animal: 'mucca',
            datetime: '2021-06-26T18:07:427'
        },
        {
            id: 'ewrt4tgdf43redrf',
            place: 'IT/SA',
            animal: 'sconosciuto',
            datetime: '2021-06-25T06:25:007'
        }
        ]
    }
  }

  document.getElementById('doc4_value').innerHTML = JSON.stringify(data, undefined, 2)
}
