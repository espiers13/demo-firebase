import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";

import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

function AppCopy() {
  const [imgReferene, setImgReference] = useState(null);
  const [img, setImg] = useState("");
  const [temporaryImage, setTemporaryImage] = useState("");
  const [files, setFiles] = useState("");

  const firebaseConfig = {
    apiKey: "AIzaSyD9fnYCaP-yAfiT3OcVbGPr29axNo8H1BQ",
    authDomain: "fir-project-28217.firebaseapp.com",
    projectId: "fir-project-28217",
    storageBucket: "fir-project-28217.appspot.com",
    messagingSenderId: "392978672330",
    appId: "1:392978672330:web:5c47cd3bd89f0faa352233",
    measurementId: "G-KVBSTV45PR",
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  //access storage
  const storage = getStorage();

  //path to the root
  const storageRef = ref(storage);

  //path to images folder

  // sets preview image (temporaryImg) for user to view what they are about to upload, without uploading into the cloud
  const handleInput = (event) => {
    setFiles(event.target.files);
    const images = event.target.files;
    // console.log(images[0].name, "<--name");
    const temporaryURL = window.URL.createObjectURL(images[0]);
    setTemporaryImage(temporaryURL);
  };

  // uploads the image into the cloud and returns it for user to see
  const handleClick = (event) => {
    const metadata = {
      contentType: "image/webp",
    };
    // console.log(file[0]);
    const imagesRef = ref(storage, `images/${files[0].name}`);
    console.log(files[0]);
    console.log(imagesRef);
    uploadBytes(imagesRef, files[0], metadata).then((snapshot) => {
      const imgPath = snapshot.metadata.fullPath;
      console.log(imgPath);
      // console.log(snapshot, "<--snapshot");
      setImgReference(ref(storageRef, imgPath));
      setTemporaryImage(null);
      // console.log(img);
    });
  };

  useEffect(() => {
    if (imgReferene) {
      getDownloadURL(ref(storage, imgReferene)).then((url) => {
        console.log(url);
        setImg(url);
        // console.log(imgReferene);
      });
    }
  }, [imgReferene]);

  return (
    <>
      <h1>Firebase Research :)</h1>
      {temporaryImage && <img width="100px" src={temporaryImage} />}
      {/* {temporaryImage && <img width="50px" src={temporaryImage}></img>} */}
      {img && <img width="50px" src={img} />}
      <input type="file" onChange={handleInput}></input>
      <button onClick={handleClick}>Upload</button>
    </>
  );
}

export default AppCopy;
