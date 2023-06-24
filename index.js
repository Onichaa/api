process.env.TZ = "Asia/Jakarta"
const express = require('express')
const port = process.env.PORT || 3000 
const app = express()



app.enable('trust proxy')
app.set("json spaces",2)
app.use(express.json())
app.use(express.urlencoded({ extended: true })) 
app.listen(port)
const util = require('util')
const child = require("child_process")

const b = require("./bantuan.js")
process.on('uncaughtException', console.error)

app.use(async(req, res, next) => {
  try {
    res.set("By", 'FRM Developer')
    res.sends = async(object, target) => {
      if (!target) return res.json(object)
      Object.keys(object).forEach((i) => {
        const isij = object[i]
        res.set(i, typeof isij == "string" ? isij : typeof isij == "object" ? JSON.stringify(isij) : typeof isij == "function" ? isij+'' : null )
      })
      const eoal = await eval(`object.${target}`)
      const gfile = await b.getFile(eoal)
      res.set("Content-Type", gfile.mime)
      return res.send(gfile.data)
    }
    res.buff = async(buff) => {
      try {
        return res.json(JSON.parse(buff))
      } catch {
        const gfile = await b.getFile(buff)
        res.set("Content-Type", gfile.mime)
        return res.send(buff)
      }
    }
    next()
  } catch (e) {
    console.log(e)
  }
})
app.all('/', async(req, res) => {
  res.send("mau ngapain")
})
app.post('/post', async(req, res) => {
  try {
  console.log(req.body)
  switch (req.body.name) {
    case ">":
      try {
        let uev = await eval(`(async () => { ${req.body.code} })()`)
        res.send(uev)
      } catch (e) { res.send(util.format(e)) }
    break
    case "$":
      try {
        let respon = ""
        child.exec(req.body.q, async(error, stdout, stderr) => {
          if (stdout) respon += "stdout\n"+more.clearcolorcode(stdout)
          respon += "\n\n"
          if (stderr) respon += "stderr\n"+more.clearcolorcode(stdout)
          res.send(uev)
        })
      } catch (e) { res.send(util.format(e)) }
    break
    case "createExif":
      res.send(more.createExif(req.body.pack, req.body.author, req.body.apk))
    break
    case "ssweb":
      res.buff(await b.ssweb(req.body.url,req.body.sleep))
    break
    case "musical":
      res.sends(await b.musical(req.body.url), req.body.return)
    break
    case "ssyoutube":
      res.buff(await b.ssyoutube(req.body.url))
    break
    case "ssscapcut":
      res.buff(await b.ssscapcut(req.body.url))
    break
    case "quote":
      res.buff(await b.quote(req.body))
    break
    default:
      res.json({error: true, log: "body name: "+req.body.name})
  }
  } catch (e) {
      res.json({error: true, log: util.format(e)})
  }
})
process.on('exit', async() => {
  console.log("exit index ...")
})