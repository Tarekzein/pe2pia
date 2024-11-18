import userStore from '../stores/userStore';

export const useUser = () => {
  const store = userStore;

  const fetchProfile = async () => {
    try {
      // Call setUser with the expected argument, if needed
      const profile = await store.setUser({ id: 1, name: "John Doe", email: " [email protected]" });
      console.log("Fetched profile:", profile); // Log the profile if you plan to use it
    } catch (error) {
      console.error("Fetching profile failed", error);
    }
  };

  return { fetchProfile, user: store.user };
};
