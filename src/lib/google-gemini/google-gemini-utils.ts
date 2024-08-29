import path from 'node:path'

import { geminiFileManager, geminiModel } from '.'

const mimeTypes: Record<string, string> = {
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
}

const getMimeType = (filePath: string) => {
  const ext = path.extname(filePath).toLowerCase()
  return mimeTypes[ext] || 'image/jpeg'
}

const WATER_PROMPT =
  'Extract the numeric reading from a water meter image. The reading consists of two parts: the integer part and the decimal part. The integer part is represented by the black digits on the meter, and the decimal part is represented by the red digits. Combine these to form a floating-point number where all black digits form the integer part and all red digits form the decimal part. Return this result as a float, without any additional text.'

const GAS_PROMPT =
  'Extract the numeric reading from a gas meter image. The reading consists of two parts: the integer part and the decimal part. The integer part is represented by the black blocks on the meter, and the decimal part is represented by the red blocks. Combine these to form a floating-point number where all black digits form the integer part and all red digits form the decimal part. Return the result as a float, without any additional text.'

export async function getMeasurementFromImage({
  imagePath,
  type,
}: {
  imagePath: string
  type: 'WATER' | 'GAS'
}) {
  const prompt = type === 'WATER' ? WATER_PROMPT : GAS_PROMPT

  const displayName = path.basename(imagePath)
  const mimeType = getMimeType(imagePath)

  const uploadResponse = await geminiFileManager.uploadFile(imagePath, {
    displayName,
    mimeType,
  })

  const result = await geminiModel.generateContent([
    {
      fileData: {
        mimeType: uploadResponse.file.mimeType,
        fileUri: uploadResponse.file.uri,
      },
    },
    {
      text: prompt,
    },
  ])
  const measureValue = Math.round(Number(result.response.text()))

  return {
    measureValue,
    imageUrl: uploadResponse.file.uri,
  }
}
