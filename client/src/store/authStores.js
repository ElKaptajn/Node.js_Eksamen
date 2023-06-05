import { writable } from "svelte/store";

export const authStore = writable({
    isAuthenticated: false,
    username: null,
    role: null
});