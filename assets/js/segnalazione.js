$.ajax({
    url: './segnalazioni/getSegnalazione',
    data: {id: idSegnalazione},
    contentType: 'json', 
    type: 'GET',
    timeout: 5000,
    success: function (segnalazioni) {
      //riempio
      id.value=id.segnalazioni
    },
  })

}