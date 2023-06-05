<script>
    import { onMount } from 'svelte';
    import { Loader } from '@googlemaps/js-api-loader';
    import { selectedWorkout } from '../../store/workoutStores.js';
    import StarRating from '../../components/StarRating.svelte';
    import { BASE_URL } from '../../store/globalStores.js';

    let mapDiv;
    let workout;

    selectedWorkout.subscribe(value => { workout = value; });

    onMount(async () => {
        const loader = new Loader({
            apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
            version: 'weekly',
        });

        const google = await loader.load();

        try {
            const response = await fetch(`${$BASE_URL}/markers/name/${workout.locationname}`, {credentials: 'include'});

            if (!response.ok) { 
                console.log('Error: Response not OK', response.status, response.statusText);
                return;
            }

            const marker = await response.json();
            const lat = parseFloat(marker.lat);
            const lng = parseFloat(marker.lng);
            const myLatlng = new google.maps.LatLng(lat, lng);

            const map = new google.maps.Map(mapDiv, {
            center: myLatlng,
            zoom: 15,
            });

            const googleMarker = new google.maps.Marker({
                    position: myLatlng,
                    map,
            });
        } catch (error) {
            console.log('Fetch error:', error);
        }
    });

</script>

<div class="page-container">
    <div class="map-section">
        <h2 class="location-name">Workout spot: {workout?.locationname}</h2>
        <div id="map" bind:this="{mapDiv}" class="map-container"></div>
    </div>

    <div class="workout-details-container">
        <h1>{workout?.workoutname}</h1>
        <h2 class="workout-rating">
            Rating: <StarRating rating="{workout?.rating}" />
        </h2>
        <h2 class="workout-description">{workout?.description}</h2>
        <h2>Exercises:</h2>
        <div class="exercises-list">
            {#each workout?.exercises as exercise, index (exercise.name)}
            <div class="exercise-item">
                <img src={exercise.image ? exercise.image : 'src/assets/images/pulling-up-training-silhouette-svgrepo-com.png'} alt={exercise.name} />
                <div>
                    <p class="exercise-name">{index+1}. {exercise.name}</p>
                    <p class="exercise-details">{exercise.sets} sets of {exercise.reps} reps</p>
                    <p class="exercise-description">{exercise.description}</p>
                </div>
            </div>
            {/each}
        </div>
    </div>
</div>

<style>
    .page-container {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }

    .map-section {
        width: 40%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 20px;
    }

    .map-container {
        width: 100%;
        height: 60vh;
    }

    .location-name {
        text-align: center;
        font-size: 1.5em;
        padding: 10px 0;
    }

    .workout-details-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 50%;
        margin: 0 auto;
        padding: 20px;
    }

    h1 {
        text-align: center;
        margin-bottom: 10px;
    }

    .workout-rating,
    .workout-description {
        text-align: center;
        color: #000;
    }

    h2 {
        text-align: center;
        margin-top: 20px;
    }

    .exercises-list {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 20px;
        align-items: center;
    }

    .exercise-item {
        display: flex;
        align-items: center;
        padding: 10px;
        margin: 10px;
        width: 100%;
        transition: box-shadow 0.3s ease;
        border: 1px solid #ddd;
    }

    .exercise-item img {
        width: 100px;
        height: 100px;
        margin-right: 10px;
    }

    .exercise-name {
        font-weight: bold;
        font-size: 1.2em;
    }

    .exercise-details {
        color: #000;
        font-size: 0.9em;
    }

    .exercise-description {
        font-size: 0.8em;
    }
</style>

