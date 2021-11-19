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
      <Tab></Tab>
      <ion-grid>
        <ion-row>
          <!-- <ion-icon :icon="chevronBackCircleOutline" @click="$router.go(-1)"></ion-icon> -->
          <ion-col size="4"></ion-col>
          <ion-col size="5">
            <ion-text class="ion-text-center"
              >{{ profile.nama }} Profile</ion-text
            >
          </ion-col>
          <ion-col size="3"></ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <ion-item class="ion-text-center">
              <img
                v-if="!profile.profilPicture"
                src="../../../assets/avatar.png"
                alt=""
              />
              <ion-avatar v-else>
                <img :src="ip + profile.profilPicture" alt="" />
              </ion-avatar>
            </ion-item>
            <ion-item>
              <ion-grid>
                <ion-row>
                  <strong><h4>USER INFORMATION</h4></strong>
                </ion-row>
                <ion-item>
                  <img slot="start" src="../../../assets/Group69.svg" alt="" />
                  <ion-text> Full name </ion-text>
                  <ion-text slot="end">{{ profile.nama }} </ion-text>
                </ion-item>
                <ion-item>
                  <img slot="start" src="../../../assets/Group70.svg" alt="" />
                  <ion-text>Age</ion-text>
                  <ion-text slot="end"> {{ age }}</ion-text>
                </ion-item>

                <ion-item>
                  <img slot="start" src="../../../assets/Group72.svg" alt="" />
                  <ion-text>Blood type</ion-text>
                  <ion-text slot="end">
                    {{ profile.golonganDarah }}
                  </ion-text>
                </ion-item>
                <ion-item>
                  <img slot="start" src="../../../assets/Group73.svg" alt="" />
                  <ion-text>Body height</ion-text>
                  <ion-text slot="end"> {{ profile.tinggiBadan }} cm </ion-text>
                </ion-item>
                <ion-item>
                  <img slot="start" src="../../../assets/Group75.svg" alt="" />
                  <ion-text>Body weight</ion-text>
                  <ion-text slot="end"> {{ profile.beratBadan }} kgs </ion-text>
                </ion-item>
              </ion-grid>
            </ion-item>

            <ion-item>
              <ion-grid>
                <ion-row>
                  <ion-col size="2">
                    <img src="../../../assets/Group75.svg" alt="" />
                  </ion-col>
                  <ion-col size="4">
                    <ion-text>Body weight</ion-text>
                  </ion-col>
                  <ion-col size="6">
                    <div class="ion-text-end">
                      <ion-text> {{ profile.beratBadan }} kgs </ion-text>
                    </div>
                  </ion-col>
                </ion-row>
              </ion-grid>
            </ion-item>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>
<script>
import {
  IonCol,
  IonRow,
  // IonList,
  IonGrid,
  IonItem,
  IonText,
  IonContent,
  IonPage,
  IonProgressBar,
  // IonIcon,
  IonAvatar,
} from "@ionic/vue";
import { defineComponent } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { Storage } from "@capacitor/storage";
import { ipBackend } from "@/ipBackend";
import Tab from "../tab.vue";
// import { chevronBackCircleOutline } from "ionicons/icons";
export default defineComponent({
  components: {
    IonCol,
    IonRow,
    Tab,
    // IonList,
    IonProgressBar,
    IonGrid,
    IonItem,
    IonContent,
    // IonIcon,
    IonText,
    IonPage,
    IonAvatar,
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  data() {
    return {
      profile: "",
      ip: ipBackend,
      age: "",
      spinner: false,
      id: this.$route.params.id,
    };
  },
  async ionViewDidEnter() {
    const vm = this;
    vm.spinner = true;
    const ret = await Storage.get({ key: "token" });
    const token = JSON.parse(ret.value);
    if (token) {
      const data = await axios({
        method: "get",
        headers: {
          token: token,
        },
        url: ipBackend + `users/detailsUsersById/` + vm.id,
      });
      vm.profile = data.data.data[0];
      vm.age = Math.floor(
        (new Date().getTime() -
          new Date(data.data.data[0].tanggalLahir).getTime()) /
          31536000000
      );
      vm.spinner = false;
    }
  },

  methods: {},
});
</script>

<style scoped>
.pagetitle {
  display: flex;
  color: #297aff;
  font-size: 26px;
  padding: 10px;
  text-align: center;
}
ion-content {
  display: flex;
  justify-self: center;
  margin: auto;
}
ion-item {
  margin: 24px auto;
  /* width: 70%; */
}
ion-button {
  margin: 24px auto;
  /* width: 70%; */
}
img {
  height: 100%;
  width: auto;
  display: block;
  margin: auto;
}
/* ion-icon{
    font-size: 20px;
} */
</style>
