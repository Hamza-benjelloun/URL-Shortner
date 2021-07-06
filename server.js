const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')

const app = express()
mongoose.connect('mongodb://localhost/urlShortner',{
    useNewUrlParser : true, useUnifiedTopology : true
})
app.set('view engine','ejs')
app.use(express.urlencoded({
    extended:false
}))

app.get('/',async (req,res)=>{
    const shortUrls = await ShortUrl.find()
    res.render('index',{shortUrls:shortUrls})
})

app.post('/shortUrls',async (req,res)=>{
    await ShortUrl.create({
        full:req.body.fullUrl
    })
    res.redirect('/')
})

app.get('/:shortUrl',async (req,res) => {
    const short = await ShortUrl.findOne({short:req.param.shortUrl})
    if(short==null) return res.sendStatus(404)
    short.click++
    short.save()

    res.redirect(short.full)
})

app.listen(process.env.PORT || 5000);