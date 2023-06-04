<script>
    import { useNavigate } from "svelte-navigator";
    import frontpageImage from '../../assets/images/frontpage_image.jpg';

    const navigate = useNavigate();

</script>

<main>
    <div class="image-container">
        <img class="image-brigthness" src={frontpageImage} alt="">
        <div class="overlay-text">
          <img src="src/assets/images/workout_side_logo.png" style="width: 225px; height: 150px;"alt="">
          <h2 class="text-shadow">Elevate Your Workout Experience</h2>
          <h3 class="text-shadow">Find hidden gems of outdoor fitness in Copenhagen and with personalized workout routines. Let's fuel your passion for fitness!</h3>
            <div class="card-container">
              <div class="card gold-section">
                  <h2>Discover More</h2>
                  <p>Find workout routines and new exciting workout spots!</p>
                  <button class="gold-button"  on:click={ () => navigate("/workoutspots") } >Explore</button>
              </div>
              <div class="card second-section">
                  <h2>Stay Motivated</h2>
                  <p>Join our community for motivation and support!</p>
                  <button class="second-button" on:click={ () => navigate("/register")}>Join Now</button>
              </div>
          </div>
        </div>
      </div>
</main>


<style>

 main {
    display: flex;
    flex-direction: column;
}

 h2, h3 {
        margin-bottom: 0;
  }

  .text-shadow {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }

  .image-container {
    position: relative;
    width: 100%;
    height: 87.5vh;
    overflow: hidden;
  }

  .image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .image-brigthness {
    position: absolute;
    filter: brightness(50%); 
  }

  .overlay-text {
    position: absolute;
    display: flex;
    flex-direction: column;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    text-align: center;
  }

  .card-container {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    margin-top: 2rem;
  }

  .card {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    border-radius: 8px;
    padding: 1rem;
    margin: 1rem;
    width: 42%;
    text-align: center;
  }

  .gold-section {
    background-color: #30A9DE;
    color: #333;
  }

  .gold-section h2, .second-section h2 {
    margin-bottom: 1rem;
  }

  .gold-button, .second-button {
    padding: 1rem 2rem;
    font-size: 1.2rem;
    border: none;
    border-radius: 5px;
    color: #333;
    background-color: #A8E6CF;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .gold-button:hover, .second-button:hover {
    background-color: #a8cbe6;
  }

  .second-section {
    background-color: #30A9DE;
    color: #333;
  }

  .second-button {
    background-color: #A8E6CF;
  }

</style>