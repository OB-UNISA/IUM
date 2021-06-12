function changeEndpoint(endpoint) {
    for (let i = 1; i < 8; i++) {
        document.getElementById('endpoint' + i).classList.remove('active')
        document.getElementById('doc' + i).classList.add('d-none')
    }
    document.getElementById('endpoint' + endpoint).classList.add('active')
    document.getElementById('doc' + endpoint).classList.remove('d-none')
    document.getElementById('doc' + endpoint).classList.add('d-block')
}

function doc1_apikey() {
    $.ajax({
        url: './api/get',
        type: 'GET',
        timeout: 5000,
        success: function (api_key) {
            api_key = 'X-CitAni-' + api_key
            doc1_apikey = document.getElementById('doc1_apikey')
            doc1_apikey.innerHTML = api_key
            doc1_apikey.classList.remove('d-none')
            doc1_apikey.classList.add('d-block')
            document.getElementById('api_key').value = api_key
        },
        error: function (xhr, status, error) {
        }
    })
}