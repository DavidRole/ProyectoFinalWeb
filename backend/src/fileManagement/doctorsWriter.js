//importar el modulo
const { throws } = require('assert')
const fs = require('fs')
const path = require('path')
const { domainToASCII } = require('url')

function write(list){
    var data = JSON.stringify(list, null, 2)
    
    console.log(list)
    console.log(data)
    
    
    // escribir la info en el archivo JSON
    // recibe
    // path
    // datos
    // callback

    fs.writeFile('./appointments.json', data, (err) => {
        if (err) throw err;
        console.log('Archivo Guardado')
    })

}