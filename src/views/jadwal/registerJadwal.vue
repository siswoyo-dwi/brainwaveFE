<template>
  <ion-page>
    <ion-content>
      <Tab slot="fixed"></Tab>
      <ion-grid>

        <ion-row>
          <ion-col> Register Jadwal </ion-col>
        </ion-row>
      </ion-grid>
      <ion-card>
        <ion-item>
          <ion-label>Tanggal</ion-label>
          <ion-datetime
            v-model="tanggalJadwal"
            display-format="YYYY:MM:DD"
          ></ion-datetime>
        </ion-item>
        <ion-item>
          <ion-label>Jam Mulai</ion-label>
          <ion-datetime
            display-format="HH:mm"
            minute-values="0,15,30,45"
            v-model="jamMulai"
          ></ion-datetime>
        </ion-item>
        <ion-item>
          <ion-label>Jam selesai</ion-label>
          <ion-datetime
            display-format="HH:mm"
            minute-values="0,15,30,45"
            v-model="jamSelesai"
          ></ion-datetime>
        </ion-item>
        <ion-item>
          <ion-button @click="submit()"> Register Jadwal </ion-button>
        </ion-item>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonContent,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonItem,
  IonDatetime,
  IonButton,
} from "@ionic/vue";
import { defineComponent } from "vue";
import moment from "moment";
import "moment/locale/id";
import Tab from "../tab.vue";
import { ipBackend } from "@/ipBackend";
import { Storage } from "@capacitor/storage";
import axios from "axios";
import { chevronBackCircleOutline } from "ionicons/icons";
export default defineComponent({
  components: {
    IonPage,
    Tab,
    IonContent,
    IonGrid,
    IonButton,
    IonRow,
    IonCol,
    IonCard,
    IonItem,
    IonDatetime,
    IonLabel,
  },
  data() {
    return {
      moment,
      tanggalJadwal: "",
      jamMulai: "",
      jamSelesai: "",
    };
  },
  setup() {
    return {
      chevronBackCircleOutline,
    };
  },
  methods: {
    async submit() {
      let vm = this;
      const tanggal = moment(vm.tanggalJadwal).format("YYYY/MM/DD");
      const jamMulai = moment(vm.jamMulai).format("HH:mm ");
      const jamSelesai = moment(vm.jamSelesai).format("HH:mm ");
      const data = {
        tanggalJadwal: tanggal,
        jamMulai: jamMulai,
        jamSelesai: jamSelesai,
      };
      const ret = await Storage.get({ key: "token" });
      const token = JSON.parse(ret.value);
      if (token) {
        await axios({
          method: "post",
          headers: {
            token: token,
          },
          url: ipBackend + `jadwal/register`,
          data: data,
        });
        vm.$router.push("/listJadwalByDokterId");
      }
    },
  },
});
</script>

<style>
ion-icon {
  font-size: 20px;
}
</style>
