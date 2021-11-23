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
      <Tab slot="fixed"></Tab>
      <ion-grid>
        <ion-row id="row1">
          <ion-col>
            <ion-grid>
              <ion-row>
                <ion-col size="7">
                  <ion-grid>
                    <ion-row>
                      <ion-text style="margin-top: 10px" color="light"
                        ><h5>Test History</h5>
                      </ion-text>
                    </ion-row>
                  </ion-grid>
                </ion-col>
                <ion-col size="5"> </ion-col>
              </ion-row>
            </ion-grid>
          </ion-col>
        </ion-row>
        <ion-row id="row2"> </ion-row>
      </ion-grid>
      <ion-grid>
        <ion-row v-for="scan in scanUser" :key="scan.id">
          <ion-card color="success">
            <!-- <ion-list> -->
            <ion-item>
              <ion-text slot="start">Tanggal</ion-text
              ><ion-text slot="end">{{
                moment(scan.tanggalJadwal).format("LL")
              }}</ion-text>
            </ion-item>
            <ion-item
              ><ion-text slot="start">Nama</ion-text
              ><ion-text slot="end">{{ scan.nama }}</ion-text>
            </ion-item>
            <ion-item
              ><ion-text slot="start">Jam Mulai</ion-text
              ><ion-text slot="end"> {{ scan.jamMulai }}</ion-text>
            </ion-item>
            <ion-item
              ><ion-text slot="start">Jam Selesai</ion-text
              ><ion-text slot="end">{{ scan.jamSelesai }}</ion-text>
            </ion-item>
            <ion-item>
              <ion-text slot="start">Hasil</ion-text
              ><ion-text slot="end"> {{ scan.hasil }}</ion-text>
            </ion-item>
            <ion-item>
              <ion-text slot="start">Scanning</ion-text
              ><ion-text slot="end"> {{ moment(scan.WaktuScanning).format("LL") }}</ion-text>
            </ion-item>

            <!-- <ion-input @change="getFile" type="file" ref="fileBtn"></ion-input>
            <ion-item size="6" v-if="scan.statusJadwal == 'aktif'">
              <ion-button @click="update(scan.jadwalId)"> update </ion-button>
              <ion-button @click="cancel(scan.scanningId)"> cancel </ion-button>
            </ion-item>
            <ion-item size="6" v-else>
              <ion-button @click="cancel(scan.scanningId)"> cancel </ion-button>
            </ion-item> -->
            <!-- </ion-list> -->
          </ion-card>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonContent,
  IonPage,
  IonProgressBar,
  IonCard,
  // IonIcon,
  IonGrid,
  IonRow,
  // IonInput,
  // IonButton,
  // IonList,
  IonItem,
  IonText,
  IonCol,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { Storage } from "@capacitor/storage";
import axios from "axios";
import moment from "moment";
import "moment/locale/id";
import { chevronBackCircleOutline } from "ionicons/icons";
import { useRouter } from "vue-router";
import { ipBackend } from "@/ipBackend";
import Tab from "../tab.vue";


export default defineComponent({
  components: {
    Tab,
    IonContent,
    IonPage,
    IonProgressBar,
    IonCard,
    // IonList,
    IonItem,
    // IonIcon,
    IonGrid,
    IonRow,
    // IonInput,
    // IonButton,
    IonCol,
    IonText,
  },
  setup() {
    const router = useRouter();
    return { router, chevronBackCircleOutline };
  },
  data() {
    return {
      moment,
      ip: ipBackend,
      spinner: false,
      dataJadwal: "",
      scanUser: "",
      id: this.$route.params.id,
      file: null,
    };
  },
  async ionViewDidEnter() {
    let vm = this;
    vm.spinner = true;
    console.log('hai');
    const ret = await Storage.get({ key: "token" });
    const token = JSON.parse(ret.value);
    const user = await axios({
      method: "get",
      url: ipBackend + `scanning/listScanningByUserId/${vm.id}`,
      headers: { token: token },
    });
    console.log(user);
    vm.scanUser = user.data.data;
    vm.spinner = false;
  },
  methods: {
    async getFile(event) {
      const vm = this;
      vm.file = event.target.files[0];
    },
    async update(index) {
      let vm = this;
      const set = await Storage.get({ key: "id" });
      const id = JSON.parse(set.value);
      let formData = new FormData();
      formData.append("file1", vm.file);
      formData.append("id", id);
      formData.append("jadwalId", index);
      const ret = await Storage.get({ key: "token" });
      const token = JSON.parse(ret.value);
      if (token) {
        console.log(formData);
       const data =   await axios({
          method: "post",
          headers: {
            "Content-Type": "multipart/form-data",
            token: token,
          },
          url: ipBackend + `scanning/updateMobile`,
          data: formData,
        });
        console.log(data);
        vm.$router.push("/profile");
      }
    },

    async cancel(index) {
      const vm = this;
      const ret = await Storage.get({ key: "token" });
      const token = JSON.parse(ret.value);
      if (token) {
        await axios({
          method: "post",
          headers: {
            token: token,
          },
          url: ipBackend + `scanning/delete`,
          data: { id: index },
        });
        vm.$router.push("/profile");
      }
    },
  },
});
</script>

<style scoped>
#row1 {
  margin: -5px;
  width: 100vw;
  height: 15vh;
  background-color: #3abd6f;
  /* border-radius:  0  0 50% 50%  ; */
}
#row2 {
  margin: -5px;
  width: 100vw;
  height: 15vh;
  background-color: #3abd6f;
  border-radius: 0 0 50% 50%;
}
ion-icon {
  color: white;
  margin-top: 7.5%;
  font-size: 20px;
}
ion-card {
  width: 100%;
  min-height: 200px;
}
</style>
