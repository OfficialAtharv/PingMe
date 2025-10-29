const Upload = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.onerror = () => {
      reject("Failed to convert image to base64");
    };
    reader.readAsDataURL(file);
  });
};

export default Upload;
