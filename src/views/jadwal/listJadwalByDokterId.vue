<template>
  <div v-if="spinner">
    <ion-progress-bar
      type="indeterminate"
      itemor="primary"
      value="0.5"
    ></ion-progress-bar>
  </div>
  <ion-page v-else>
    <ion-content>
      <ion-grid>
        <ion-icon :icon="chevronBackCircleOutline" @click="$router.go(-1)"></ion-icon>
        <div v-if="dataJadwal.length > 0">
          <ion-list v-for="jadwal in dataJadwal" :key="jadwal">
            <ion-card>
              <ion-item>
                <ion-label>Tanggal Jadwal</ion-label>
                {{ jadwal.tanggalJadwal.substring(0, 10) }}
              </ion-item>
              <ion-item>
                <ion-label>Jam Mulai</ion-label>
                {{ jadwal.jamMulai }}
              </ion-item>
              <ion-item>
                <ion-label>Jam Selesai</ion-label>
                {{ jadwal.jamSelesai }}
              </ion-item>
              <ion-item>
                <ion-label>Status Jadwal</ion-label>
                {{ jadwal.statusJadwal }}
              </ion-item>
              <ion-item size="3">
                <ion-button @click="$router.push(`/updateJadwal/${jadwal.id}`)">
                  update
                </ion-button>
              </ion-item>
            </ion-card>
          </ion-list>
        </div>
        <div v-else>
          <ion-card>
            <ion-list>
              <ion-item>
                <ion-label>belum ada jadwal</ion-label>
              </ion-item>
            </ion-list>
          </ion-card>
        </div>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonContent,
  IonGrid,
  IonList,
  IonProgressBar,
  IonItem,
  IonIcon,
  IonCard,
  IonLabel,
  IonButton,
} from "@ionic/vue";

import { Storage } from "@capacitor/storage";
import { ipBackend } from "../../ipBackend";
import { defineComponent } from "vue";
import axios from "axios";
import { chevronBackCircleOutline } from "ionicons/icons";
export default defineComponent({
  setup() {
    return {
      chevronBackCircleOutline,
    };
  },
  components: {
    IonPage,
    IonContent,
    IonGrid,
    IonLabel,
    IonCard,
    IonList,
    IonIcon,
    IonButton,
    IonProgressBar,
    IonItem,
  },
  data() {
    return {
      dataJadwal: "",
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
      url: ipBackend + `jadwal/listByUserLogin`,
      headers: { token: token },
    });
    vm.dataJadwal = data.data.data;
    vm.spinner = false;
  },
});
</script>

<style>
ion-icon{
    font-size: 20px;
}
</style>
