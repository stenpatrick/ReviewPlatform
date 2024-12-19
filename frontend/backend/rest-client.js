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
        commentInModal: null,
        isDoctorFormVisible: false,
        isUserFormVisible: false,
        isCommentFormVisible: false,
        formType: '',
        selectedDoctor: null,
        selectedUser: null,
        selectedComment: null,
      };
    },
    mounted() {
      const doctorId = getDoctorIdFromURL();
      if (doctorId) {
        fetchDoctorDetails(doctorId).then(doctor => {
          this.doctor = doctor;
          this.fetchFilteredComments('doctor', doctorId);
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
  
      async addDoctor() {
        this.isDoctorFormVisible = true;
        this.formType = 'addDoctor';
        this.selectedDoctor = { name: '', contact: '', speciality: '', description: '', rating: 1 }; // Initialize all fields
      },
  
      async editDoctor(doctor) {
        this.isDoctorFormVisible = true;
        this.formType = 'editDoctor';
        this.selectedDoctor = { ...doctor };
      },
  
      async submitDoctorForm() {
        const newDoctor = this.selectedDoctor;
        try {
          let response;
          if (this.formType === 'addDoctor') {
            // Ensure doctor data is valid before sending
            if (!newDoctor.name || !newDoctor.contact || !newDoctor.speciality || !newDoctor.description) {
              alert('Please fill all fields for the doctor!');
              return;
            }
            response = await fetch('http://localhost:8080/doctors/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newDoctor),
            });
          } else if (this.formType === 'editDoctor') {
            response = await fetch(`http://localhost:8080/doctors/${newDoctor.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newDoctor),
            });
          }
  
          if (response.ok) {
            this.fetchDoctors(); // Refetch the doctors after success
            this.isDoctorFormVisible = false;
          } else {
            console.error('Failed to save doctor');
          }
        } catch (error) {
          console.error('Error saving doctor:', error);
        }
      },
  
      async deleteDoctor(id) {
        if (confirm('Are you sure you want to delete this doctor?')) {
          try {
            const response = await fetch(`http://localhost:8080/doctors/${id}`, {
              method: 'DELETE',
            });
            if (response.ok) {
              this.fetchDoctors();
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
  
      async addUser() {
        this.isUserFormVisible = true;
        this.formType = 'addUser';
        this.selectedUser = { name: '', contact: '' };
      },
  
      async editUser(user) {
        this.isUserFormVisible = true;
        this.formType = 'editUser';
        this.selectedUser = { ...user };
      },
  
      async submitUserForm() {
        const newUser = this.selectedUser;
        try {
          let response;
          if (this.formType === 'addUser') {
            response = await fetch('http://localhost:8080/users/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newUser),
            });
          } else if (this.formType === 'editUser') {
            response = await fetch(`http://localhost:8080/users/${newUser.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newUser),
            });
          }
          if (response.ok) {
            this.fetchUsers();
            this.isUserFormVisible = false;
          } else {
            console.error('Failed to save user');
          }
        } catch (error) {
          console.error('Error saving user:', error);
        }
      },
  
      async deleteUser(id) {
        if (confirm('Are you sure you want to delete this user?')) {
          try {
            const response = await fetch(`http://localhost:8080/users/${id}`, {
              method: 'DELETE',
            });
            if (response.ok) {
              this.fetchUsers();
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
          let url = 'http://localhost:8080/comments';
          if (id) {
            url += `?${filterType}Id=${id}`;
          }
          const response = await fetch(url);
          if (response.ok) {
            this.filteredComments = await response.json();
          } else {
            console.error('Failed to fetch filtered comments');
          }
        } catch (error) {
          console.error('Error fetching filtered comments:', error);
        }
      },
  
      async addComment() {
        this.isCommentFormVisible = true;
        this.formType = 'addComment';
        this.selectedComment = { comment: '', userId: '', doctorId: '' };
      },
  
      async editComment(comment) {
        this.isCommentFormVisible = true;
        this.formType = 'editComment';
        this.selectedComment = { ...comment };
      },
  
      async submitCommentForm() {
        const newComment = this.selectedComment;
        try {
          let response;
          if (this.formType === 'addComment') {
            response = await fetch('http://localhost:8080/comments/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newComment),
            });
          } else if (this.formType === 'editComment') {
            response = await fetch(`http://localhost:8080/comments/${newComment.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newComment),
            });
          }
          if (response.ok) {
            this.fetchComments();
            this.isCommentFormVisible = false;
          } else {
            console.error('Failed to save comment');
          }
        } catch (error) {
          console.error('Error saving comment:', error);
        }
      },
  
      async deleteComment(id) {
        if (confirm('Are you sure you want to delete this comment?')) {
          try {
            const response = await fetch(`http://localhost:8080/comments/${id}`, {
              method: 'DELETE',
            });
            if (response.ok) {
              this.fetchComments();
            } else {
              console.error('Failed to delete comment');
            }
          } catch (error) {
            console.error('Error deleting comment:', error);
          }
        }
      },
    },
  });
  
  async function fetchDoctorDetails(doctorId) {
    try {
      const response = await fetch(`http://localhost:8080/doctors/${doctorId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch doctor details');
      }
      const doctor = await response.json();
      return doctor;
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
  
  function loadNavbar() {
    fetch('/frontend/components/navbar.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('navbar-container').innerHTML = data;
      })
      .catch(error => console.error('Error loading navbar:', error));
  }
  
  loadNavbar();
  app.mount('#app');
  