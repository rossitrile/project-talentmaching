/* Photo upload section */
import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { Image, Button, Icon, Input, Label } from 'semantic-ui-react'

const PhotoUpload = ({ imageId, savePhotoUrl }) => {
  const [imageUrl, setImageUrl] = useState(() => imageId)
  const [image, setImage] = useState(() => null)
  const [uploadStatus, setUploadStatus] = useState(() => ({
    isUploading: false,
    isSuccess: false
  }))

  useEffect(
    () => {
      if (imageId) setImageUrl(imageId)
    },
    [imageId]
  )

  const checkValidFileType = file => {
    if (!file) return false
    const fileName = file.name
    const extension = fileName.split('.')[fileName.split('.').length - 1]
    const allowedFileTypes = ['jpg', 'jpeg', 'gif', 'png']
    return allowedFileTypes.includes(extension)
  }

  const previewImage = e => {
    e.preventDefault()
    const image = e.target.files[0]
    const isFileValid = checkValidFileType(image)

    if (!isFileValid)
      return TalentUtil.notification.show(
        'Invalid file type',
        'error',
        null,
        null
      )
    setImageUrl(URL.createObjectURL(image))
    setImage(image)
  }

  const handleUploadBtn = e => {
    e.preventDefault()
    if (!imageUrl)
      return TalentUtil.notification.show(
        'Please upload a picture first',
        'error',
        null,
        null
      )
    if (imageUrl === imageId) return

    upload()
  }

  const upload = () => {
    setUploadStatus({ ...uploadStatus, isUploading: true })
    const cookies = Cookies.get('talentAuthToken')
    const data = new FormData()
    data.append('files', image)

    $.ajax({
      url: savePhotoUrl,
      headers: {
        Authorization: 'Bearer ' + cookies
      },
      processData: false,
      contentType: false,
      type: 'POST',
      data: data,
      success: function(res) {
        if (res.success == true) {
          TalentUtil.notification.show(
            'Profile updated sucessfully',
            'success',
            null,
            null
          )
          setUploadStatus({ isUploading: false, isSuccess: true })
        } else {
          TalentUtil.notification.show(
            'Profile did not update successfully',
            'error',
            null,
            null
          )
          setUploadStatus({ isUploading: false, isSuccess: false })
        }
      }.bind(this),
      error: function(res, a, b) {
        console.log(res)
        console.log(a)
        console.log(b)
      }
    })
  }
  return (
    <div className="row">
      <div
        className="ui sixteen wide column"
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <label
          className="file-upload"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
          }}
        >
          {!imageUrl && <Icon size="huge" name="camera retro" />}
          <input
            disabled={uploadStatus.isUploading}
            type="file"
            onChange={previewImage}
          />
        </label>
        <Button
          loading={uploadStatus.isUploading}
          disabled={uploadStatus.isUploading}
          onClick={handleUploadBtn}
          color="black"
        >
          <Icon name="upload" />Upload
        </Button>
      </div>
    </div>
  )
}

export default PhotoUpload
