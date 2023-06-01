<script>
    import { useNavigate } from "svelte-navigator";
    import { BASE_URL } from "../../store/globalStores.js";
    import { toast } from '@zerodevx/svelte-toast';
    import { onMount } from "svelte";
    import { Loader } from '@googlemaps/js-api-loader';
  
    const navigate = useNavigate();
  
    let name;
    let description;
    let lat;
    let lng;
  
    let mapContainer;
  
    onMount(async () =>  {
      const loader = new Loader({
          apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
          version: 'weekly',
      });
      const google = await loader.load();

      const map = new google.maps.Map(mapContainer, {
        center: { lat: 55.6761, lng: 12.5683 },
        zoom: 12,
      });

      let marker;

      map.addListener('click', (event) => {
        if (marker) {
          marker.setMap(null);
        }
        marker = new google.maps.Marker({
          position: event.latLng,
          map: map,
        });
        lat = marker.getPosition().lat();
        lng = marker.getPosition().lng();
      });
    });
  
    async function handleSubmit() {
      const locationData = { name, description, lat, lng};
      const res = await fetch(`${$BASE_URL}/markers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(locationData)
      });
  
      if (res.ok) {
        toast.push('Location added successfully!', {
          theme: {
            '--toastBackground': 'rgb(90, 200, 90)',
            '--toastBarBackground': '#3333',
          }
        })
        navigate("/", { replace: true });
      } else if(res.status == 409) {
        toast.push('Location name already exists', {
          theme: {
            '--toastBackground': 'rgb(223, 71, 89)',
            '--toastBarBackground': '#3333',
          }
        })
      } else {
        toast.push('Adding location failed', {
          theme: {
            '--toastBackground': 'rgb(223, 71, 89)',
            '--toastBarBackground': '#3333',
          }
        })
      }
    };
  </script>
  
  <main>
    <div class="form-container">
      <form on:submit|preventDefault={handleSubmit}>
        <h3>Add Location</h3>
        <input bind:value={name} type="text" placeholder="Name" class="input-field" />
        <br />
        <textarea bind:value={description} placeholder="Description" class="input-field"></textarea>
        <br />
        <input bind:value={lat} type="text" placeholder="Latitude" class="input-field" />
        <br />
        <input bind:value={lng} type="text" placeholder="Longitude" class="input-field" />
        <br />
        <button type="submit" class="">Add Location</button>
      </form>
    </div>
    <div class="right-side">
        <h3>Select the location for the workoutspoit on the map below:</h3>
        <div bind:this={mapContainer}  style="height: 400px;" class="map"></div>
    </div>
  </main>
  

<style>
    h3 {
        font-size: 30px;
        color: #333333;
        margin-bottom: 20px;
    }

    main {
        display: flex;
    }

    .map {
        width: 60%;
        height: 400px;
    }

    .right-side {
        flex: 2;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .form-container {
        flex: 1;
        margin-left: 20px;
        text-align: center;
    }


    .input-field {
        font-size: 18px;
        padding: 10px;
        width: 100%;
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
</style>