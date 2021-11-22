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
      <ion-card>
        <ion-col size="6">
          <ion-grid>
            <ion-row>
              <ion-col size="5">Tanggal Jadwal</ion-col>
              <ion-col size="7">
                {{ moment(dataJadwal.tanggalJadwal).format("LL") }}
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col size="5"> jam Mulai </ion-col>
              <ion-col size="7">
                {{ dataJadwal.jamMulai }}
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col size="5"> Jam Selesai </ion-col>
              <ion-col size="7">
                {{ dataJadwal.jamSelesai }}
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col size="5"> Status </ion-col>
              <ion-col size="7">
                {{ dataJadwal.statusJadwal }}
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-col>
        <ion-col v-if="dataJadwal.statusJadwal == 'aktif'" size="6">
          <ion-input @change="getFile" type="file" ref="fileBtn"></ion-input>
          <ion-button v-model="cek" @click="submit(dataJadwal.id)">
            Kirim Scan
          </ion-button>
        </ion-col>
        <ion-col v-else size="6">
          <ion-button disabled v-model="cek"> Kirim Scan </ion-button>
        </ion-col>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  alertController,
  IonCard,
  IonInput,
  IonProgressBar,
} from "@ionic/vue";
import { Storage } from "@capacitor/storage";
import { ipBackend } from "../../ipBackend";
import { defineComponent } from "vue";
import axios from "axios";
import moment from "moment";
import "moment/locale/id";
import { chevronBackCircleOutline } from "ionicons/icons";
import Tab from "../tab.vue";

export default defineComponent({
  setup() {
    return {
      chevronBackCircleOutline,
    };
  },
  watch: {
    async cek(newVal, oldVal) {
      if (newVal != oldVal) {
        await this.getData();
      }
    },
  },
  components: {
    IonPage,
    Tab,
    IonContent,
    IonGrid,
    IonInput,
    IonProgressBar,
    IonRow,
    IonButton,
    IonCard,
    IonCol,
  },
  data() {
    return {
      dataJadwal: "",
      file: null,
      moment,
      id: this.$route.params.id,
      cek: 0,
      spinner: false,
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
    vm.dataJadwal = data.data.data[0];

    console.log(vm.dataJadwal);
    vm.spinner = false;
  },
  methods: {
    async getData() {
      let vm = this;
      vm.spinner = true;
      const ret = await Storage.get({ key: "token" });
      const token = JSON.parse(ret.value);
      const user = await axios({
        method: "get",
        url: ipBackend + `scanning/listScanningByUserId/${vm.profile}`,
        headers: { token: token },
      });
      vm.scanUser = user.data.data;
      vm.noHpUser = vm.scanUser[0].noHpUser;
      vm.spinner = false;
    },
    getId(id, pro) {
      let vm = this;
      let hasil = true;
      for (const pr in pro) {
        if (id === pro[pr].jadwalId) {
          hasil = false;
          vm.idx = pro[pr].id;
        }
      }
      return hasil;
    },
    async getFile(event) {
      const vm = this;
      vm.file = event.target.files[0];
    },
    async submit(index) {
      let vm = this;
      let formData = new FormData();
      formData.append("excelFile", vm.file);
      formData.append("jadwalId", index);
      const ret = await Storage.get({ key: "token" });
      const token = JSON.parse(ret.value);
      if (token) {
        const data = await axios({
          method: "post",
          headers: {
            "Content-Type": "multipart/form-data",
            token: token,
          },
          url: ipBackend + `scanning/registerMobile`,
          data: formData,
        });
        const user = await axios({
          method: "get",
          url: ipBackend + `scanning/detailsById/${data.data.scanningId}`,
          headers: { token: token },
        });
        const alert = await alertController.create({
          cssClass: "my-custom-class",
          header: "Sukses",
          message: user.data.data[0].hasil,
        });
        return alert.present();
      }
      vm.cek += 1;
    },
  },
});
</script>

<style>
h3 {
  text-align: center;
}
ion-icon {
  font-size: 30px;
}
ion-card {
  min-width: 90vw;
}
</style>
