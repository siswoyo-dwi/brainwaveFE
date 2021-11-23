<template>
  <div v-if="spinner">
    <ion-progress-bar
      type="indeterminate"
      color="primary"
      value="0.5"
    ></ion-progress-bar>
  </div>
  <ion-page v-else>
    <ion-content :fullscreen="true">
      <ion-grid>
        <ion-row id="row1">
          <ion-col>
            <ion-grid>
              <ion-row>
                <ion-col size="7">
                  <ion-text color="light"><h5>Let Us Know You !</h5> </ion-text
                  ><br />
                  <ion-text color="light"
                    >Please fill in your biodata and let us know who you are.
                  </ion-text>
                </ion-col>
                <ion-col size="5">
                  <img
                    v-if="!profilPicture && counter == 0"
                    src="../../../assets/avatar.png"
                    alt=""
                    class="image-profile"
                  />
                  <img
                    v-else-if="profilPicture && counter == 0"
                    class="image-profile"
                    :src="ip + profilPicture"
                    alt=""
                  />
                  <img
                    v-else-if="profilPicture && counter == 1"
                    class="image-profile"
                    :src="profilPicture"
                    alt=""
                  />
                  <ion-fab vertical="bottom" horizontal="end" edge>
                    <ion-fab-button @click="takePhoto()">
                      <ion-icon :icon="create"></ion-icon>
                    </ion-fab-button>
                  </ion-fab>
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-col>
        </ion-row>
        <ion-row id="row2"> </ion-row>
      </ion-grid>
      <div id="container" class="registerBox">
        <ion-item>
          <ion-label position="floating">Full Name</ion-label>
          <ion-input v-model="nama" type="text"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Date of Birth</ion-label>
          <ion-datetime v-model="tanggalLahir" placeholder="">{{
            tanggalLahir
          }}</ion-datetime>
        </ion-item>
        <ion-item>
          <ion-label>Blood Type</ion-label>
          <ion-select
            multiple="true"
            v-model="golonganDarah"
            cancel-text="Cancel"
            ok-text="Ok"
          >
            <ion-select-option value="A">A</ion-select-option>
            <ion-select-option value="B">B</ion-select-option>
            <ion-select-option value="AB">AB</ion-select-option>
            <ion-select-option value="O">O</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Height</ion-label>
          <ion-input v-model="tinggiBadan" type="number"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Weight</ion-label>
          <ion-input v-model="beratBadan" type="number"></ion-input>
        </ion-item>

        <ion-button expand="block" color="primary" @click="update()"
          >Submit</ion-button
        >
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonContent,
  IonDatetime,
  IonPage,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonFab,
  IonFabButton,
  alertController,
  IonIcon,
  IonGrid,
  IonRow,
  IonText,
  IonCol,
  IonProgressBar,
  IonSelect,
  IonSelectOption,
} from "@ionic/vue";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { defineComponent } from "vue";
import { Storage } from "@capacitor/storage";
import axios from "axios";
import moment from "moment";
import "moment/locale/id";
import {
  chevronBackCircleOutline,
  logOutOutline,
  create,
  trash,
  close,
} from "ionicons/icons";
import { useRouter } from "vue-router";
import { ipBackend } from "@/ipBackend";
export default defineComponent({
  components: {
    IonContent,
    IonDatetime,
    IonPage,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonFabButton,
    IonFab,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonProgressBar,
    IonSelect,
    IonSelectOption,
  },
  data() {
    return {
      moment,
      foto: "",
      ip: ipBackend,
      spinner: false,
      nama: "",
      tanggalLahir: "",
      tinggiBadan: "",
      beratBadan: "",
      golonganDarah: "",
      counter: "",
      profilPicture: null,
    };
  },
  setup() {
    const router = useRouter();
    return {
      create,
      trash,
      close,
      router,
      chevronBackCircleOutline,
      logOutOutline,
    };
  },
  async ionViewDidEnter() {
    const vm = this;
    vm.spinner = true;
    const ret = await Storage.get({ key: "token" });
    const token = JSON.parse(ret.value);
    if (token) {
      const data = await axios({
        method: "get",
        headers: {
          token: token,
        },
        url: ipBackend + `users/profil`,
      });
      vm.nama = data.data.data[0].nama;
      vm.tanggalLahir = data.data.data[0].tanggalLahir;
      vm.tinggiBadan = data.data.data[0].tinggiBadan;
      vm.beratBadan = data.data.data[0].beratBadan;
      vm.golonganDarah = data.data.data[0].golonganDarah;
      vm.profilPicture = data.data.data[0].profilPicture;
      vm.spinner = false;
    }
  },
  methods: {
    async takePhoto() {
      let vm = this;
      const cameraPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Prompt,
        promptLabelHeader: "Pilih Aksi",
        promptLabelPhoto: "Ambil Dari Galeri",
        promptLabelPicture: "Ambil Dari Kamera",
        quality: 30,
        saveToGallery: true,
        allowEditing: false,
      });
      vm.profilPicture = cameraPhoto.webPath;
      let x = await fetch(`${cameraPhoto.webPath}`).then((e) => {
        return e.blob();
      });
      vm.foto = x;
      this.counter = 1;
    },
    async update() {
      let vm = this;
      const tanggal = moment(vm.tanggalLahir).format("YYYY/MM/DD");
      const formData = new FormData();
      formData.append("file1", vm.foto);
      formData.append("tanggalLahir", tanggal);
      formData.append("nama", vm.nama);
      formData.append("tinggiBadan", vm.tinggiBadan);
      formData.append("beratBadan", vm.beratBadan);
      formData.append("golonganDarah", vm.golonganDarah[0]);
      const ret = await Storage.get({ key: "token" });
      const token = JSON.parse(ret.value);
      if (token) {
        await axios({
          method: "post",
          headers: {
            "Content-Type": "multipart/form-data",
            token: token,
          },
          url: ipBackend + `users/updateMobile`,
          data: formData,
        });
        vm.$router.push("/profile");
      }
    },
    async logout() {
      let vm = this;
      const alert = await alertController.create({
        cssClass: "my-custom-class",
        header: "Perhatian!",
        message: "Apakah yakin akan keluar?",
        buttons: [
          {
            text: "Batal",
            role: "cancel",
            cssClass: "secondary",
            handler: (blah) => {
              console.log("Confirm Cancel:", blah);
            },
          },
          {
            text: "Ya",
            handler: async () => {
              await Storage.set({
                key: "token",
                value: JSON.stringify({}),
              });
              vm.$router.push("/");
            },
          },
        ],
      });
      return alert.present();
    },
  },
});
</script>

