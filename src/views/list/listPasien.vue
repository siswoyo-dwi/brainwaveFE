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
        <ion-item
          style="margin-top: 50px"
          v-for="(Pasien, i) in listPasien"
          :key="i"
        >
          <ion-row>
            <ion-col
              ><ion-avatar
                ><img
                  v-if="Pasien.profilPicture"
                  :src="Pasien.profilPicture"
                  alt="" /></ion-avatar
              ><img src="../../../assets/avatar.png" alt="" />
            </ion-col>
            <ion-col
              ><ion-label>{{ Pasien.nama }}</ion-label></ion-col
            >
            <ion-col
              ><ion-button @click="goTo(Pasien.id)"
                >profile</ion-button
              ></ion-col
            >
          </ion-row>
        </ion-item>
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
  IonCol,
  IonProgressBar,
  IonItem,
  IonLabel,
  IonText,
  IonAvatar,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonButton,
} from "@ionic/vue";
import { defineComponent, ref } from "vue";
import { Storage } from "@capacitor/storage";
import { ipBackend } from "@/ipBackend";
import axios from "axios";
import { chevronBackCircleOutline } from "ionicons/icons";
import Tab from "../tab.vue";

export default defineComponent({
  components: {
    IonAvatar,
    Tab,
    IonButton,
    IonText,
    IonProgressBar,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonItem,
    IonLabel,
    IonPage,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
  },
  data() {
    return {
      listPasien: "",
      spinner: false,
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
        url: ipBackend + `users/listByRole/Pasien`,
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
