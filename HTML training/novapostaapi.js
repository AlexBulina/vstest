fetch('https://api.novaposhta.ua/v2.0/json/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        
        
            "apiKey": "118fea0315ef36cd197c3f89f812a3fc",
            "modelName": "Address",
            "calledMethod": "getSettlements",
            "methodProperties": {"Page": "10"}
        
        
    })
})
.then(response => response.json()


)
.then(data => console.log(data))
.catch(error => console.error(error));
 



