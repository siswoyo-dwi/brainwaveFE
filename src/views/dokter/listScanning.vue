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
        <ion-row v-for="scan in scanUser" :key="scan.id">
          <ion-card color="success">
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
            <ion-item>
              <ion-text slot="start">Tgl Scan</ion-text
              ><ion-text slot="end">
                {{ moment(scan.WaktuScanning).format("LL") }}</ion-text
              >
            </ion-item>
            <ion-item>
              <ion-text slot="start">Jam Scan</ion-text
              ><ion-text slot="end">
                {{ moment(scan.WaktuScanning).format("HH:mm") }}</ion-text
              >
            </ion-item>
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
  IonGrid,
  IonRow,
  IonItem,
  IonText,
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
    IonItem,
    IonGrid,
    IonRow,
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
    const ret = await Storage.get({ key: "token" });
    const token = JSON.parse(ret.value);
    const user = await axios({
      method: "get",
      url: ipBackend + `scanning/listScanningUserByDokterLogin/${vm.id}`,
      headers: { token: token },
    });
    vm.scanUser = user.data.data;
    vm.spinner = false;
  },
  methods: {},
});
</script>

<style scoped>
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
