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
      <ion-card v-if="dataJadwal.length == 0" class="tidak-ada-jadwal">
        <ion-item color="primary">
          <ion-icon
            :icon="chevronBackCircleOutline"
            @click="$router.go(-1)"
          ></ion-icon>

          <h3>Jadwal Belum tersedia</h3>
        </ion-item>
      </ion-card>
      <ion-grid v-else>
        <ion-icon
          :icon="chevronBackCircleOutline"
          @click="$router.go(-1)"
        ></ion-icon>
        <ion-row v-for="jadwal in dataJadwal" :key="jadwal">
          <ion-card>
            <ion-col size="6">
              <ion-grid>
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
            <ion-col size="6" v-if="jadwal.statusJadwal == 'aktif'">
              <ion-input
                @change="getFile"
                type="file"
                ref="fileBtn"
              ></ion-input>
              <ion-button
                v-if="getId(jadwal.id, scanUser) === true"
                @click="submit(jadwal.id)"
              >
                Kirim Scan
              </ion-button>
              <div v-else>
                <ion-button @click="update(jadwal.id)"> update </ion-button>
                <ion-button @click="cancel(idx)"> cancel </ion-button>
              </div>
            </ion-col>
            <ion-col size="6" v-else>
              <ion-button @click="cancel(idx)"> cancel </ion-button>
            </ion-col>
          </ion-card>
        </ion-row>
      </ion-grid>
      <a :href="`http://wa.me/${noHpUser}`">
        <ion-fab vertical="bottom" horizontal="end" slot="fixed">
          <ion-fab-button>
            <ion-icon :icon="logoWhatsapp"> </ion-icon>
          </ion-fab-button>
        </ion-fab>
      </a>
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
  IonIcon,
  // alertController,
  IonItem,
  IonButton,
  IonCard,
  IonInput,
  IonProgressBar,
} from "@ionic/vue";
import { Storage } from "@capacitor/storage";
import { ipBackend } from "../../ipBackend";
import { defineComponent } from "vue";
import axios from "axios";
import { chevronBackCircleOutline, logoWhatsapp } from "ionicons/icons";

export default defineComponent({
  setup() {
    return {
      chevronBackCircleOutline,
      logoWhatsapp,
    };
  },
  components: {
    IonPage,
    IonContent,
    IonGrid,
    IonInput,
    IonProgressBar,
    IonFab,
    IonFabButton,
    IonItem,
    IonIcon,
    IonRow,
    IonButton,
    IonCard,
    IonCol,
  },
  data() {
    return {
      dataJadwal: "",
      file: null,
      id: this.$route.params.id,
      idx: "",
      scanUser: "",
      profile: "",
      spinner: false,
      noHpUser:"",
    };
  },
  async ionViewDidEnter() {
    let vm = this;
    vm.spinner = true;
    const ret = await Storage.get({ key: "token" });
    const token = JSON.parse(ret.value);
    const data = await axios({
      method: "get",
      url: ipBackend + `jadwal/listByDokterId/${vm.id}`,
      headers: { token: token },
    });
    vm.dataJadwal = data.data.data;
    console.log(vm.dataJadwal);
    const profil = await axios({
      method: "get",
      url: ipBackend + `users/profil`,
      headers: { token: token },
    });
    vm.profile = profil.data.data[0].id;
    console.log(vm.profile);

    const user = await axios({
      method: "get",
      url: ipBackend + `scanning/listScanningByUserId/${vm.profile}`,
      headers: { token: token },
    });
    vm.scanUser = user.data.data;
    vm.spinner = false;
    vm.noHpUser=vm.scanUser[0].noHpUser;
  },
  methods: {
    getId(id, pro) {
      let vm = this;
      let hasil = true;
      for (const pr in pro) {
        if (id === pro[pr].jadwalId) {
          hasil = false;
          vm.idx = pro[pr].id;
        }
      }
      return hasil;
    },
    async getFile(event) {
      const vm = this;
      vm.file = event.target.files[0];
    },
    async submit(index) {
      let vm = this;
      let formData = new FormData();
      formData.append("file1", vm.file);
      formData.append("jadwalId", index);
      const ret = await Storage.get({ key: "token" });
      const token = JSON.parse(ret.value);
      if (token) {
        await axios({
          method: "post",
          headers: {
            "Content-Type": "multipart/form-data",
            token: token,
          },
          url: ipBackend + `scanning/registerMobile`,
          data: formData,
        });
        vm.$router.push("/profile");
      }
    },
    async update(index) {
      let vm = this;
      let formData = new FormData();
      formData.append("file1", vm.file);
      formData.append("id", vm.idx);
      formData.append("jadwalId", index);
      const ret = await Storage.get({ key: "token" });
      const token = JSON.parse(ret.value);
      if (token) {
        await axios({
          method: "post",
          headers: {
            "Content-Type": "multipart/form-data",
            token: token,
          },
          url: ipBackend + `scanning/updateMobile`,
          data: formData,
        });
        vm.$router.push("/profile");
      }
    },

    async cancel(index) {
      const vm = this;
      const ret = await Storage.get({ key: "token" });
      const token = JSON.parse(ret.value);
      if (token) {
        await axios({
          method: "post",
          headers: {
            token: token,
          },
          url: ipBackend + `scanning/delete`,
          data: { id: index },
        });
        vm.$router.push("/profile");
      }
    },
  },
});
</script>

<style>
h3 {
  text-align: center;
}
ion-icon {
  font-size: 30px;
}
</style>