<style scoped>
.pagetitle {
  display: flex;
  color: #297aff;
  font-size: 26px;
  padding: 10px;
  text-align: center;
}
.registerBox {
  box-shadow: 1px 1px 10px rgba(56, 128, 255, 0.25);
  width: 85%;
  margin: 24px auto;
  padding: 12px;
  border-radius: 12px;
  transform: translateY(18px);
  transition: 0.3s ease-in;
}
.registerBox:hover {
  transform: translateY(-18px);
  transition: 0.3s ease-in;
  box-shadow: 10px 10px 10px rgba(56, 128, 255, 0.25);
}
.registerBox h1 {
  text-align: center;
  margin-top: 4px;
}
.registerBox p {
  font-size: 14px;
  text-align: center;
  color: #3880ff;
  cursor: pointer;
}
ion-content {
  display: flex;
  justify-self: center;
  margin: auto;
}
ion-item {
  margin: 24px auto;
  /* width: 70%; */
}
ion-button {
  margin: 24px auto;
  /* width: 70%; */
}
#row1 {
  margin: -5px;
  width: 100vw;
  height: 15vh;
  background-color: #3b72ff;
  /* border-radius:  0  0 50% 50%  ; */
}
#row2 {
  margin: -5px;
  width: 100vw;
  height: 15vh;
  background-color: #3b72ff;
  border-radius: 0 0 50% 50%;
}
.imgFotoPribadi {
  border-radius: 50%;
  z-index: 1;
}

img {
  width: 300% !important;
  height: 300% !important;
  max-width: 150px !important;
  max-height: 150px !important;
  padding: 5px !important;
  background-color: #386cf2;
}
#profile {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}
.image-profile {
  height: 150px;
  width: 150px;
  display: block;
  margin: auto;
  border-radius: 50%;
}
ion-icon {
  font-size: 20px;
}
</style>
