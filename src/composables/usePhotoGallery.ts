import { Filesystem, Directory } from "@capacitor/filesystem";
import {  ref, onMounted, watch } from "vue";
import {
    Camera,
    CameraResultType,
    CameraSource,
    Photo,
  } from "@capacitor/camera";

  export interface UserPhoto{
    filepath:string;
    webviewPath?:string
}
  export function usePhotoGallery() {
      const photos = ref<UserPhoto[]>([]);
    const takePhoto = async () => {
      const cameraPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 100,
      });
      const fileName = new Date().getTime()+'.jpeg';
      const savedFileImage = {
          filepath:fileName,
          webviewPath:cameraPhoto.webPath
      };
      photos.value = [savedFileImage,...photos.value]
    };
    return {photos , takePhoto};
  }
