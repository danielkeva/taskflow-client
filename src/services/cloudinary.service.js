export default {
    uploadImg
}

function uploadImg(ev) {
    const CLOUD_NAME = "omer1234"
    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

    const formData = new FormData();
    console.log(ev.target.files[0])
    formData.append('file', ev.target.files[0])
    formData.append('upload_preset', 'erlp8af1');

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

