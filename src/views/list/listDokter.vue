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
      <ion-grid>
        <!-- <ion-icon :icon="chevronBackCircleOutline" @click="$router.go(-1)"></ion-icon> -->
        <div
          style="margin-top: 50px"
          v-for="(dokter, i) in listDokter"
          :key="i"
          lines="none"
        >
          <ion-card>
            <ion-card-header color="primary">
              <ion-avatar
                ><img
                  v-if="dokter.profilPicture"
                  :src="ip + dokter.profilPicture"
                  alt=""
                /><img src="../../../assets/avatar.png" alt="" />
              </ion-avatar>
            </ion-card-header>
            <ion-item>
              <ion-label>Name : {{ dokter.nama }}</ion-label>
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
  IonProgressBar,
  IonCard,
  IonIcon,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { Storage } from "@capacitor/storage";
import { ipBackend } from "@/ipBackend";
import axios from "axios";
import { chevronBackCircleOutline, bookOutline, person } from "ionicons/icons";
export default defineComponent({
  components: {
    IonAvatar,
    IonFab,
    IonFabButton,
    IonFabList,
    IonCardHeader,
    // IonList,
    IonItem,
    IonCard,
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
    return {
      chevronBackCircleOutline,
      bookOutline,
      person,
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
  border-radius: 5%;
}
img {
  height: auto;
}
ion-icon {
  font-size: 20px;
}
</style>
