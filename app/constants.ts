import path from 'node:path'

const cwd = process.cwd()

export const PROXY = 'http://127.0.0.1:7890'
export const PUBLIC_DIR = path.join(cwd, 'public')

export const BUNDLE_DIR = 'bundle'
export const RENDER_INFO_FILE = 'render-info.json'

export const TRANSLATE_VIDEO_COMBINED_SRT_FILE = 'combined.srt'
export const TRANSLATE_VIDEO_RENDER_INFO_FILE = 'render-info.json'

export const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'

export const SILICON_FLOW_API_KEY = process.env.SILICON_FLOW_API_KEY

export const REMOTION_ZIP_BUNDLE_DIR_NAME = 'bundle'
export const REMOTION_ZIP_RENDER_INFO_FILE = 'render-info.json'

export const RENDER_ZIP_OUTPUT_FILE_NAME = 'render.zip'

export const DB_FILE_NAME = process.env.DB_FILE_NAME
export const OPERATIONS_DIR = path.join(cwd, 'operations')
export const UPLOADS_DIR = path.join(cwd, 'uploads')
