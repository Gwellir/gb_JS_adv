Vue.component('error', {
    data() {
        return {
            errorOccurred: false,
            lastErrorMessage: '',
        }
    },
    methods: {
        catchError(error) {
            this.lastErrorMessage = error;
            this.errorOccurred = true;
        },
    },
    template: `<div class="modal" v-if="errorOccurred" @click="errorOccurred = false">
                    <div class="modal-content">
                        {{ lastErrorMessage }}
                    </div>
               </div>`,
});