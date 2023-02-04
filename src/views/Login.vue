<template>
        <v-parallax src="https://picsum.photos/1920/1080?random" class="h-screen w-auto">
            <div class="d-flex flex-column fill-height justify-center pb-5">
                <v-sheet width="400" class="mx-auto pt-10 px-10 pb-10" rounded="xl" elevation="12" color="grey-lighten-3">
                    <div class="text-grey text-h6 pb-5 text-center">Login</div>
                    <v-form validate-on="submit" @submit.prevent="doLogin">
                        <v-text-field v-model="state.username" label="ID" variant="underlined"
                            :error-messages="v$.username.$errors.map(e => e.$message)" required
                            hint="Enter your password to access this app" clearable prepend-icon="mdi-account"
                            @input="v$.username.$touch" @blur="v$.username.$touch" />

                        <v-text-field v-model="state.password" type="password" label="Password" variant="underlined"
                            :error-messages="v$.password.$errors.map(e => e.$message)" required clearable
                            prepend-icon="mdi-lock" @input="v$.password.$touch" @blur="v$.password.$touch" />

                        <v-btn type="submit" block variant="tonal" class="mt-2">Login</v-btn>
                    </v-form>
                    <v-overlay v-model="overlay" contained class="align-center justify-center">
                        <v-progress-circular color="primary" indeterminate size="64" />
                    </v-overlay>
                </v-sheet>
            </div>
        </v-parallax>
        <Alert />
</template>
<script setup lang="ts">

// Utilities
import { reactive, ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { minLength, required } from '@vuelidate/validators'

// Components
import Alert from '@/components/Alert.vue'
// Stores
import { useAuthStore } from '@/store/auth.store'

const auth = useAuthStore()
const overlay = ref(false)
const state = reactive({
    username: null,
    password: null,
})

const rules = {
    username: { required }, // Matches state.usename
    password: { required, min: minLength(6) }, // Matches state.password
}

const v$ = useVuelidate(rules, state)
async function doLogin () {
    if (!await v$.value.$validate()) return
    overlay.value = true
    await auth.login(state.username, state.password)
    overlay.value = false
}
</script>
<style>
.v-alert {
    position: fixed;
    width: 100%;
    bottom:0;
    background-color: #fff;
}
</style>
