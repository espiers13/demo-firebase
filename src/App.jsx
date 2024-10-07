import { useState, useEffect } from "react";
import "./App.css";
import { getFirestore } from "firebase/firestore/lite";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

function App() {
  const [imgReferene, setImgReference] = useState([]);
  const [img, setImg] = useState([]);
  const [temporaryImage, setTemporaryImage] = useState([]);
  const [files, setFiles] = useState([]);

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

  //access storage
  const storage = getStorage();

  //path to the root
  const storageRef = ref(storage);

  // sets preview image (temporaryImg) for user to view what they are about to upload, without uploading into the cloud
  const handleInput = (event) => {
    setFiles((previousFiles) => {
      const newArray = [...previousFiles];
      newArray[event.target.id] = event.target.files;
      return newArray;
    });
    console.log(event.target.id);
    const images = event.currentTarget.files;
    const temporaryURL = window.URL.createObjectURL(images[0]);
    setTemporaryImage((previousImage) => {
      const newArray = [...previousImage];
      newArray[event.target.id] = temporaryURL;
      return newArray;
    });
  };

  // uploads the image into the cloud and returns it for user to see
  const handleClick = (event) => {
    const metadata = {
      contentType: "image/jpg",
    };
    files.forEach((file, index) => {
      const imagesRef = ref(storage, `images/${file[0].name}`);
      return uploadBytes(imagesRef, file[0], metadata).then((snapshot) => {
        const imgPath = snapshot.metadata.fullPath;
        setTemporaryImage([]);
        setImgReference((prevImgRef) => [
          ...prevImgRef,
          ref(storageRef, imgPath),
        ]);
      });
    });
  };

  useEffect(() => {
    const promises = [];
    if (imgReferene.length > 0) {
      imgReferene.forEach((reference) => {
        const promise = getDownloadURL(ref(storage, reference)).then((url) => {
          return url;
        });
        promises.push(promise);
      });
    }
    Promise.all(promises)
      .catch((err) => {
        console.log(err, "<-- error");
      })
      .then((urls) => {
        setImg(urls);
      });
  }, [imgReferene]);

  return (
    <>
      <h1>Firebase Research :)</h1>
      {temporaryImage && (
        <ul>
          {temporaryImage.map((preview, index) => {
            return <img width="100px" key={index} src={preview} />;
          })}
        </ul>
      )}
      {img && (
        <ul>
          {img.map((uploadedImg, index) => {
            return <img width="50px" key={index} src={uploadedImg} />;
          })}
        </ul>
      )}
      <input type="file" id="0" onChange={handleInput}></input>
      <input type="file" id="1" onChange={handleInput}></input>
      <input type="file" id="2" onChange={handleInput}></input>
      <button onClick={handleClick}>Upload</button>
    </>
  );
}

export default App;
