const app = Vue.createApp({
    data() {
        return {
            doctors: [],
            doctorInModal: null,
            users: [],
            userInModal: null,
            comments: [],
            commentInModal: null
        };
    },
    mounted() {
        this.fetchDoctors();
        this.fetchUsers();
        this.fetchComments();
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
        async addDoctor (doctor) {
            const newName = prompt('Enter new name for the doctor', doctor.name);
            const newContact = prompt('Enter new contact for the doctor', doctor.contact);
            const newRating = prompt('Enter new rating for the user', user.contact);
            if (newName && newContact && newRating) {
                const newDoctor = {
                    name: newName,
                    contact: newContact,
                    rating: newRating
                };
                try {

                const response = await fetch(`http://localhost:8080/doctors/`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newDoctor)
                });
    
                    if (!response.ok) throw new Error('Failed to add doctor');
    
                    const newDoctor = await response.json();
                    this.doctors.push(newDoctor);  // Add the new doctor to the list
                    this.newDoctor = { name: '', rating: 0, contact: '' }; // Reset the form
                } catch (error) {
                    console.error("Error adding:", doctor, error);
                }
            }
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
        async addUser (user) {
            const newName = prompt('Enter new name for the user', user.name);
            const newContact = prompt('Enter new contact for the user', user.contact);
            if (newName && newContact) {
                const newUser = {
                    name: newName,
                    contact: newContact,
                };
                try {
        
                const response = await fetch(`http://localhost:8080/users/`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newUser)
                });
        
                    if (!response.ok) throw new Error('Failed to add user');
        
                    const newUser = await response.json();
                    this.users.push(newUser);  // Add the new user to the list
                    this.newUser = { name: '', contact: '' }; // Reset the form
                } catch (error) {
                    console.error("Error adding:", user, error);
                }
            }
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
        },
        async fetchComments() {
            try {
                const response = await fetch('http://localhost:8080/comments');
                if (response.ok) {
                    this.comments = await response.json();
                } else {
                    console.error('Failed to fetch comments');
                }
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        },
        showCommentDetails(comment) {
            this.commentInModal = comment;
        },
        async addComment (comment) {
            const newComment = prompt('Enter new name for the comment', comment.name);
            const newuserId = prompt('Enter the person who commented id', comment.userId);
            const newdoctorId = prompt('Enter the person who commented id', comment.doctorId);
            if (newComment && newuserId && newdoctorId) {
                const newComment = {
                    comment: newComment,
                    userId: newuserId,
                    doctorId: newdoctorId,
                };
                try {
        
                const response = await fetch(`http://localhost:8080/comments/`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newComment)
                });
        
                    if (!response.ok) throw new Error('Failed to add comment');
        
                    const newComment = await response.json();
                    this.comments.push(newComment);  // Add the new comment to the list
                    this.newComment = { name: '', rating: 0, contact: '' }; // Reset the form
                } catch (error) {
                    console.error("Error adding:", comment, error);
                }
            }
        },
        async editComment(comment) {
            const newComment = prompt('Enter new name for the comment', comment.name);
            const newuserId = prompt('Enter the person who commented id', comment.userId);
            const newdoctorId = prompt('Enter the person who commented id', comment.doctorId);
            if (newComment && newuserId && newdoctorId) {
                const updatedComment = {
                    comment: newComment,
                    userId: newuserId,
                    doctorId: newdoctorId,
                };
                try {
                    const response = await fetch(`http://localhost:8080/comments/${comment.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatedComment)
                    });
                    if (response.ok) {
                        this.fetchComments(); // Refresh the comment list
                    } else {
                        console.error('Failed to update comment');
                    }
                } catch (error) {
                    console.error('Error updating comment:', error);
                }
            }
        },
        async deleteComment(id) {
            if (confirm('Are you sure you want to delete this comment?')) {
                try {
                    const response = await fetch(`http://localhost:8080/comments/${id}`, {
                        method: 'DELETE'
                    });
                    if (response.ok) {
                        this.fetchComments(); // Refresh the comment list
                    } else {
                        console.error('Failed to delete comment');
                    }
                } catch (error) {
                    console.error('Error deleting comment:', error);
                }
            }
        }
    }
});

app.mount('#app');
