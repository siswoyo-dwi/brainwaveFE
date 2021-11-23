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
        <div
          style="margin-top: 50px"
          v-for="(dokter, i) in listDokter"
          :key="i"
          lines="none"
        >
          <ion-card>
            <ion-grid>
              <ion-row>
                <ion-col size="3">
                  <ion-avatar
                    ><img
                      v-if="dokter.profilPicture"
                      :src="ip + dokter.profilPicture"
                      alt=""
                    /><img src="../../../assets/avatar.png" alt="" />
                  </ion-avatar>
                </ion-col>

                <ion-col size="9">
                  <ion-row>
                    <ion-col size="4">Name </ion-col>
                    <ion-col size="8">: {{ dokter.nama }}</ion-col>
                  </ion-row>
                  <ion-row>
                    <ion-col size="4">Nomor Wa </ion-col>
                    <ion-col size="8">: {{ dokter.noHpUser }}</ion-col>
                  </ion-row>
                </ion-col>
              </ion-row>
            </ion-grid>

            <ion-fab vertical="bottom" horizontal="end">
              <ion-fab-button>Info</ion-fab-button>

              <ion-fab-list side="start">
                <ion-fab-button
                  color="secondary"
                  :icon="person"
                  @click="goTo(dokter.id)"
                  ><ion-icon :icon="person" alt="profile"></ion-icon
                ></ion-fab-button>
                <ion-fab-button color="tertiary" @click="booking(dokter.id)"
                  ><ion-icon :icon="bookOutline" alt="booking"></ion-icon
                ></ion-fab-button>
              </ion-fab-list>
            </ion-fab>
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
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonContent,
  IonGrid,
  IonFab,
  IonFabButton,
  IonFabList,
  IonRow,
  IonCol,
  IonAvatar,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonProgressBar,
  IonCard,
  IonIcon,
} from "@ionic/vue";
import { defineComponent, ref } from "vue";
import { Storage } from "@capacitor/storage";
import { ipBackend } from "@/ipBackend";
import axios from "axios";
import Tab from "../tab.vue";
import { chevronBackCircleOutline, bookOutline, person } from "ionicons/icons";
export default defineComponent({
  components: {
    IonAvatar,
    IonFab,
    IonFabButton,
    IonFabList,
    IonRow,
    IonCol,
    Tab,
    IonCard,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonProgressBar,
    IonIcon,
    IonPage,
    IonContent,
    IonGrid,
  },
  data() {
    return {
      listDokter: "",
      spinner: false,
      ip: ipBackend,
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
      const dataDokter = await axios({
        method: "get",
        headers: {
          token: token,
        },
        url: ipBackend + `users/listByRole/Dokter`,
      });

      vm.listDokter = dataDokter.data.data;
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
  /* min-height: 1000px; */
  /* border-radius: 5%; */
}
ion-content {
  --background: linear-gradient(
    180deg,
    rgba(43, 150, 255, 1) 0%,
    rgba(255, 255, 255, 1) 50%,
    rgba(255, 255, 255, 1) 100%
  );
}
img {
  height: auto;
}
ion-icon {
  font-size: 20px;
}
</style>
