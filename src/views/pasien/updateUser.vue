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
        <ion-card>
          <ion-card-header color="primary">
            <ion-label>
              <ion-icon
                :icon="chevronBackCircleOutline"
                @click="$router.go(-1)"
              ></ion-icon>
              <h3>Update My Profile</h3>
            </ion-label>
            <img
              v-if="!form.profilPicture && counter == 0"
              src="../../../assets/avatar.png"
              alt=""
              class="image-profile"
            />
            <img
              v-else-if="form.profilPicture && counter == 0"
              class="image-profile"
              :src="ip + form.profilPicture"
              alt=""
            />
            <img
              v-else-if="form.profilPicture && counter == 1"
              class="image-profile"
              :src="form.profilPicture"
              alt=""
            />
            <!-- <img :src="form.profilPicture" alt=""> -->
            <ion-fab
              vertical="bottom"
              horizontal="center"
              style="margin-left: 15px"
            >
              <ion-fab-button @click="takePhoto()">
                <ion-icon :icon="create"></ion-icon>
              </ion-fab-button>
            </ion-fab>
          </ion-card-header>
        </ion-card>
        <ion-card>
          <ion-item>
            <img slot="start" src="../../../assets/Group69.svg" alt="" />

            <ion-text @click="cekAll"> Full name </ion-text>

            <ion-text slot="end" v-if="cek1 == true" @click="cekSatu"
              >{{ form.nama }}
            </ion-text>
            <ion-input
              slot="end"
              v-else
              type="text"
              v-model="form.nama"
            ></ion-input>
          </ion-item>
          <ion-item>
            <img slot="start" src="../../../assets/Group70.svg" alt="" />

            <ion-text @click="cekAll">Birth Date</ion-text>

            <ion-text slot="end" v-if="cek2" @click="cekDua">
              {{ tanggal }}
            </ion-text>
            <ion-datetime
              slot="end"
              v-else
              v-model="form.tanggalLahir"
              placeholder=""
            ></ion-datetime>
          </ion-item>
          <ion-item>
            <ion-input v-model="foto" type="file">
              foto
            </ion-input>
          </ion-item>
          <ion-item>
            <img slot="start" src="../../../assets/Group72.svg" alt="" />

            <ion-text @click="cekAll">Blood type</ion-text>

            <ion-text slot="end" v-if="cek3" @click="cekTiga">
              {{ form.golonganDarah }}
            </ion-text>
            <ion-select
              slot="end"
              v-else
              multiple="true"
              v-model="form.golonganDarah"
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
            <img slot="start" src="../../../assets/Group73.svg" alt="" />
            <ion-text @click="cekAll">Body height</ion-text>
            <ion-text slot="end" v-if="cek4" @click="cekEmpat">
              {{ form.tinggiBadan }} cm
            </ion-text>
            <ion-item slot="end" v-else>
              <ion-input
                class="input"
                type="text"
                v-model="form.tinggiBadan"
              ></ion-input>
            </ion-item>
          </ion-item>
          <ion-item>
            <img slot="start" src="../../../assets/Group75.svg" alt="" />
            <ion-text @click="cekAll">Body weight</ion-text>
            <ion-text slot="end" v-if="cek5" @click="cekLima">
              {{ form.beratBadan }} kgs
            </ion-text>
            <ion-item slot="end" v-else>
              <ion-input
                class="input"
                type="text"
                v-model="form.beratBadan"
              ></ion-input>
            </ion-item>
          </ion-item>
        </ion-card>
      </ion-grid>
      <ion-list>
        <ion-item lines="none"
          ><ion-button @click="update()">Update My form </ion-button>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>
<script>
import {
  IonSelect,
  IonSelectOption,
  IonContent,
  IonList,
  IonItem,
  IonText,
  IonButton,
  IonInput,
  IonFab,
  IonFabButton,
  IonDatetime,
  IonIcon,
  IonPage,
  IonGrid,
  IonCard,
  IonCardHeader,
  IonLabel,
  IonProgressBar,
} from "@ionic/vue";
import { defineComponent } from "vue";
import axios from "axios";
import {
  chevronBackCircleOutline,
  logOutOutline,
  create,
} from "ionicons/icons";
import { useRouter } from "vue-router";
import { ipBackend } from "@/ipBackend";
import { Storage } from "@capacitor/storage";
import moment from "moment";
import "moment/locale/id";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

