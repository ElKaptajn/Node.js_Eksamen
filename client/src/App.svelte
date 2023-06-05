<script>
    import { Router, Link, Route } from "svelte-navigator";
    import Home from "./pages/Home/Home.svelte";
    import Login from "./pages/Login/Login.svelte";
    import PrivateRoute from "./routes/PrivateRoute.svelte";
    import Admin from "./pages/Admin/Admin.svelte";
    import Register from "./pages/Register/Register.svelte";
    import WorkoutDetails from "./pages/WorkoutDetails/WorkoutDetails.svelte";
    import { authStore } from "./store/authStores.js";
    import { SvelteToast } from '@zerodevx/svelte-toast'
    import { Jumper } from 'svelte-loading-spinners'
    import { BASE_URL } from "./store/globalStores.js";
    import WorkoutSpots from "./pages/WorkoutSpots/WorkoutSpots.svelte";
    import CreateWorkout from "./pages/CreateWorkout/CreateWorkout.svelte";
    import QuestionBoard from "./pages/QuestionBoard/QuestionBoard.svelte";
    import logo from "./assets/images/workout_side_logo.png"

    let isLoading = true;

    function handleLogout() {
        $authStore = { isAuthenticated: false, username: null, role: null };
        
        fetch(`${$BASE_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
    };

    // simulate a delay to test the spinner
     setTimeout(() => {
        isLoading = false;
      }, 1000);

    //for producktion
    // window.onload = () => isLoading = false;
</script>

<SvelteToast options={{ reversed: true, intro: { y: 192 } }} />

<div class="spinner-container">
  {#if isLoading}
    <div class="spinner">
      <Jumper size="60" color="#30A9DE" duration="1s" />
    </div>
  {:else}
    <Router primary={false}>
      <nav>
        <div class="nav-container-left">
          <div class="nav-link">
            <Link to="/"><img src={logo} alt="Company Logo"></Link>
          </div>
          <div class="nav-link">
            <Link to="/workoutspots" style="color: #333; font-size: 20px;">Workout-Spots</Link>
          </div>
          <div class="nav-link">
            <Link to="/questionboard" style="color: #333; font-size: 20px;">Question-Board</Link>
          </div>
          {#if $authStore.role === "ROLE_ADMIN"}
          <div class="nav-link">
            <Link to="/admin" style="color: #333; font-size: 20px;">Create Workout-Spot</Link>
          </div>
          {/if}
        </div>
        <div class="nav-container-right">
          {#if $authStore.isAuthenticated}
          <div class="nav-link">
            <button class="nav-button" on:click={handleLogout}>Log out</button>
          </div>
          {:else}
          <div class="nav-link">
            <button class="nav-button">
              <Link to="/login" style="color: #333; font-size: 20px;">Login</Link>
            </button>
          </div>
          {/if}
        </div>
      </nav>
      <Route path="/">
        <Home />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/register">
        <Register />
      </Route>
      <Route path="/workoutspots">
        <WorkoutSpots />
      </Route>
      <Route path="/workoutdetails">
        <WorkoutDetails />
      </Route>
      <PrivateRoute path="/createworkout/:locationname" adminOnly={false} let:location let:params>
        <CreateWorkout locationname={params.locationname}/>
      </PrivateRoute>
      <PrivateRoute path="/questionboard" adminOnly={false} let:location>
        <QuestionBoard />
      </PrivateRoute>
      <PrivateRoute path="/admin" adminOnly={true} let:location>
        <Admin />
      </PrivateRoute>
    </Router>
  {/if}
</div>

<footer class="footer">
  <p>Copyright © 2023 Workout Side.</p>
</footer>

<style>
  .nav-container-right {
    display: flex;
    justify-content: end;
    margin-left: auto;
  }
  
  .nav-button {
    align-items: center;
    margin-bottom: 20px;
  }

  .nav-container-left {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }

  .spinner-container {
    position: relative;
    height: 100vh;
  }

  .spinner {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 50px;
    background-color: #30A9DE;
    color: #333;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .footer p {
    margin: 0;
    font-size: 16px;
  }
  
  img {
    max-width: 100px;
    border-radius: 10px;
    padding-top: 5px;
  }

  nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #30A9DE;
    min-width: 100%;
    text-align: center;
  }

  .nav-link {
    margin-left: 10px;
    margin-right: 20px;
  }

  button {
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 18px;
    border-radius: 5px;
    border: none;
    color: #333333;
    background-color: #A8E6CF;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  button:hover {
    background-color: #a8cbe6;
  }

</style>