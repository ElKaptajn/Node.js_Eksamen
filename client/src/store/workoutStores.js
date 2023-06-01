import { writable, derived } from 'svelte/store';

export const workouts = writable([]);

export const sortedWorkouts = derived(workouts, $workouts => 
    [...$workouts].sort((a, b) => b.rating - a.rating)
);

export const selectedWorkout = writable(null);

export const selectedWorkoutMarker = writable(null);