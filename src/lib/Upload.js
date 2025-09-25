const upload = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result); // base64 string
    };
    reader.onerror = () => {
      reject("Failed to convert image to base64");
    };
    reader.readAsDataURL(file); // convert file to base64
  });
};

export default upload;
