import { assertDirWritable, assertFileReadable } from '#lib/assert-file.js'
import { createReadStream, createWriteStream } from 'fs'
import { unlink } from 'fs/promises'
import { dirname, join } from 'path'
import { pipeline } from 'stream'
import { fileURLToPath } from 'url'
import { createGzip, constants } from 'zlib'

// Ruta de entrada y salida de archivos
const inputFile = 'home.mov'
const inputPathFile = join(
   dirname(fileURLToPath(import.meta.url)),
   '../data',
   inputFile
)

const outputFile = `${inputFile}.gz`
const outputPath = join(dirname(fileURLToPath(import.meta.url)), '../out')
const outputPathFile = join(outputPath, outputFile)

const bootstrap = async () => {
   await assertFileReadable(inputPathFile)
   await assertDirWritable(outputPath)

   // Streams de lectura, compresión y escritura
   const readFileStream = createReadStream(inputPathFile)
   const gzipStream = createGzip({
      level: constants.Z_BEST_COMPRESSION
   })
   const writeFileStream = createWriteStream(outputPathFile)
   // Unión de streams
   pipeline(readFileStream, gzipStream, writeFileStream, async (err) => {
      if (err) {
         try {
            await unlink(outputPathFile)
         } catch (err) {}
         console.log('Compression aborted, an error has ocurred', err)
         process.exit(1)
      } else {
         console.log('Compression finished')
         process.exit()
      }
   })
}
bootstrap()
