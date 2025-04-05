// Global variables
const group = "admin";
let guests = [];

// Use a direct API URL instead of going through a CORS proxy
const BASE_API_URL = "https://demo-api-skills.vercel.app/api/EventOrganizer";

// Check if user is already logged in
document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem("isLoggedIn") === "true") {
        document.getElementById("login-page").style.display = "none";
        document.getElementById("landing-page").style.display = "block";
    }

    // Load saved guest list from localStorage
    if (localStorage.getItem("guests")) {
        guests = JSON.parse(localStorage.getItem("guests"));
        updateGuestList();
    }

    // Restore selected service
    const savedService = localStorage.getItem("selectedService");
    if (savedService) {
        document.getElementById("personal-info-form").style.display = "block";
        document.getElementById("event-details").value = savedService;
    }

    // Check if user is admin
    if (localStorage.getItem("userId") === "admin@eventmaster.com") {
        document.getElementById("admin-panel").style.display = "block";
    }

    // Set up the signup form event listener
    document.getElementById("userForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("signupPassword").value;

        registerUser(name, email, password);
    });
});

// Login function integrated with API
function login(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username.trim() === "" || password.trim() === "") {
        alert("Please enter a username and password.");
        return;
    }

    // Handle hardcoded admin login for testing
    if (username === "admin@eventmaster.com" && password === "admin123") {
        alert("Admin Login Success");

        // Save login state to localStorage
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userId", username);

        document.getElementById("login-page").style.display = "none";
        document.getElementById("landing-page").style.display = "block";
        document.getElementById("admin-panel").style.display = "block";
        return;
    }

    // API login request
    const API_URL = `${BASE_API_URL}/users/login/`;

    const body = JSON.stringify({
        email: username,
        password: password
    });

    console.log("Sending request to API:", body); // Debugging: Log request body

    axios.get(API_URL + username)
    .then(response => {
            alert("Success")
    })
    .catch(error => {
        alert("Failed to login: " + error.message);
        console.error("Error:", error);
    });
}

// Logout function
function logout() {
    alert("Logout user: " + localStorage.getItem("userId"));
    document.getElementById("landing-page").style.display = "none";
    document.getElementById("login-page").style.display = "block";

    // Clear login state
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId");
}

// Fetch all users (Admin Panel)
function fetchUsers() {
    const API_URL = `${BASE_API_URL}/users`;

    fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch users");
            }
            return response.json();
        })
        .then(users => {
            let outputHTML = "<ul>";
            users.forEach(user => {
                outputHTML += `<li><strong>${user.id}</strong> - ${user.email} (${user.name})</li>`;
            });
            outputHTML += "</ul>";
            document.getElementById("output").innerHTML = outputHTML;
        })
        .catch(error => {
            document.getElementById("output").innerHTML = "Error fetching users: " + error.message;
            console.error("Error:", error);
        });
}

// Sign Up function
function registerUser(name, email, password) {
    const API_URL = `${BASE_API_URL}/users`;

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Registration failed");
        }
        return response.json();
    })
    .then(data => {
        alert("User registered successfully!");
        toggleSignup(); // Go back to login form
    })
    .catch(error => {
        alert("Failed to register: " + error.message);
        console.error("Error:", error);
    });
}

// Toggle between login and signup forms
function toggleSignup() {
    const signupSection = document.getElementById("signup-section");
    const loginHero = document.querySelector("#login-page .hero");

    if (signupSection.style.display === "none") {
        signupSection.style.display = "block";
        loginHero.style.display = "none";
    } else {
        signupSection.style.display = "none";
        loginHero.style.display = "block";
    }
}

// Service selection
function serviceDetails(service) {
    document.getElementById("personal-info-form").style.display = "block";
    document.getElementById("event-details").value = "Interested in " + service.replace("-", " ");

    // Save selected service
    localStorage.setItem("selectedService", "Interested in " + service.replace("-", " "));
}

function closeForm() {
    document.getElementById("personal-info-form").style.display = "none";
    localStorage.removeItem("selectedService");
}

function submitForm(event) {
    event.preventDefault();
    alert("Your information has been submitted successfully!");
    closeForm();
}

// Guest list management
function addGuest(event) {
    event.preventDefault();

    const name = document.getElementById("guest-name").value;
    const rsvp = document.getElementById("rsvp-status").value;

    if (name.trim() === "") {
        alert("Please enter a guest name.");
        return;
    }

    guests.push({ name, rsvp });
    localStorage.setItem("guests", JSON.stringify(guests)); // Save to localStorage
    updateGuestList();
    document.getElementById("guest-name").value = "";
}

// Remove guest and update localStorage
function removeGuest(index) {
    guests.splice(index, 1);
    localStorage.setItem("guests", JSON.stringify(guests)); // Update storage
    updateGuestList();
}

// Update guest list UI
function updateGuestList() {
    const tbody = document.getElementById("guest-list-body");
    tbody.innerHTML = "";

    guests.forEach((guest, index) => {
        const row = `<tr>
            <td>${guest.name}</td>
            <td>${guest.rsvp}</td>
            <td><button onclick="removeGuest(${index})" class="cta-button cancel-button">Remove</button></td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

// Smooth Scroll to Sections
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("a[href^='#']").forEach(anchor => {
        anchor.addEventListener("click", function (event) {
            event.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                target.scrollIntoView({ behavior: "smooth" });
            }
        });
    });
});
