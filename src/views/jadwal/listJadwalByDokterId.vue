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
      <Tab slot="fixed"></Tab>
      <ion-grid>
        <div v-if="dataJadwal.length > 0">
          <div v-for="jadwal in dataJadwal" :key="jadwal">
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
            <ion-infinite-scroll
              @ionInfinite="loadData($event)"
              threshold="100px"
              id="infinite-scroll"
              :disabled="isDisabled"
            >
              <ion-infinite-scroll-content
                loading-spinner="bubbles"
                loading-text="Loading more data..."
              >
              </ion-infinite-scroll-content>
            </ion-infinite-scroll>
          </div>
        </div>
        <div v-else>
          <ion-card>
            <div>
              <ion-item>
                <ion-label>belum ada jadwal</ion-label>
              </ion-item>
            </div>
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
  IonProgressBar,
  IonItem,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonCard,
  IonLabel,
  IonButton,
} from "@ionic/vue";

import { Storage } from "@capacitor/storage";
import { ipBackend } from "../../ipBackend";
import { defineComponent, ref } from "vue";
import axios from "axios";
import Tab from "../tab.vue";
import { chevronBackCircleOutline } from "ionicons/icons";
export default defineComponent({
  setup() {
    const isDisabled = ref(false);
    const items = ref([]);
    const pushData = () => {
      const max = items.value.length + 20;
      const min = max - 20;
      for (let i = min; i < max; i++) {
        items.value.push(i);
      }
    };

    const loadData = (ev) => {
      setTimeout(() => {
        pushData();
        ev.target.complete();
        if (items.value.length == 1000) {
          ev.target.disabled = true;
        }
      }, 500);
    };

    pushData();

    return {
      chevronBackCircleOutline,
      isDisabled,
      loadData,
      items,
    };
  },
  components: {
    IonPage,
    IonContent,
    Tab,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonGrid,
    IonLabel,
    IonCard,
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
ion-icon {
  font-size: 20px;
}
</style>
