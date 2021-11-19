<template>
  <ion-page>
    <ion-content>
      <div id="header">
        <div>
          <ion-item lines="none">
            <ion-text color="primary">Welcome!</ion-text>
          </ion-item>
          <ion-item lines="none">
            <ion-text>Please login first to continue.</ion-text>
          </ion-item>

          <img id="img-home" src="../../assets/Group-38.svg" alt="" />
          <ion-text id="text-home">EEG DroMo</ion-text>

          <ion-item lines="none">
            <ion-button
              @click="goToRegister"
              id="button-home"
              expand="block"
              color="primary"
            >
              Create an Account
            </ion-button>
          </ion-item>
        </div>

        <div id="line-or">
          <img class="line-black" src="../../assets/line.svg" alt="" /> OR
          <img class="line-black" src="../../assets/line.svg" alt="" />
        </div>
        <div id="text-login">
          <ion-text style="margin-left: 5px"
            ><p>
              You already have an account?
              <ion-text color="primary"
                ><p @click="goToLogin()" >Login</p></ion-text
              >
            </p></ion-text
          >
          <!-- <ion-text color="primary"><p @click="goToLogin()">Login</p></ion-text> -->
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>
<script>
import {
  IonPage,
  IonContent,
  // IonCard,
  // IonCardHeader,
  IonItem,
  // IonList,
  IonButton,
  IonText,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
export default defineComponent({
  components: {
    IonPage,
    IonContent,
    IonItem,
    // IonList,
    // IonCard,
    // IonCardHeader,
    IonButton,
    IonText,
  },
  setup() {
    const router = useRouter();

    return { router };
  },
  methods: {
    goToLogin() {
      this.$router.replace("/login");
    },
    goToRegister() {
      this.$router.replace("/register");
    },
  },
});
</script>

<style scoped>
#img-home {
  display: flex;
  justify-self: center;
  margin: auto;
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
#text-welcome {
  margin-top: 7%;
  margin-left: 5%;
}
#text-login {
  display: flex;
  justify-content: center;
}
#line-or {
  display: flex;
  justify-content: center;
  margin: auto;
  width: 85%;
}
#line-or {
  margin-top: 20px;
}
.line-black {
  margin: 0 20px;
}
.logo1,
.logo2 {
  width: 43px;
  height: auto;
}
#logo {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
#text-center {
  text-align: center;
}
/* ion-item {
  --background: linear-gradient(
    90deg,
    rgba(43, 90, 148, 1) 0%,
    rgba(45, 120, 229, 1) 35%,
    rgba(45, 112, 229, 1) 100%
  );
} */
#header {
  margin-top: 40px;
}
/* ion-content{
  z-index: 999999999999999999999999;
} */
</style>
