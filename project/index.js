const express = require('express')
const redis = require('redis')

const app = express()
const port = 3000

app.use(express.static('public'))

const cliente = redis.createClient({
    url: 'redis://redis:6379'
})

async function main(){
    await cliente.connect()
    console.log('Conectado ao Redis!')

    app.get('/', (req,res) => {
        res.send('API rodando com Docker + Redis')
    })

    app.get('/set', async (req, res) => {
        await cliente.set('mensagem', 'Olá do Redis via Docker')
        res.send('Chave "mensagem" foi salva')
    })

    app.get('/catch', async (req, res) => {
        const valor = await cliente.get('mensagem')
        res.send(`Valor lido do Redis: ${valor}`)
    })

    app.get('/visit', async (req, res) => {
        try{
            const total = await cliente.incr('visitas')
            res.send(`Esta pagina foi visitada ${total} vezes.`)
        } catch(err){
            console.error('Erro ao incrementar visitas:', err)
            res.status(500).send('Erro ao registrar visitas')
        }
    })

    app.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`)
    })
}
main().catch((err) => {
    console.error('Erro ao iniciar a aplicacao:', err)
})


