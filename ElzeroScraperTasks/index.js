// in a new folder be sure to run "npm init -y" and "npm install puppeteer"
'use strict';
const puppeteer = require("puppeteer")
const fs = require("fs")

async function start() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto("https://elzero.org/category/assignments/html-assignments/")

  const courseName = await page.evaluate(() => {
    return document.querySelector(".page-head h1").textContent
  })

  const assignmentNames = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".box")).map(x => x.querySelector('.content').textContent.replace(/\s/g, ''))
  })

  const assignmentURLs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".box")).map(x => x.querySelector('.content').href)
  })

  var dir = `./${courseName}`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  for (const i in assignmentURLs) {
    await page.goto(assignmentURLs[i])
    await page.screenshot({ path: `${dir}/${assignmentNames[i]}.png`, fullPage: true })
  }

  await browser.close()
}

start()