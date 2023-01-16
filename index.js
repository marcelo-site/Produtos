import express from 'express'
import {engine} from 'express-handlebars'
import { pool } from './db/conn.mjs'
import {multerFile} from './multer.mjs'

const app = express()

app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')

app.use(express.static('public'))

// Visualizar produtos
app.get('/', (req,res)=>{
    const sql = `SELECT * FROM ficha`

    pool.query(sql, function(err, data) {
        if(err) {
            console.log(err)
        }
        const products = data

    res.render('home' , { products })
    }) 
})

app.get('/products/:id', function(req, res){
    const id = req.params.id
    // const sql = `SELECT * FROM ficha WHERE id = ${id}`
    const sql = `SELECT f.title, f.price, f.file1,c.cor, c.id 
    FROM ficha AS f 
    JOIN cor AS c 
    ON f.id = c.id_ficha WHERE f.id = ${id}`
  

    pool.query(sql, function(err, data){
        if(err){
            console.log(err)
        }
        
        const product = data
        const product1 =data[0]
        console.log({product})
        res.render('product', { product, product1 })
    })
})

//inserir produto
app.get('/insert-products', (req,res) => {
    res.render('insert')
})

app.post('/insert-products', multerFile.fields([{name: 'file1'}, {name: 'file2'}, {name: 'file3'}]), (req, res) => {
    const price = req.body.price
    const title = req.body.title
    const files = req.files
    const file1 = files.file1[0].filename
    const file2 = files.file2[0].filename
    const file3 = files.file3[0].filename
    const sql  = `INSERT INTO ficha (??,??,??,??,??) VALUES (?,?,?,?,?)`
    const dataSql = ['title', 'price', 'file1', 'file2', 'file3', title, price, file1, file2, file3]
    //success
    if(price && title && files) {
        pool.query(sql, dataSql, function(err) {
            if(err){
                console.log(err)
            }
        })
        // return res.redirect('/insert-products')
        return res.send('Sucesso')
    }
    //!= success
    return res.send('Houve um erro no upload!')
})

//editar
app.get('/products/edit/:id', (req, res) => {
    const id = req.params.id
    const sql = `SELECT * FROM ficha WHERE id = ${id}`

    pool.query(sql, function(err, data) {
        if(err){
            console.log(err)
            return
        }
        const product = data[0]
        res.render('edit', { product })
    })
})

app.post('/products/updatebook', multerFile.fields([{name: 'file1',}, {name: 'file2'}, { name: 'file3'
}]), function(req, res) {
    const id = req.body.id
    const title = req.body.title
    const price = req.body.price
    const files = req.files
    const file1 = files.file1[0].filename
    const file2 = files.file2[0].filename
    const file3 = files.file3[0].filename

    const sql = `UPDATE ficha SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?`
    const sqlData= ['title', title, 'price', price, 'file1', file1, 'file2', file2, 'file3', file3, 'id',id]
    pool.query(sql, sqlData, function(err){
        if(err) {
            console.log(err)
        }
        res.redirect(`/products/${id}`)
    })
})
//inserir nova cor
app.get('/insert-cor/:id',(req, res) =>{
    const id = req.params.id

    const sql = `SELECT * FROM ficha WHERE id = ${id}`
    pool.query(sql, function(err, data) {
        if(err) {
            console.log(err)
            return
        }

        const product = data[0]
        res.render('insertcor', {product})
    })
})
app.post('/insert-cor/' , multerFile.single('img'), (req, res) => {
    const id = req.body.id
    const color = req.body.color
    const file = req.file.filename

    const sql = `INSERT INTO cor(??,??,??) VALUES (?,?,?)`
    const paramsSQL = ['cor', 'file_cor','id_ficha', color, file, id]
    pool.query(sql, paramsSQL, function(err) {
        if(err) {
            console.log(err)
            return
        }
    res.redirect(`/color/${id}`)
    })
})
app.get('/color/:id', (req, res) => {
    const id = req.params.id
    const sql = `SELECT * FROM cor WHERE id = ${id}`
    console.log(sql)

    pool.query(sql, function(err, data) {
        if(err){
            console.log(err)
            return
        }
        const cor = data[0]
        res.render('color', {cor})
    })

})
//remover produto
app.post('/products/remove/:id', (req, res) => {
    const id = req.params.id
    const sql = 
    `DELETE FROM ficha WHERE ?? = ?`
    const pSql = ['id', id]

    pool.query(sql,pSql, function(err) {
        if(err) {
            console.log(err)
            return
        }
    res.redirect('/products')
    })
})


app.listen(3000)