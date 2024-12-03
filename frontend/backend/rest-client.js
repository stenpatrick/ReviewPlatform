const app = Vue.createApp({
    data() {
        return {
            doctors: [],
            filteredComments: [],
            doctor: null,
            doctorInModal: null,
            users: [],
            userInModal: null,
            comments: [],
            commentInModal: null
        };
    },
    mounted() {
        const doctorId = getDoctorIdFromURL(); // Get the doctor ID from the URL
        if (doctorId) {
            fetchDoctorDetails(doctorId).then(doctor => {
                this.doctor = doctor;
    
                // Once the doctor details are fetched, filter the comments for this doctor
                this.DoctorFilterComments(doctorId);
            });
        }
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
        async addDoctor () {
            const newName = prompt('Enter new name for the doctor');
            const newContact = prompt('Enter new contact for the doctor');
            const newRating = prompt('Enter new rating for the doctor');
            
            if (newName && newContact && newRating) {
                const newDoctor = {
                    name: newName,
                    contact: newContact,
                    rating: newRating
                };
        
                try {
                    const response = await fetch(`http://localhost:8080/doctors/`, {
                        method: 'POST', 
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newDoctor)
                    });
        
                    if (!response.ok) throw new Error('Failed to add doctor');
        
                    const addedDoctor = await response.json();
                    this.doctors.push(addedDoctor); 
                } catch (error) {
                    console.error("Error adding doctor:", error);
                }
            } else {
                console.log("All fields are required.");
            }
        },        
        async editDoctor(doctor) {
            const newName = prompt('Enter new name for the doctor');
            const newContact = prompt('Enter new contact for the doctor');
            const newRating = prompt('Enter new rating for the doctor');
            
            if (newName && newContact && newRating) {
                const newDoctor = {
                    name: newName,
                    contact: newContact,
                    rating: newRating
                };
                try {
                    const response = await fetch(`http://localhost:8080/doctors/${doctor.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newDoctor)
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
        async addUser () {
            const newName = prompt('Enter new name for the user');
            const newContact = prompt('Enter new contact for the user');
            
            if (newName && newContact) {
                const newUser = {
                    name: newName,
                    contact: newContact,
                };
        
                try {
                    const response = await fetch(`http://localhost:8080/users/`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newUser)
                    });
        
                    if (!response.ok) throw new Error('Failed to add user');
        
                    const addedUser = await response.json(); 
                    this.users.push(addedUser); 
                } catch (error) {
                    console.error("Error adding user:", error);
                }
            } else {
                console.log("Both name and contact are required.");
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
        async fetchFilteredComments(filterType = 'doctor', id = null) {
            try {
                // Construct the URL based on the filter type and ID provided
                let url = 'http://localhost:8080/comments';
                if (id) {
                    url += `?${filterType}Id=${id}`;
                }
        
                const response = await fetch(url);
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
        async addComment () {
            // Prompt user for comment details
            const newCommentText = prompt('Enter the new comment text');
            const newUserId = prompt('Enter the ID of the user who commented');
            const newDoctorId = prompt('Enter the ID of the doctor being commented on');
            
            // If all fields are filled, proceed with the addition
            if (newCommentText && newUserId && newDoctorId) {
                const newComment = {
                    comment: newCommentText,
                    userId: newUserId,
                    doctorId: newDoctorId,
                };
        
                try {
                    // Make a POST request to add the new comment
                    const response = await fetch(`http://localhost:8080/comments/`, {
                        method: 'POST',  // Use POST for adding new data
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newComment)
                    });
        
                    if (!response.ok) throw new Error('Failed to add comment');
        
                    const addedComment = await response.json();  // Get the added comment from the response
                    this.comments.push(addedComment);  // Add the new comment to the list of comments
        
                } catch (error) {
                    console.error("Error adding comment:", error);
                }
            } else {
                console.log("All fields are required.");
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
async function fetchDoctorDetails(id) {
    try {
        const response = await fetch(`http://localhost:8080/doctors/${id}`);
        if (response.ok) {
            return await response.json();
        } else {
            console.error('Failed to fetch doctor details:', response.status);
            return null;
        }
    } catch (error) {
        console.error('Error fetching doctor details:', error);
        return null;
    }
}


// Utility to get doctor ID from URL
function getDoctorIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Utility to dynamically load the navbar
function loadNavbar() {
    fetch('/frontend/components/navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-container').innerHTML = data;
        })
        .catch(error => console.error('Error loading navbar:', error));
}



// Call the function to load the navbar when the page loads
loadNavbar();
app.mount('#app');
