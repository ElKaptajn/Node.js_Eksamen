<script>
    import { Router, Link, Route } from "svelte-navigator";
    import Home from "./pages/Home/Home.svelte";
    import Login from "./pages/Login/Login.svelte";
    import PrivateRoute from "./routes/PrivateRoute.svelte";
    import User from "./pages/User/User.svelte";
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

    let isLoading = true;

    function handleLogout() {

        $authStore = { isAuthenticated: false, username: null, role: null };
        
        fetch(`${$BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
    };

    // simulate a delay to test the spinner
    //  setTimeout(() => {
    //     isLoading = false;
    //   }, 1000);

    //for producktion
    window.onload = () => isLoading = false;
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
        <div class="nav-link">
          <Link to="/"><img src="src/assets/images/workout_side_logo.png" alt="Company Logo"></Link>
        </div>
        <div class="nav-link" >
          <Link to="/login" style="color: #333; font-size: 20px;">Login</Link>
        </div>
        <div class="nav-link">
          <Link to="/user" style="color: #333; font-size: 20px;">User</Link>
        </div>
        <div class="nav-link">
          <Link to="/admin" style="color: #333; font-size: 20px;">Admin</Link>
        </div>
        <div class="nav-link">
          <Link to="/workoutspots" style="color: #333; font-size: 20px;">Workout-Spots</Link>
        </div>
        <div class="nav-link">
          <Link to="/questionboard" style="color: #333; font-size: 20px;">Question-Board</Link>
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
      <PrivateRoute path="/user" adminOnly={false} let:location>
        <User username="{$authStore.username}" />
        <button on:click={handleLogout}>Logout</button>
      </PrivateRoute>
      <PrivateRoute path="/admin" adminOnly={true} let:location>
        <Admin />
        <button on:click={handleLogout}>Logout</button>
      </PrivateRoute>
    </Router>
  {/if}
</div>

<footer class="footer">
  <p>Copyright © 2023 Workout Side.
  </p>
</footer>

<style>
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
    justify-content: start;
    background-color: #30A9DE;
    min-width: 100%;
  }

  .nav-link {
    margin-left: 10px;
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