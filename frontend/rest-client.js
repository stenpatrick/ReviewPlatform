const app = Vue.createApp({
    data() {
        return {
            doctors: [],
            doctorInModal: null,
            users: [],
            userInModal: null
        };
    },
    mounted() {
        this.fetchDoctors();
        this.fetchUsers();
    },
    methods: {
        async fetchDoctors() {
            try {
                const response = await fetch('http://localhost:8080/doctors');
                if (response.ok) {
                    this.doctors = await response.json();
                } else {
                    console.error('Failed to fetch doctors');
                }
            } catch (error) {
                console.error('Error fetching doctors:', error);
            }
        },
        showDoctorDetails(doctor) {
            this.doctorInModal = doctor;
        },
        async editDoctor(doctor) {
            const newName = prompt('Enter new name for the doctor', doctor.name);
            const newContact = prompt('Enter new contact for the doctor', doctor.contact);
            const newRating = prompt('Enter new rating for the user', user.contact);
            if (newName && newContact && newRating) {
                const updatedDoctor = {
                    name: newName,
                    contact: newContact,
                    rating: newRating
                };
                try {
                    const response = await fetch(`http://localhost:8080/doctors/${doctor.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatedDoctor)
                    });
                    if (response.ok) {
                        this.fetchDoctors(); // Refresh the doctor list
                    } else {
                        console.error('Failed to update doctor');
                    }
                } catch (error) {
                    console.error('Error updating doctor:', error);
                }
            }
        },
        async deleteDoctor(id) {
            if (confirm('Are you sure you want to delete this doctor?')) {
                try {
                    const response = await fetch(`http://localhost:8080/doctors/${id}`, {
                        method: 'DELETE'
                    });
                    if (response.ok) {
                        this.fetchDoctors(); // Refresh the doctor list
                    } else {
                        console.error('Failed to delete doctor');
                    }
                } catch (error) {
                    console.error('Error deleting doctor:', error);
                }
            }
        },
        async fetchUsers() {
            try {
                const response = await fetch('http://localhost:8080/users');
                if (response.ok) {
                    this.users = await response.json();
                } else {
                    console.error('Failed to fetch users');
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        },
        showUserDetails(user) {
            this.userInModal = user;
        },
        async editUser(user) {
            const newName = prompt('Enter new name for the user', user.name);
            const newContact = prompt('Enter new contact for the user', user.contact);
            if (newName && newContact) {
                const updatedUser = {
                    name: newName,
                    contact: newContact
                };
                try {
                    const response = await fetch(`http://localhost:8080/users/${user.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatedUser)
                    });
                    if (response.ok) {
                        this.fetchUsers(); // Refresh the user list
                    } else {
                        console.error('Failed to update user');
                    }
                } catch (error) {
                    console.error('Error updating user:', error);
                }
            }
        },
        async deleteUser(id) {
            if (confirm('Are you sure you want to delete this user?')) {
                try {
                    const response = await fetch(`http://localhost:8080/users/${id}`, {
                        method: 'DELETE'
                    });
                    if (response.ok) {
                        this.fetchUsers(); // Refresh the user list
                    } else {
                        console.error('Failed to delete user');
                    }
                } catch (error) {
                    console.error('Error deleting user:', error);
                }
            }
        }
    }
});

app.mount('#app');
