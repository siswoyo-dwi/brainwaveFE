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
      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-card>
              <ion-card color="primary" id="header">
                <ion-card-header>
                    <h3><strong>{{ profile.nama }} Profile</strong></h3>
                  <img
                    class="image-profile"
                    v-if="!profile.profilPicture"
                    src="../../../assets/avatar.png"
                    alt=""
                  />
                  <img
                    v-else
                    class="image-profile"
                    :src="ip + profile.profilPicture"
                    alt=""
                  />
                </ion-card-header>
              </ion-card>

              <ion-item lines="none">
                <ion-grid>
                  <ion-row>
                    <strong><h4>USER INFORMATION</h4></strong>
                  </ion-row>
                </ion-grid>
              </ion-item>
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
              <ion-item lines="none">
                <ion-text><h4>Medical Record</h4></ion-text>
                <div slot="end" @click="$router.push(`/testHistory/${id}`)">
                  <ion-text color="dark"> See more </ion-text>
                  <ion-icon
                    class="grey"
                    :icon="chevronForwardCircleOutline"
                  ></ion-icon>
                </div>
              </ion-item>
              <div v-if="scanUser.length > 0">
                <swiper @swiper="setSwiperInstance" >
                  <swiper-slide v-for="scan in scanUser" :key="scan.id">
                    <ion-card
                      id="swiper-slide"
                      style="background-color: #9de2b9"
                    >
                      <div class="slider">
                        <ion-grid>
                          <ion-row>
                            <ion-col>
                              <div style="text-align: end">
                                <ion-text> Illness Classification </ion-text>
                              </div>
                            </ion-col>
                          </ion-row>
                        </ion-grid>
                        <div style="margin-top: 50px">
                          <h4>{{ scan.hasil }}</h4>

                          {{ moment(scan.tanggalJadwal).format("Do MMM YYYY") }}
                        </div>
                      </div>
                    </ion-card>
                  </swiper-slide>
                </swiper>
              </div>
              <div v-else>
                <ion-card>
                  <ion-item> Belum ada Medical Record </ion-item>
                </ion-card>
              </div>
              <ion-item
                ><ion-button @click="$router.push('/update')"
                  >Update My Profile</ion-button
                >
                <ion-button @click="goTo()">Dashboard</ion-button>
                <ion-button @click="logout()"
                  ><ion-icon :icon="logOutOutline"></ion-icon
                ></ion-button>
              </ion-item>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>
<script>
import {
  alertController,
  IonCol,
  IonRow,
  // IonList,
  // menuController,
  // IonToolbar,
  IonGrid,
  IonItem,
  IonText,
  // IonButtons,
  // IonMenuButton,
  IonContent,
  IonCard,
  // IonLabel,
  IonButton,
  IonProgressBar,
  IonCardHeader,
  IonPage,
  IonIcon,
} from "@ionic/vue";
import { defineComponent, ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import axios from "axios";
import moment from "moment";
import "moment/locale/id";
import "swiper/swiper-bundle.min.css";

import {
  // chevronBackCircleOutline,
  logOutOutline,
  chevronForwardCircleOutline,
} from "ionicons/icons";
// import Menu from "../menu.vue";
import Tab from "../tab.vue";
import { useRouter } from "vue-router";
import { Storage } from "@capacitor/storage";
import { ipBackend } from "@/ipBackend";
export default defineComponent({
  components: {
    // Menu,
    Tab,
    IonCol,
    IonRow,
    // IonList,
    IonGrid,
    IonItem,
    IonIcon,
    Swiper,
    SwiperSlide,
    IonCard,
    IonCardHeader,
    // IonMenuButton,
    // IonButtons,
    IonProgressBar,
    IonContent,
    // IonToolbar,
    IonText,
    IonButton,
    IonPage,
    // IonLabel,
  },
  setup() {
    const router = useRouter();
    const slides = ref();
    const setSwiperInstance = (swiper) => {
      slides.value = swiper;
    };
    return {
      router,
      // chevronBackCircleOutline,
      logOutOutline,
      chevronForwardCircleOutline,
      setSwiperInstance,
    };
  },
  data() {
    return {
      profile: "",
      ip: ipBackend,
      moment,
      scanUser: "",
      id: "",
      spinner: false,
      age: "",
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
        url: ipBackend + `users/profil`,
      });
      const set = await Storage.get({ key: "id" });
      vm.id = JSON.parse(set.value);
      const user = await axios({
        method: "get",
        url: ipBackend + `scanning/listScanningByUserId/${vm.id}`,
        headers: { token: token },
      });
      vm.scanUser = user.data.data;
      vm.profile = data.data.data[0];
      vm.spinner = false;
      vm.age = Math.floor(
        (new Date().getTime() -
          new Date(data.data.data[0].tanggalLahir).getTime()) /
          31536000000
      );
    }
  },

  methods: {
    goTo() {
      const vm = this;
      if (vm.profile.role == "Pasien") {
        vm.$router.push("/main");
      } else {
        vm.$router.push("/mainDokter");
      }
    },

    async logout() {
      let vm = this;
      const alert = await alertController.create({
        cssClass: "my-custom-class",
        header: "Perhatian!",
        message: "Apakah yakin akan keluar?",
        buttons: [
          {
            text: "Batal",
            role: "cancel",
            cssClass: "secondary",
            handler: (blah) => {
              console.log("Confirm Cancel:", blah);
            },
          },
          {
            text: "Ya",
            handler: async () => {
              await Storage.set({
                key: "token",
                value: JSON.stringify({}),
              });
              vm.$router.push("/home");
            },
          },
        ],
      });
      return alert.present();
    },
  },
});
</script>

<style scoped>
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
  /* width: 90%; */
  /* border-radius: 5%; */
}
.image-profile {
  height: 150px;
  width: 150px;
  display: block;
  margin: auto;
  margin-top: 10px;

  border-radius: 50%;
}

h3 {
  font-weight: 700;
  text-align: center;
}
.grey {
  color: black !important;
}
ion-text {
  font-size: 18px;
}
h4 {
  font-weight: 700;
  color: black;
}
#swiper-slide {
  width: 300px;
  height: 200px;
}
ion-card-header {
  /* border-radius: 0 0 50% 50%; */
}
ion-card#header{
  margin: -20px;
  border-radius: 0  0 50px 50px;
}
</style>
