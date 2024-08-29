import { env } from '../../utils/env'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { GoogleAIFileManager } from '@google/generative-ai/server'

export const geminiFileManager = new GoogleAIFileManager(env.GEMINI_API_KEY)
export const geminiGenerativeAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)
export const geminiModel = geminiGenerativeAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
})
