<template>
  <ion-page>
    <ion-content>
      <div lines="none">
        <!-- <ion-icon :icon="chevronBackCircleOutline" @click="$router.go(-1)"></ion-icon> -->
        <ion-item  lines="none">
          <ion-text>Login</ion-text>
          <img
            src="../../../assets/Group-38.svg"
            style="width: 20px; margin-right: 10px"
            alt=""
          />
        </ion-item>
        <ion-item  lines="none">
          <ion-text>Please login to continue using our app.</ion-text>
        </ion-item>
      </div>
      <div id="container" class="loginBox">
        <h1>Login</h1>
        <ion-item>
          <ion-label position="floating">Email</ion-label>
          <ion-input class="input" type="email" v-model="username"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Password</ion-label>
          <ion-input type="password" v-model="password"></ion-input>
        </ion-item>
        <ion-button
          :disabled="loading"
          expand="block"
          color="primary"
          @click="doLogin()"
          >Login</ion-button
        >
        <ion-text color="primary"><p @click="goTo()">Register New User</p></ion-text>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonContent,
  IonPage,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  // IonCol,
  // IonRow,
  IonText,
  // IonList,
  // IonIcon,
  alertController,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { Storage } from "@capacitor/storage";
import axios from "axios";
import { useRouter } from "vue-router";
import { ipBackend } from "@/ipBackend";
import { chevronBackCircleOutline } from "ionicons/icons";
// import Menu from "../menu.vue";
// import Tab from "../tab.vue";

export default defineComponent({
  components: {
    // Menu,
    // Tab,
    IonContent,
    IonPage,
    // IonList,
    // IonIcon,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    // IonCol,
    // IonRow,
    IonText,
  },
  data() {
    return {
      username: "",
      password: "",
      msg: "",
      loading: false,
      token: "",
      role: "",
      id: "",
    };
  },
  setup() {
    const router = useRouter();
    return { router, chevronBackCircleOutline };
  },
  methods: {
    async doLogin() {
      let vm = this;
      vm.loading = true;
      let post = await axios.post(ipBackend + "users/login", {
        password: vm.password,
        username: vm.username,
      });
      if (post.data.message !== "sukses") {
        const alert = await alertController.create({
          cssClass: "my-custom-class",
          header: "OOPS!",
          message: post.data.message,
          buttons: [
            {
              text: "Okay",
              handler: () => {
                vm.$router.push("/login");
              },
            },
          ],
        });
        vm.loading = false;
        return alert.present();
      } else if (post.data.message == "sukses") {
        await Storage.set({
          key: "token",
          value: JSON.stringify(post.data.token),
        });
        await Storage.set({
          key: "id",
          value: JSON.stringify(post.data.id),
        }),
          await Storage.set({
            key: "role",
            value: JSON.stringify(post.data.role),
          });
        vm.getData();
        const alert = await alertController.create({
          cssClass: "my-custom-class",
          header: "Sukses!",
          message: "Anda Berhasil Login",
          buttons: [
            {
              text: "Okay",
              handler: () => {
                vm.getData();
              },
            },
          ],
        });
        vm.loading = false;
        return alert.present();
      } else {
        const alertregis = await alertController.create({
          cssClass: "my-custom-class",
          header: "Login Gagal!",
          message: post.data.message,
          buttons: [
            {
              text: "Ok",
            },
          ],
        });
        vm.loading = false;
        return alertregis.present();
      }
    },
    async getData() {
      let vm = this;
      const ret = await Storage.get({ key: "role" });
      const set = await Storage.get({ key: "token" });
      const token = JSON.parse(set.value);
      if (token) {
        const data = await axios({
          method: "get",
          headers: {
            token: token,
          },
          url: ipBackend + `users/profil`,
        });
        const dataItem = data.data.data[0];
        if (ret.value == `"Dokter"`) {
          vm.$router.push("/profileDokter");
        } else {
          if (
            dataItem.golonganDarah == null ||
            dataItem.tinggiBadan == null ||
            dataItem.beratBadan == null ||
            dataItem.profilPicture == null ||
            dataItem.tanggalLahir == null
          ) {
            vm.loading = false;

            vm.$router.push("/inputdata");
          } else {
            vm.loading = false;
            vm.$router.push("/profile");
          }
          vm.loading = false;
        }
      }
    },
    goTo() {
      this.$router.push("/register");
    },
  },
});
</script>

<style scoped>
.loginBox {
  margin: 45% auto;
  width: 85%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 12px;
  height: 350px;
  border-radius: 8px;
  transform: translateY(18px);
  box-shadow: 1px 1px 10px rgba(56, 128, 255, 0.25);
  transition: 0.3s ease-out;
}

.loginBox:hover {
  transform: translateY(-18px);
  transition: 0.3s ease-in;
  box-shadow: 10px 10px 10px rgba(56, 128, 255, 0.25);
}
.loginBox h1 {
  text-align: center;
  margin-top: 4px;
}
.loginBox p {
  font-size: 14px;
  text-align: center;
  cursor: pointer;
}

#text-home,
#button-home {
  display: flex;
  justify-content: space-around;
  margin: auto;
  width: 85%;
}
#button-home {
  margin-top: 50px;
}
ion-icon {
  font-size: 20px;
}
</style>
