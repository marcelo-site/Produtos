import multer from 'multer'

export const multerFile = ( multer({
    //armazenamento dos arquivos?
    storage:multer.diskStorage({
        //Destino dos arquivos?
        destination: (req, file, cb)=> {
            cb(null, './public/img')
        },
        //nome do arquivo
        filename: (req, file, cb) => {
        //Segundo param vai o nome do arquivo concatenado com  a data atual com o nome original do arquivo(biblioteca disponibiliza)
        // cb(null, `${Date.now().toString()}-${file.originalmente}`)
        cb(null, Date.now().toString() + '-' + file.originalname )
    }
    }),
    //Filtrar formatos de arquivos
    fileFilter: (req, file, cb) => {
        const isAccepted = [
            'image/png', 'image/jpg', 'image/jpeg'
        ].find(formatoAceito => formatoAceito == file.mimetype)
        //Se o arquivo bater
        if(isAccepted){
            return cb(null, true)
        }
        //Se o arquivo não bater
        return cb(null, false)
    }
}))
