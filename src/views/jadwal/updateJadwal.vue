<template>
  <div v-if="spinner">
    <ion-progress-bar
      type="indeterminate"
      color="primary"
      value="0.5"
    ></ion-progress-bar>
  </div>
  <ion-page v-else>
    <ion-content>
      <Tab slot="fixed"></Tab>
      <ion-grid style="margin-top: 50px">
        <ion-row>
          <ion-col> Update Jadwal </ion-col>
        </ion-row>
      </ion-grid>
      <ion-item>
        <ion-label>Tanggal</ion-label>
        <ion-datetime v-model="tanggalJadwal"></ion-datetime>
      </ion-item>
      <ion-item>
        <ion-label>Jam Mulai</ion-label>
        <ion-datetime display-format="HH:mm" v-model="jamMulai"></ion-datetime>
      </ion-item>
      <ion-item>
        <ion-label>Jam selesai</ion-label>
        <ion-datetime
          display-format="HH:mm"
          v-model="jamSelesai"
        ></ion-datetime>
      </ion-item>
      <ion-item>
        <ion-label> Status Jadwal </ion-label>
        <ion-select v-model="statusJadwal" cancel-text="Cancel" ok-text="Ok">
          <ion-select-option value="aktif">Aktif</ion-select-option>
          <ion-select-option value="cancel">Cancel</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-item> </ion-item>
      <ion-item>
        <ion-button @click="submit()"> Update Jadwal </ion-button>
      </ion-item>
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
  IonItem,
  IonDatetime,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonProgressBar,
} from "@ionic/vue";
import { defineComponent } from "vue";
import moment from "moment";
import "moment/locale/id";
import { chevronBackCircleOutline } from "ionicons/icons";
import { ipBackend } from "@/ipBackend";
import { Storage } from "@capacitor/storage";
import axios from "axios";
import Tab from "../tab.vue";
export default defineComponent({
  components: {
    IonPage,
    IonContent,
    Tab,
    IonGrid,
    IonButton,
    IonRow,
    IonCol,
    IonItem,
    IonProgressBar,
    IonDatetime,
    IonLabel,
    IonSelect,
    IonSelectOption,
  },
  data() {
    return {
      moment,
      id: this.$route.params.id,
      tanggalJadwal: "",
      jamMulai: "",
      jamSelesai: "",
      statusJadwal: "",
      spinner: false,
    };
  },

  setup() {
    return {
      chevronBackCircleOutline,
    };
  },
  async ionViewDidEnter() {
    let vm = this;
    vm.spinner = true;
    const ret = await Storage.get({ key: "token" });
    const token = JSON.parse(ret.value);
    const data = await axios({
      method: "get",
      url: ipBackend + `jadwal/detailsById/${vm.id}`,
      headers: { token: token },
    });
    vm.tanggalJadwal = data.data.data[0].tanggalJadwal;
    vm.jamMulai = data.data.data[0].jamMulai;
    vm.jamSelesai = data.data.data[0].jamSelesai;
    vm.statusJadwal = data.data.data[0].statusJadwal;
    vm.spinner = false;
  },
  methods: {
    async submit() {
      let vm = this;
      const tanggal = moment(vm.tanggalJadwal).format("YYYY/MM/DD");
      const jamMulai = vm.jamMulai;
      const jamSelesai = vm.jamSelesai;
      const data = {
        id: vm.id,
        tanggalJadwal: tanggal,
        jamMulai: jamMulai,
        jamSelesai: jamSelesai,
        statusJadwal: vm.statusJadwal,
      };
      const ret = await Storage.get({ key: "token" });
      const token = JSON.parse(ret.value);
      if (token) {
        await axios({
          method: "post",
          headers: {
            token: token,
          },
          url: ipBackend + `jadwal/update`,
          data: data,
        });
        vm.$router.push("/profileDokter");
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
