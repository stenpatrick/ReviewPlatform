    const vue = Vue.createApp({
        data() {
            return { 
                doctorInModal: {name: null},
                doctors: []
            }
        },
        async created() {
            this.doctors = await (await fetch('http://127.0.0.1:8080/doctors')).json();
        },
        methods: {
            getDoctor: async function (id) {
                this.doctorInModal = await (await fetch ('http://127.0.0.1:8080/doctors/${id}')).json()
                let doctorInModal = new bootstrap.Modal(document.getElementById('doctorInfoModal'), {})
                doctorInfoModal.show()
            },
            addDoctor: async function (name, rating, contact) {
                this.doctorInModal = await (await fetch ('http://127.0.0.1:8080/doctors/${id}')).json()
                let doctorInModal = new bootstrap.Modal(document.getElementById('doctorInfoModal'), {})
                doctorInfoModal.show()
            },

        }
    }).mount('#app')
