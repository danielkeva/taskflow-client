export default {
    uploadImg
}

function uploadImg(ev) {
    console.log('yes');
    const CLOUD_NAME = "dhz1jk4k6"
    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

    const formData = new FormData();
    formData.append('file', ev.target.files[0])
    formData.append('upload_preset', 'jtim2mm3');

    return fetch(UPLOAD_URL, {
        method: 'POST',
        body: formData
    })
        .then(res => res.json())
        .then(res => {
            return res
        })
        .catch(err => console.error(err))
}

