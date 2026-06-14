import multer from 'multer'
import path from 'path'
import fs from 'fs'

const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const VIDEO_MIME_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']

const LIMITS = {
    image: 5 * 1024 * 1024,    // 5MB
    video: 200 * 1024 * 1024,  // 200MB
    thumbnail: 5 * 1024 * 1024 // 5MB
}

// ─── Storage ──────────────────────────────────────────────────────
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        const ext = path.extname(file.originalname).toLowerCase()
        cb(null, file.fieldname + '-' + uniqueSuffix + ext)
    }
})

// ─── Image Filter (avatar, coverImage) ───────────────────────────
const imageFileFilter = (req, file, cb) => {
    if (IMAGE_MIME_TYPES.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error(`Invalid file type: ${file.mimetype}. Only JPEG, PNG, WEBP, GIF allowed.`), false)
    }
}

// ─── Video Filter (videoFile + thumbnail) ────────────────────────
const videoFileFilter = (req, file, cb) => {
    if (file.fieldname === 'thumbnail') {
        if (IMAGE_MIME_TYPES.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error("Thumbnail must be an image (JPEG, PNG, WEBP, GIF)."), false)
        }
    } else if (file.fieldname === 'videoFile') {
        if (VIDEO_MIME_TYPES.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error("Video must be MP4, WEBM, MOV, or AVI."), false)
        }
    } else {
        cb(new Error(`Unexpected field: ${file.fieldname}`), false)
    }
}

// ─── Upload Instances ─────────────────────────────────────────────

// For: avatar, coverImage
export const uploadImage = multer({
    storage,
    limits: { fileSize: LIMITS.image, files: 2 },
    fileFilter: imageFileFilter
})

// For: videoFile + thumbnail
export const uploadVideo = multer({
    storage,
    limits: { fileSize: LIMITS.video, files: 2 },
    fileFilter: videoFileFilter
})

// ─── Thumbnail Size Check (call this inside publishVideo controller) ──
export const checkThumbnailSize = (req, res, next) => {
    const thumbnail = req.files?.thumbnail?.[0]
    if (thumbnail && thumbnail.size > LIMITS.thumbnail) {
        // cleanup dono files
        if (thumbnail?.path) fs.unlinkSync(thumbnail.path)
        if (req.files?.videoFile?.[0]?.path) fs.unlinkSync(req.files.videoFile[0].path)
        return res.status(400).json({ message: "Thumbnail must be under 5MB." })
    }
    next()
}

// import multer from 'multer'
// import path from 'path'


// const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
// const VIDEO_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 
//                           'video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
// // : check all funtion parameters by chatgpt

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "./public/temp")
//     },
//     filename: function (req, file, cb) {
//         // SECURITY: originalname mat use karo — path traversal attack ho sakta hai
//         // Unique name do: timestamp + random + original extension only
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
//         const ext = path.extname(file.originalname).toLowerCase()  // sirf extension lo
//         cb(null, file.fieldname + '-' + uniqueSuffix + ext)
//     }
// })

// const imageFileFilter = (req, file, cb) => {
//     if (IMAGE_MIME_TYPES.includes(file.mimetype)) {
//         cb(null, true)   // accept
//     } else {
//         cb(new Error(`Invalid file type: ${file.mimetype}. Only JPEG, PNG, WEBP, GIF allowed.`), false)
//     }
// }

// const videoFileFilter = (req, file, cb) => {
//     if (VIDEO_MIME_TYPES.includes(file.mimetype)) {
//         cb(null, true)
//     } else {
//         cb(new Error(`Invalid file type. Allowed: JPEG/PNG (thumbnail), MP4/WEBM/MOV (video).`), false)
//     }
// }

// export const uploadImage = multer({
//     storage,
//     limits: {
//         fileSize: 2 * 1024 * 1024,   // 2 MB
//         files: 2,                      // ek request mein max 2 files
//     },
//     fileFilter: imageFileFilter
// })

// // For: videoFile + thumbnail (video 200MB, thumbnail 5MB)
// export const uploadVideo = multer({
//     storage,
//     limits: {
//         fileSize: 10 * 1024 * 1024,  // 10 MB — video ke liye
//         files: 2,
//     },
//     fileFilter: videoFileFilter
// })

// // const storage = multer.diskStorage({
// //     destination: function (req, file, cb) {
// //         cb(null, "./public/temp")
// //     },
// //     filename: function (req, file, cb) {
// //         cb(null, file.originalname)
// //     }
// // })

// // export const upload = multer({
// //     storage,
// //     limits: {
// //         fileSize: 10 * 1024 * 1024, // 10 MB
// //     },
// // })