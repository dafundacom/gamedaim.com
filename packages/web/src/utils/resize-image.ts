import Resizer from "react-image-file-resizer"

export const resizeImage = (file: Blob) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      1280,
      720,
      "webp",
      70,
      0,
      (uri) => {
        resolve(uri)
      },
      "file",
    )
  })
