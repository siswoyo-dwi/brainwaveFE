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
      <Tab></Tab>
      <ion-grid>
        <ion-row id="row1">
          <ion-col>
            <ion-grid>
              <ion-row>
                <ion-col size="7">
                  <ion-grid>
                    <ion-row>
                      <ion-text style="margin-top: 10px" color="light"
                        ><h5>Test History</h5>
                      </ion-text>
                    </ion-row>
                  </ion-grid>
                </ion-col>
                <ion-col size="5"> </ion-col>
              </ion-row>
            </ion-grid>
          </ion-col>
        </ion-row>
        <ion-row id="row2"> </ion-row>
      </ion-grid>
      <ion-grid>
        <ion-row v-for="scan in scanUser" :key="scan.id">
          <ion-card>
            <!-- <ion-list> -->
            <ion-item>
              {{ moment(scan.tanggalJadwal).format("ddd LL") }}
            </ion-item>
            <ion-item> {{ scan.nama }} </ion-item>
            <ion-item> {{ scan.hasil }} </ion-item>
            <!-- </ion-list> -->
          </ion-card>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonContent,
  IonPage,
  IonProgressBar,
  IonCard,
  // IonIcon,
  IonGrid,
  IonRow,
  // IonList,
  IonItem,
  IonText,
  IonCol,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { Storage } from "@capacitor/storage";
import axios from "axios";
import moment from "moment";
import "moment/locale/id";
import { chevronBackCircleOutline } from "ionicons/icons";
import { useRouter } from "vue-router";
import { ipBackend } from "@/ipBackend";
import Tab from "../tab.vue";

export default defineComponent({
  components: {
    Tab,
    IonContent,
    IonPage,
    IonProgressBar,
    IonCard,
    // IonList,
    IonItem,
    // IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
  },
  setup() {
    const router = useRouter();
    return { router, chevronBackCircleOutline };
  },
  data() {
    return {
      moment,
      ip: ipBackend,
      spinner: false,
      dataJadwal: "",
      scanUser: "",
      id: this.$route.params.id,
    };
  },
  async ionViewDidEnter() {
    let vm = this;
    vm.spinner = true;
    const ret = await Storage.get({ key: "token" });
    const token = JSON.parse(ret.value);
    const user = await axios({
      method: "get",
      url: ipBackend + `scanning/listScanningByUserId/${vm.id}`,
      headers: { token: token },
    });
    vm.scanUser = user.data.data;
    vm.spinner = false;
  },
});
</script>

<style scoped>
#row1 {
  margin: -5px;
  width: 100vw;
  height: 15vh;
  background-color: #3abd6f;
  /* border-radius:  0  0 50% 50%  ; */
}
#row2 {
  margin: -5px;
  width: 100vw;
  height: 15vh;
  background-color: #3abd6f;
  border-radius: 0 0 50% 50%;
}
ion-icon {
  color: white;
  margin-top: 7.5%;
  font-size: 20px;
}
ion-card {
  width: 100%;
  max-height: 200px;
}
</style>