export default defineComponent({
  components: {
    IonList,
    IonSelect,
    IonProgressBar,
    IonItem,
    IonSelectOption,
    IonContent,
    IonText,
    IonButton,
    IonInput,

    IonPage,
    IonCard,
    IonCardHeader,
    IonLabel,
    IonDatetime,
    IonFab,
    IonFabButton,
    IonIcon,
    IonGrid,
  
  },
  setup() {
    const router = useRouter();

    return {
      router,
      chevronBackCircleOutline,
      logOutOutline,
      create,
    };
  },
  data() {
    return {
      moment,
      foto: "",
      counter: "",
      ip: ipBackend,
      spinner: false,
      cek1: true,
      cek2: true,
      cek3: true,
      cek4: true,
      cek5: true,
      tanggal: "",
      form: {
        profilPicture: "",
        nama: "",
        tanggalLahir: "",
        email: "",
        jenisKelamin: "",
        pekerjaan: "",
        alamat: "",
        tinggiBadan: "",
        beratBadan: "",
        golonganDarah: "",
      },
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
      vm.form = data.data.data[0];
      vm.tanggal = moment(vm.form.tanggalLahir).format("YYYY/MM/DD");
      vm.spinner = false;
      // vm.form.tanggalLahir = Math.floor(
      //   (new Date().getTime() -
      //     new Date(data.data.data[0].tanggalLahir).getTime()) /
      //     31536000000
      // );
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
      let x = await fetch(`${cameraPhoto.webPath}`).then((e) => {
        return e.blob();
      });
      vm.form.profilPicture = cameraPhoto.webPath;
      vm.foto = x;
      this.counter = 1;
    },
    async update() {
      let vm = this;
      const tanggal = moment(vm.form.tanggalLahir).format("YYYY/MM/DD");
      const formData = new FormData();
      formData.append("file1", vm.foto);
      formData.append("tanggalLahir", tanggal);
      formData.append("nama", vm.form.nama);
      formData.append("tinggiBadan", vm.form.tinggiBadan);
      formData.append("beratBadan", vm.form.beratBadan);
      formData.append("golonganDarah", vm.form.golonganDarah[0]);
      const ret = await Storage.get({ key: "token" });
      const token = JSON.parse(ret.value);
      if (token) {
        console.log(formData);
        console.log(vm.foto);
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
    cekAll() {
      const vm = this;

      vm.cek1 = true;
      vm.cek2 = true;
      vm.cek3 = true;
      vm.cek4 = true;
      vm.cek5 = true;
    },
    cekSatu() {
      let vm = this;
      if (vm.cek1) {
        vm.cek1 = false;
        vm.cek2 = true;
        vm.cek3 = true;
        vm.cek4 = true;
        vm.cek5 = true;
      } else {
        vm.cek1 = true;
        vm.cek2 = true;
        vm.cek3 = true;
        vm.cek4 = true;
        vm.cek5 = true;
      }
    },
    cekDua() {
      let vm = this;
      if (vm.cek2) {
        vm.cek2 = false;
        vm.cek1 = true;
        vm.cek3 = true;
        vm.cek4 = true;
        vm.cek5 = true;
      } else {
        vm.cek1 = true;
        vm.cek2 = true;
        vm.cek3 = true;
        vm.cek4 = true;
        vm.cek5 = true;
      }
    },
    cekTiga() {
      let vm = this;
      if (vm.cek3) {
        vm.cek3 = false;
        vm.cek1 = true;
        vm.cek2 = true;
        vm.cek4 = true;
        vm.cek5 = true;
      } else {
        vm.cek1 = true;
        vm.cek2 = true;
        vm.cek3 = true;
        vm.cek4 = true;
        vm.cek5 = true;
      }
    },
    cekEmpat() {
      let vm = this;
      if (vm.cek4) {
        vm.cek4 = false;
        vm.cek1 = true;
        vm.cek2 = true;
        vm.cek3 = true;
        vm.cek5 = true;
      } else {
        vm.cek1 = true;
        vm.cek2 = true;
        vm.cek3 = true;
        vm.cek4 = true;
        vm.cek5 = true;
      }
    },
    cekLima() {
      let vm = this;
      if (vm.cek5) {
        vm.cek5 = false;
        vm.cek1 = true;
        vm.cek2 = true;
        vm.cek3 = true;
        vm.cek4 = true;
      } else {
        vm.cek1 = true;
        vm.cek2 = true;
        vm.cek3 = true;
        vm.cek4 = true;
        vm.cek5 = true;
      }
    },
    getData() {
      const vm = this;
      axios.get(vm.$ipBackend + "profil").then((res) => {
        vm.form = res.data.data[0];
      });
    },
  },
});
</script>

<style scoped>
.profilePicture {
  height: 100%;
  width: auto;
  display: block;
  margin: auto;
}
.ion-text-center {
  text-align: center;
}
.image-profile {
  height: 150px;
  width: 150px;
  display: block;
  margin: auto;
  border-radius: 50%;
}
h3 {
  font-weight: 700;
  text-align: center;
}
ion-icon {
  font-size: 20px;
}
ion-card-header {
  border-radius: 0 0 50% 50%;
}

</style>
