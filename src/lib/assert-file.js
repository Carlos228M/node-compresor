import { access, constants } from 'fs/promises'

export const assertFileReadable = async (inputPathFile) => {
   try {
      await access(inputPathFile, constants.R_OK)
   } catch (err) {
      console.log(`Cannot read ${inputPathFile}\n`, err)
      process.exit(1)
   }
}
export const assertDirWritable = async (pathFile) => {
   try {
      await access(pathFile, constants.W_OK)
   } catch (err) {
      console.log(`Cannot write ${pathFile}\n`, err)
      process.exit(1)
   }
}
