const Telegraf = require('telegraf')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Scene = require('telegraf/scenes/base')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const { leave } = Stage
const axios = require('axios')

const token = '875108617:AAFtNcGUoUDgA8YutFW0rmoIENT6UyiR_5Q'
const AppiKey = 'c58bc1f4381f08cac9cd4dce178ab503'

const bot = new Telegraf(token)

bot.start((ctx) => ctx.reply('Welcome'))

const weather = new Scene('weather')
weather.enter((ctx)=> ctx.reply('Введите название города'))
weather.leave((ctx)=> ctx.reply('Пока:('))
weather.hears(/exit/gi,leave())
weather.on('message',(ctx)=>{
    const city = ctx.message.text
    axios({
        method:'GET',
        url:'https://api.openweathermap.org/data/2.5/weather?q='+city+'&units=metric&lang=ru&appid='+AppiKey
    }).then(res =>{
        console.log()
        ctx.reply(`Температура:${Math.round(res.data.main.temp)}℃, ${res.data.weather[0].description}`)
    })
})




const stage = new Stage()
stage.command('cancel', leave())

// Scene registration
stage.register(weather)
bot.use(session())
bot.use(stage.middleware())
bot.command('weather',(ctx)=> ctx.scene.enter('weather'))

bot.help((ctx) => ctx.reply('/weather - просмотр текущей погоды'))

bot.launch()