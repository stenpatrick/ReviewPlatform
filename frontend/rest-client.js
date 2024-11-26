const vue = Vue.createApp({
    data() {
        return {
            newDoctor: {
                name: '',
                rating: 0,
                contact: ''
            },
            doctorInModal: { name: null, rating: null, contact: null }, // Initialize properties properly
            doctors: []
        };
    },
    async created() {
        // Fetch doctors when the app is created
        try {
            const response = await fetch('http://127.0.0.1:8080/doctors');
            if (!response.ok) throw new Error('Failed to fetch doctors');
            this.doctors = await response.json();
        } catch (error) {
            console.error("Error fetching doctors:", error);
        }
    },
    methods: {
        // Fetch doctor details and show in the modal
        getDoctor: async function (id) {
            try {
                const response = await fetch(`http://127.0.0.1:8080/doctors/${id}`);
                if (!response.ok) throw new Error('Failed to fetch doctor details');
                
                this.doctorInModal = await response.json();
                
                // Initialize Bootstrap modal and show it
                const modal = new bootstrap.Modal(document.getElementById('doctorInfoModal'));
                modal.show();
            } catch (error) {
                console.error("Error fetching doctor details:", error);
            }
        },

        // Add new doctor function
        addDoctor: async function () {
            try {
                // Make sure name and rating are valid before making the POST request
                if (!this.newDoctor.name || this.newDoctor.rating < 0 || this.newDoctor.rating > 5) {
                    alert("Please provide valid doctor details.");
                    return;
                }

                const response = await fetch('http://127.0.0.1:8080/doctors', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.newDoctor)
                });

                if (!response.ok) throw new Error('Failed to add doctor');

                const newDoctor = await response.json();
                this.doctors.push(newDoctor);  // Add the new doctor to the list
                this.newDoctor = { name: '', rating: 0, contact: '' }; // Reset the form
            } catch (error) {
                console.error("Error adding doctor:", error);
            }
        }
    }
}).mount('#app');
