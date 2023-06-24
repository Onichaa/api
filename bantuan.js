const { chromium } = require("playwright-core")
const axios = require("axios")
const fs = require("fs")
const child = require("child_process") 

let filetype
let browser
process.on('uncaughtException', console.error)

async function chromiumlaunch() {
  console.log("launch chrome ...")
  try {
    browser = await chromium.launchPersistentContext("../datachrome", {
      headless: false,
      executablePath: (await child.execSync("which chromium")+'').trim()
    })
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

(async() => {
	if (!filetype) filetype = await import("file-type")
  if (!browser) await chromiumlaunch()
})()

exports.ssweb = async(link,tidur) => {
  try {
    const page = await browser.newPage({ userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36" })
    await page.goto(link)
    await page.waitForTimeout(tidur || 0)
    const ss = await page.screenshot()
    await page.close()
    return ss
  } catch (e) {
    if (!browser || e.toString()?.includes("browser has been closed")) await chromiumlaunch()
    throw e
  }
}
exports.musical = async(link) => {
  try {
    const page = await browser.newPage()
    await page.goto("https://musicaldown.com/id")
    await page.waitForSelector("#link_url")
    await page.type("#link_url", link)
    await page.click("button[type=submit]")
    await page.waitForSelector("div.col")
    const hsil = await page.evaluate(async() => {
        let und = document.querySelectorAll("div[class='col s12 l8'] > a[style]")
        let undd = {}
        for (let i of und) {
            if (i.innerText?.includes("HD")) undd["hd"] = i.href
            if (i.innerText?.includes("UNDUH MP4 SEKARANG")) undd["mp4"] = i.href
        }
        return {
            username: document.querySelector("div[class='col s12'] > h2 > b").innerText,
            desc: document.querySelectorAll("div[class='col s12'] > h2")[1].innerText,
            download: undd
        }
    })
    await page.close()
    return hsil
  } catch (e) {
    if (!browser || e.toString()?.includes("browser has been closed")) await chromiumlaunch()
    throw e
  }
}
exports.ssyoutube = async(link) => {
  try {
    const page = await browser.newPage()
    await page.goto("https://ssyoutube.com/")
    await page.waitForSelector("#id_url")
    await page.type("#id_url", link)
    await page.click("button[type=submit]")
    const res = await page.waitForResponse("**/api/convert")
    const tex = await res.body()
    await page.close()
    return tex
  } catch (e) {
    if (!browser || e.toString()?.includes("browser has been closed")) await chromiumlaunch()
    throw e
  }
}
exports.ssscapcut = async(link) => {
  try {
    const page = await browser.newPage()
    await page.goto("https://ssscapcut.com/")
    await page.waitForSelector("#text_input")
    await page.type("#text_input", link)
    await page.click("button[type=submit]")
    const res = await page.waitForResponse("**/api/download/**")
    const tex = await res.body()
    await page.close()
    return tex
  } catch (e) {
    if (!browser || e.toString()?.includes("browser has been closed")) await chromiumlaunch()
    throw e
  }
}
exports.quote = async ({color = "#FFFFFF", avatar, username, media, text}) => {
    const json = {
        type: "quote",
        format: "png",
        backgroundColor: color,
        width: 512,
        height: 768,
        scale: 2,
        messages: []
    }
    const messages = {
        entities: [],
        avatar: true,
        from: {
            id: 1,
            name: username,
            photo: {
                url: avatar
            }
        },
        text: text,
        replyMessage: {}
    }
    if (media) {
        messages.media = { url: media }
    }
    json.messages.push(messages)
    const {data} = await axios.post("https://bot.lyo.su/quote/generate", json, {
        headers: {
            "Content-Type": "application/json"
        }
    }).catch(e => e.response || {})
    if (!data.ok) throw data.error.message
    return Buffer.from(data.result.image, "base64")
}

exports.getBuffer = async (url, options) => {
    options ? options : {}
    const getbuf = await axios({
        method: "get",
        url,
        headers: {
            'DNT': 1,
            'Upgrade-Insecure-Request': 1,
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"
        },
        ...options,
        responseType: 'arraybuffer'
    })
    return getbuf.data
}
exports.getFile = async(path) => {
	let data = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await exports.getBuffer(path)  : fs.existsSync(path) ? fs.readFileSync(path) : typeof path === 'string' ? path : Buffer.alloc(0)
    //if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
    if (!Buffer.isBuffer(data)) data = Buffer.from(path)
    let type = await filetype.fileTypeFromBuffer(data) || {
      mime: 'application/octet-stream',
      ext: '.bin'
    }
    return {...type,data}
}

process.on('exit', async() => {
  console.log("exit bantuan ...")
  await browser.close()
})
