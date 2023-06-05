<script>
    import { onMount } from 'svelte';
    import { navigate } from "svelte-navigator";
    import { Loader } from '@googlemaps/js-api-loader';
    import { BASE_URL } from '../../store/globalStores.js';
    import { workouts, sortedWorkouts, selectedWorkout, selectedWorkoutMarker } from '../../store/workoutStores.js';
    import StarRating from '../../components/StarRating.svelte';
    import { authStore } from "../../store/authStores.js";

    let mapDiv;

    onMount(async () => {
        const loader = new Loader({
            apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
            version: 'weekly',
        });
        const google = await loader.load();

        const map = new google.maps.Map(mapDiv, {
            center: { lat: 55.676132, lng: 12.569973 },
            zoom: 12,
        });

        const response = await fetch(`${$BASE_URL}/markers`, {credentials: 'include'});
        const markers = await response.json();

        markers.forEach((marker) => {
            const lat = parseFloat(marker.lat);
            const lng = parseFloat(marker.lng);
            const myLatlng = new google.maps.LatLng(lat, lng);
            const googleMarker = new google.maps.Marker({
                position: myLatlng,
                map,
                label: {
                    color: '#00000',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    text: marker.name, 
                },
                icon: {
                    url: 'src/assets/images/pulling-up-training-silhouette-svgrepo-com.png',
                    scaledSize: new google.maps.Size(42, 42),
                    labelOrigin: new google.maps.Point(21, -10),
                },
            });
            googleMarker.addListener("click", async () => {
                const response = await fetch(`${$BASE_URL}/workouts/${marker.name}`, { credentials: 'include'} );
                const workoutspots = await response.json();
                workouts.set(workoutspots);
                selectedWorkoutMarker.set(marker);
            });
        });
    });

    function navigateWithWorkoutDetails(workout) {
        selectedWorkout.set(workout);
        navigate("/workoutdetails");
    };

    function deleteWorkout(workoutId, wourkoutImage) {

        const imageKey = wourkoutImage.split("/").pop();
        console.log(imageKey);

        fetch(`${$BASE_URL}/image/${imageKey}`, {
            method: "DELETE",
            credentials: "include",
        });

        fetch(`${$BASE_URL}/workouts/${workoutId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        workouts.update(currentWorkouts => currentWorkouts.filter(workout => workout._id !== workoutId));
    };


</script>

<main>
    <h1>Workout Spots</h1>
    <h2>Here you can find all the workout spots in Copenhagen. Select a workout spot on the map to see user made workouts for each spot.</h2>
    <div class="container">
        <div class="map-area"> {#if $authStore.isAuthenticated && $selectedWorkoutMarker}
                <button class="large-button" on:click={ () => navigate(`/createworkout/${$selectedWorkoutMarker.name}`) } >Add workout to: {$selectedWorkoutMarker.name}</button>
            {:else}
                <div class="empty-space-for-large-button"></div>
            {/if}
            <div class="map-container">
                <div id="map" bind:this={mapDiv} class="map-div"></div>
            </div>
        </div>
        <div class="content-container">
            <h2 class="margin-for-rigth-side">{ $selectedWorkoutMarker ? "Workouts for: " + $selectedWorkoutMarker.name : " Select a location to see the workouts" }</h2>
            <div class="workouts-list">
                {#each $sortedWorkouts as workout}
                <div class="workout-item" on:click={() => navigateWithWorkoutDetails(workout)} on:keypress={e => {if (e.key === 'Enter') navigateWithWorkoutDetails(workout)}}>
                    <img src={workout.image ? workout.image : 'src/assets/images/pulling-up-training-silhouette-svgrepo-com.png'} alt="">
                        <div>
                            <p class="workoutname">{workout.workoutname}</p>
                            <p class="workoutrating"><StarRating rating={workout.rating} /></p>
                            <p>{workout.description}</p>
                        </div>
                        {#if $authStore.username === workout.createdBy}
                            <button on:click={ () => deleteWorkout(workout._id, workout.image)} >Delete</button>
                        {/if}
                    </div>
                {/each}
            </div>
        </div>
    </div>
</main>

<style>

    main {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;    
        justify-content: center;
    }

    h1 {
        margin-top: 10px;
        text-align: center;
        margin-bottom: 0;
    }

    .empty-space-for-large-button {
        height: 90px;
    }
    
    .margin-for-rigth-side {
        margin-bottom: 35px;
    }

    .map-area {
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    }

    .large-button {
        width: 90%;
        margin-top: 10px;
        margin-bottom: 20px;
        padding: 1rem 2rem;
        font-size: 1.2rem;
        border: none;
        border-radius: 5px;
        color: #333;
        background-color: #A8E6CF;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .large-button:hover {
        background-color: #a8cbe6;
    }

    .map-div {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 500px;
    }
    .container {
        display: flex;
        justify-content: space-between;
        width: 95%;
    }

    .map-container {
        width: 100%; 
        height: 500px; 
        position: relative;
        overflow: hidden;
    }

    .content-container {
        width: 50%; 
        padding-left: 10px; 
        text-align: center;
    }

    .workouts-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-left: 20px;
    }
    
    .workouts-list > div {
        border: 1px solid #ccc;
        padding: 15px;
        margin-bottom: 10px;
        border-radius: 5px;
        transition: box-shadow 0.3s ease;
    }

    .workouts-list > div:hover {
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    }

    .workouts-list p {
        margin: 10px 0;
    }

    .workout-item {
    display: flex;
    align-items: center;
    }

    .workout-item:hover {
        cursor: pointer;
    }

    .workout-item img {
        width: 100px; 
        height: 100px; 
        margin-right: 15px;
    }

    .workout-item div {
        display: flex;
        flex-direction: column;
    }

    .workouts-list .workoutname {
        font-weight: bold;
        font-size: 1.1em;
    }

    .workouts-list .workoutrating {
        color: #777;
    }
</style>