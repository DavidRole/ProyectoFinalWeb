// Importar el módulo express mediante un enrutador Router
// Va entre llaves

const { Router } = require('express')
const router = Router()

// Exportar los métodos del servidor express (GET raíz)
module.exports = router;

// Crear el método 'get' del directorio raíz
// Reciben 2 parámetros directorio ('/' raíz) y callback (atender la petición y armar la respuesta)
router.get('/', (req, resp) => {
    console.log(req.url)
    resp.send('Hello World!')
})