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
      <div class="ion-text-center">
        <ion-text>List Pasien</ion-text>
      </div>
      <ion-grid>
        <ion-card
          style="margin-top: 50px"
          v-for="Pasien in listPasien"
          :key="Pasien.id"
        >
          <ion-list>
            <ion-item>
              <ion-text>Nama: </ion-text
              ><ion-text slot="end">{{ Pasien.nama }}</ion-text>
            </ion-item>
            <ion-item>
              <ion-text>Gol Darah: </ion-text
              ><ion-text slot="end">{{ Pasien.golonganDarah }}</ion-text>
            </ion-item>
            <ion-item>
              <ion-text>Tinggi: </ion-text
              ><ion-text slot="end">{{ Pasien.tinggiBadan }}</ion-text>
            </ion-item>
            <ion-item>
              <ion-text>Berat: </ion-text
              ><ion-text slot="end">{{ Pasien.beratBadan }}</ion-text>
            </ion-item>
            <ion-item>
              <ion-text>Scanning: </ion-text
              ><ion-text slot="end">{{moment(Pasien.waktuScanning).format('LL') }}</ion-text>
            </ion-item>
          </ion-list>
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
  IonText,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList,
  IonCard,
} from "@ionic/vue";
import { defineComponent, ref } from "vue";
import { Storage } from "@capacitor/storage";
import { ipBackend } from "@/ipBackend";
import axios from "axios";
import { chevronBackCircleOutline } from "ionicons/icons";
import Tab from "../tab.vue";
import  moment  from "moment";
import "moment/locale/id";

export default defineComponent({
  components: {
    Tab,
    IonList,
    IonCard,
    IonText,
    IonProgressBar,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonItem,
    IonPage,
    IonContent,
    IonGrid,
  },
  data() {
    return {
      moment,
      listPasien: "",
      spinner: false,
      id: this.$route.params.id,
    };
  },
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

  async ionViewDidEnter() {
    const vm = this;
    vm.spinner = true;
    const ret = await Storage.get({ key: "token" });
    const token = JSON.parse(ret.value);
    if (token) {
      const dataPasien = await axios({
        method: "get",
        headers: {
          token: token,
        },
        url: ipBackend + `scanning/listScanningByJadwalId/${vm.id}`,
      });

      vm.listPasien = dataPasien.data.data;
      vm.spinner = false;
    }
  },
  methods: {
    goTo(index) {
      this.$router.push(`/profilePasien/${index}`);
    },
  },
});
</script>

<style scoped>
.ion-text-center {
  text-align: center;
  margin-top: 20px;
}
img {
  width: 50px;
  height: auto;
}
ion-icon {
  font-size: 20px;
}
ion-content {
  --background: linear-gradient(
    180deg,
    rgba(43, 150, 255, 1) 0%,
    rgba(255, 255, 255, 1) 50%,
    rgba(255, 255, 255, 1) 100%
  );
}
</style>
