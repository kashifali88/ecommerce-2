import cloudinary from 'cloudinary';
import multer from 'multer';


cloudinary.config({
    cloud_name: "dlx02bhkh",
    api_key: "994535768188985",
    api_secret: "qH0ZCTMtpAtoO4xfAU0IoRIlYVo"
})

const storage = new multer.memoryStorage();

export const imageUploadUtil = async (file) => {
    const result = await cloudinary.uploader.upload(file, {
        resource_type: "auto"

    })
    return result;
}

export const upload  = multer({storage})

