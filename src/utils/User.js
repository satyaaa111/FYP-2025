// entities/User.js

export const User = {
  async logout() {
    // Placeholder: clear localStorage/session
    console.log("User logged out (frontend only).");
    localStorage.removeItem("authToken"); 
    return true;
  },

  async login(username, password) {
    // Fake login (for now)
    console.log(`Logging in as ${username}`);
    localStorage.setItem("authToken", "fake-token");
    return { username };
  },

  async current() {
    // Get current "user"
    //const token = localStorage.getItem("authToken");
    const token = "fake-token"; // For testing purposes
    if (token) {
      return { username: "Farmer User", role: "farmer" };
    }
    return null;
  }
};
