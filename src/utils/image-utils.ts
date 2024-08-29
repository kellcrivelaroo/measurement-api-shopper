import fs from 'node:fs'
import path from 'node:path'

const BASE64_IMAGE_REGEX = /data:image\/(?:png|jpg|jpeg);base64,/

export const validateBase64Image = (value: string) =>
  BASE64_IMAGE_REGEX.test(value)

export const saveBase64Image = async (
  base64Image: string,
  filename: string
): Promise<{ imagePath: string }> => {
  const matches = base64Image.match(/^data:image\/(\w+);base64,/)
  if (!matches) {
    throw new Error('Invalid Base64 image string')
  }

  const imageType = matches[1]
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '')
  const buffer = Buffer.from(base64Data, 'base64')

  const assetsDir = path.join(__dirname, '../../assets')
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir)
  }

  const imagePath = path.join(assetsDir, `${filename}.${imageType}`)
  await fs.promises.writeFile(imagePath, buffer)

  return { imagePath }
}

export const convertImageToBase64 = (filePath: string) => {
  const image = fs.readFileSync(filePath)
  const base64Image = Buffer.from(image).toString('base64')
  const mimeType = path.extname(filePath).substring(1)
  return `data:image/${mimeType};base64,${base64Image}`
}
