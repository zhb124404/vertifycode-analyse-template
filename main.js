const sharp = require('sharp')
const { createWorker } = require('tesseract.js')
const path = require('path')
const fs = require("fs")

const TRAIN_DATA = 'eng' //语言模型
const worker = createWorker({
  langPath: path.join(__dirname, '..', 'lang-data'), //指定语言模型目录
  // logger: m => console.log(m), //日志处理
});

(async () => {
  // 图片预处理
  const input = Buffer.from(fs.readFileSync(path.join(__dirname, 'img', '7.png')))
  sharp(input)
    // .median(6) //中值化 降噪
    .threshold(132) //灰度化与阈值处理 灰度化->二值化
    .blur(1.2) // 高斯模糊
    .sharpen(8) //锐化
    .toFile(path.join(__dirname, 'img-temp', 'result.png'))
  // return
  // 图片识别
  await worker.load()
  await worker.loadLanguage(TRAIN_DATA) //加载语言模型
  await worker.initialize(TRAIN_DATA)
  const { data: { text } } = await worker.recognize(path.join(__dirname, 'img-temp', 'result.png'))
  console.log(text)
  await worker.terminate()
})()
