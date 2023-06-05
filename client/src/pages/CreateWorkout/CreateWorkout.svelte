<script>
    import { useNavigate } from "svelte-navigator";
    import { BASE_URL } from "../../store/globalStores.js";
    import { toast } from '@zerodevx/svelte-toast';
    import { authStore } from "../../store/authStores.js";

    const navigate = useNavigate();

    export let locationname;
    let workoutname;
    let rating;
    let description;
    let exercises = [{name: '', description: '', sets: '', reps: ''}];

    async function handleSubmit(event) {

        const imageFile = event.target.elements.image.files[0];
        const formData = new FormData();
        formData.append('image', imageFile);

        const uploadResponse = await fetch(`${$BASE_URL}/image`, {
            method: 'POST',
            credentials: 'include',
            body: formData,
        });

        const uploadData = await uploadResponse.text();

        const workoutData = {locationname, workoutname, rating, description, image: uploadData, createdBy: $authStore.username, exercises};
        
        const res = await fetch(`${$BASE_URL}/workouts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(workoutData)
        });

        if (res.ok) {
            toast.push('Workout added successfully!', {
                theme: {
                    '--toastBackground': 'rgb(90, 200, 90)',
                    '--toastBarBackground': '#3333',
                }
            });
            navigate("/", { replace: true });
        } else {
            toast.push('Adding workout failed', {
                theme: {
                    '--toastBackground': 'rgb(223, 71, 89)',
                    '--toastBarBackground': '#3333',
                }
            });
        };
    };

    function addExercise() {
        exercises = [...exercises, {name: '', description: '', sets: '', reps: ''}];
    };

    function removeExercise(index) {
        if(exercises.length > 1){
            exercises = exercises.filter((_, i) => i !== index);
        };
    };
</script>

<main>
    <div class="form-container">
        <form on:submit|preventDefault={handleSubmit}>
            <div class="left-side">
                <h3>Add Workout</h3>
                <input bind:value={locationname} type="text" placeholder="Location Name" class="input-field" readonly />
                <br />
                <input bind:value={workoutname} type="text" placeholder="Workout Name" class="input-field" required />
                <br />
                <input bind:value={rating} type="number" min="1" max="5" placeholder="Rating (1-5)" class="input-field" required />
                <br />
                <textarea bind:value={description} placeholder="Workout Description" class="input-field" required />
                <br />
                <input name="image" type="file" class="input-field" />
                <br />
                <button type="button" on:click={addExercise} class="excercise-button">Add Exercise</button>
                <br />
                <button type="submit" class="">Add Workout</button>
            </div>
            <div class="right-side">
        {#each exercises as exercise, i}
        <div class="exercise-container">
            <h4>Exercise {i + 1}</h4>
            <input bind:value={exercise.name} type="text" placeholder="Exercise Name" class="input-field" required />
            <br />
            <textarea bind:value={exercise.description} placeholder="Exercise Description" class="input-field" required />
            <br />
            <input bind:value={exercise.sets} type="number" min="1" placeholder="Sets" class="input-field" required />
            <br />
            <input bind:value={exercise.reps} type="number" min="1" placeholder="Reps" class="input-field" required />
            <br />
            {#if exercises.length > 1}
                <button type="button" on:click={() => removeExercise(i)} class="excercise-button">Remove Exercise</button>
                <br />
            {/if}
        </div>
        {/each}
    </div>
  </form>
  </div>
</main>

<style>
  
    h3, h4 {
        font-size: 30px;
        color: #333333;
        margin-bottom: 20px;
    }

    main {
        display: flex;
        flex-direction: column;
    }

    form {
        display: flex;
        flex-direction: row;
    }

    button {
        margin-top: 0;
        margin-bottom: 100px;
        padding: 10px 20px;
        font-size: 18px;
        border-radius: 5px;
        border: none;
        color: #333333;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-bottom: 20px;
    }

        button:hover {
        background-color: #a8cbe6;
    }

    .left-side {
        flex: 1;
        max-width: 22.5%;
        padding-right: 20px;
        margin-left: 25px;
        position: absolute;
    }

    .right-side {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        grid-gap: 20px;
        flex: 3;
        max-width: 72.5%;
        margin-left: 25%;
    }

    .exercise-container {
        display: flex;
        flex-direction: column;
    }

    .input-field {
        font-size: 18px;
        padding: 10px;
        width: 300px;
        border-radius: 5px;
        transition: all 0.3s ease;
        background-color: #f0f8ff;
        border: 1px solid #8ac6d1;
        color: black;
        margin-bottom: 10px;
    }

    .input-field:focus {
        border-color: #007BFF;
        box-shadow: 0 0 10px #A8E6CF;
    }

    .excercise-button {
        background-color: #FFD700;
    }

    textarea {
        resize: vertical;
        height: 100px;
    }
</style>