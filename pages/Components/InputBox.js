import { session, useSession } from "next-auth/client";
import Image from "next/image";
import { EmojiHappyIcon } from "@heroicons/react/outline";
import { CameraIcon, VideoCameraIcon } from "@heroicons/react/solid";
import { useRef, useState } from "react";
import firebase from "firebase";
import { db, storage } from "../../firebase";

export default function InputBox() {
  const [session] = useSession();
  const inputRef = useRef(null);
  const filepickerRef = useRef(null);
  const [imageToPost, setImageToPost] = useState(null);

  const sendPost = (e) => {
    e.preventDefault();

    if (!inputRef.current.value) return;

    db.collection("posts") //crea un panel en la db con el post, agarrando el msg,email,nombre e imagen
      .add({
        message: inputRef.current.value,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(), //agarra la hora de la zona en la que este creada la base de datos
      })
      //despues de agregar el mensaje a la db tomamos el doc que retorna
      .then((doc) => {
        //si hay imagen para postear
        if (imageToPost) {
          const uploadTask = storage
            .ref(`posts/${doc.id}`) //crea una carpeta folder en el storage de firebase
            .putString(imageToPost, "data_url");

          removeImage(); //reinicia el estado

          uploadTask.on(
            "state_change", //cuando cambia el estado
            null, //progreso
            (err) => console.error(err), //si hay un error se puede mostrar
            () => {
              //cuando se completa la subida
              storage
                .ref(`posts`)
                .child(doc.id)
                .getDownloadURL() //da una url de donde se puede descargar la imagen
                .then((url) => {
                  //entra en la carpeta anteriormente creada
                  db.collection("posts").doc(doc.id).set(
                    {
                      postImage: url,
                    },
                    { merge: true } //si no se pone el merge se sobreescribe todo y solo estaria el postimage
                    //hay q cambiar las reglas de seguridad de firebase para q el usuario pueda ingresar
                  );
                });
            }
          );
        }
      });

    inputRef.current.value = "";
  };

  const addImageToPost = (e) => {
    //api que puede leer el archivo
    const reader = new FileReader();
    if (e.target.files[0]) {
      //si seleccionamos un archivo
      reader.readAsDataURL(e.target.files[0]);
    }

    //cuando cargue el archivo y retorne el readerEvent hay que actualizar el estado | base64 encoding
    reader.onload = (readerEvent) => {
      setImageToPost(readerEvent.target.result);
    };
  };

  //remueve la imagen
  const removeImage = () => {
    setImageToPost(null);
  };

  return (
    <div className="bg-white p-2 rounded-2xl shadow-md text-gray-500 font-medium mt-6">
      <div className="flex space-x-4 p-4 items-center ">
        <Image
          className="rounded-full"
          src={session.user.image}
          width={40}
          height={40}
          layout="fixed"
        />
        <form className="flex flex-1">
          <input
            ref={inputRef}
            className="rounded-full h-12 bg-gray-100 flex-grow px-5 focus:outline-none"
            type="text"
            placeholder={`Whats on your mind ${session.user.name}`}
          />
          <button hidden type="submit" onClick={sendPost}>
            Submit
          </button>
          {imageToPost && (
            <div
              className="flex flex-col filter hover:brightness-110 transition duration-150 transform hover:scale-105 cursor-pointer"
              onClick={removeImage}
            >
              <img src={imageToPost} alt="" className="object-contain h-10" />
              <p className="text-xs text-center text-red-500">Remove</p>
            </div>
          )}
        </form>
      </div>
      <div className="flex justify-evenly p-3 border-t">
        <div className="inputIcon">
          <VideoCameraIcon className="h-7 text-red-500" />
          <p className="text-xs sm:text-sm xl:text-base">Live Video</p>
        </div>
        <div
          onClick={() => filepickerRef.current.click()}
          className="inputIcon"
        >
          <CameraIcon className="h-7 text-green-400" />
          <p className="text-xs sm:text-sm xl:text-base">Photo/Video</p>
          <input
            ref={filepickerRef}
            onChange={addImageToPost}
            type="file"
            hidden
          />
        </div>
        <div className="inputIcon">
          <EmojiHappyIcon className="h-7 text-yellow-300 " />
          <p className="text-xs sm:-text-sm xl:text-base">Feeling/Activity</p>
        </div>
      </div>
    </div>
  );
}
