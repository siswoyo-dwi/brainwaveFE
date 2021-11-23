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
      <ion-card v-if="dataJadwal.length == 0" class="tidak-ada-jadwal">
        <ion-item color="primary">
          <h3>Jadwal Belum tersedia</h3>
        </ion-item>
      </ion-card>
      <ion-grid v-else>
        <ion-row v-for="jadwal in dataJadwal" :key="jadwal.id">
          <ion-card @click="$router.push(`/detailJadwal/${jadwal.jadwalId}`)">
            <ion-item lines="none">
              <ion-label>
                <ion-col size="6">
                  <ion-grid>
                    <ion-row>
                      <ion-col size="5"> Dokter </ion-col>
                      <ion-col size="7">
                        {{ jadwal.nama }}
                      </ion-col>
                    </ion-row>

                    <ion-row>
                      <ion-col size="5">Tanggal Jadwal</ion-col>
                      <ion-col size="7">{{
                        jadwal.tanggalJadwal.substring(0, 10)
                      }}</ion-col>
                    </ion-row>
                    <ion-row>
                      <ion-col size="5"> jam Mulai </ion-col>
                      <ion-col size="7">
                        {{ jadwal.jamMulai }}
                      </ion-col>
                    </ion-row>
                    <ion-row>
                      <ion-col size="5"> Jam Selesai </ion-col>
                      <ion-col size="7">
                        {{ jadwal.jamSelesai }}
                      </ion-col>
                    </ion-row>
                    <ion-row>
                      <ion-col size="5"> Status </ion-col>
                      <ion-col size="7">
                        {{ jadwal.statusJadwal }}
                      </ion-col>
                    </ion-row>
                  </ion-grid>
                </ion-col>
              </ion-label>
            </ion-item>
            <ion-col size="4"> </ion-col>
            <ion-col size="8"> </ion-col>
            <a :href="`http://wa.me/${jadwal.noHpUser}`">
              <ion-fab vertical="bottom" horizontal="end" slot="fixed">
                <ion-fab-button>
                  <ion-icon :icon="logoWhatsapp"> </ion-icon>
                </ion-fab-button>
              </ion-fab>
            </a>
          </ion-card>
        </ion-row>
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
  IonRow,
  IonFab,
  IonFabButton,
  IonCol,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonIcon,
  IonLabel,
  IonItem,
  IonCard,
  IonProgressBar,
} from "@ionic/vue";
import { Storage } from "@capacitor/storage";
import { ipBackend } from "../../ipBackend";
import Tab from "../tab.vue";
import { defineComponent, ref } from "vue";
import axios from "axios";
import {
  chevronBackCircleOutline,
  logoWhatsapp,
  bookOutline,
  person,
} from "ionicons/icons";

export default defineComponent({
  components: {
    IonPage,
    Tab,
    IonLabel,
    IonContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonGrid,
    IonRow,
    IonFab,
    IonFabButton,
    IonCol,
    IonIcon,
    IonItem,
    IonCard,
    IonProgressBar,
  },
  data() {
    return {
      spinner: false,
      ip: ipBackend,
      dataJadwal: "",
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
      logoWhatsapp,
      chevronBackCircleOutline,
      bookOutline,
      person,
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
      const jadwal = await axios({
        method: "get",
        headers: {
          token: token,
        },
        url: ipBackend + `jadwal/listAll`,
      });

      vm.dataJadwal = jadwal.data.data;
      vm.spinner = false;
    }
  },
  methods: {
    goTo(index) {
      this.$router.push(`/profileDokter/${index}`);
    },
    booking(index) {
      this.$router.push(`/listJadwal/${index}`);
    },
  },
});
</script>

<style scoped>
.ion-text-center {
  text-align: center;
  margin-top: 20px;
}
ion-card {
  min-width: 90%;
  border-radius: 25px;
  color: black;
}
img {
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
