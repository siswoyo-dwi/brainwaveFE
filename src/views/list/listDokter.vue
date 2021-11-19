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
            <ion-card-header >
              <ion-avatar
                ><img
                  v-if="dokter.profilPicture"
                  :src="ip + dokter.profilPicture"
                  alt=""
                /><img src="../../../assets/avatar.png" alt="" />
              </ion-avatar>
            </ion-card-header>
            <ion-item>
              <ion-label><h1><strong> Name : {{ dokter.nama }}</strong></h1> </ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Nomor Wa : {{ dokter.noHpUser }}</ion-label>
            </ion-item>

            <ion-fab vertical="bottom" horizontal="end">
              <ion-fab-button>Info</ion-fab-button>

              <ion-fab-list side="top">
                <ion-fab-button :icon="person" @click="goTo(dokter.id)"
                  ><ion-icon :icon="person" alt="profile"></ion-icon
                ></ion-fab-button>
              </ion-fab-list>

              <ion-fab-list side="start">
                <ion-fab-button @click="booking(dokter.id)"
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
  IonCardHeader,
  IonFab,
  IonFabButton,
  IonFabList,
  // IonList,
  IonItem,
  IonLabel,
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
    IonCardHeader,
    Tab,
    // IonList,
    IonItem,
    IonCard,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonProgressBar,
    IonIcon,
    IonLabel,
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

<style>
.ion-text-center {
  text-align: center;
  margin-top: 20px;
}
ion-card {
  min-width: 90%;
  /* border-radius: 5%; */
}
img {
  height: auto;
}
ion-icon {
  font-size: 20px;
}
</style>
