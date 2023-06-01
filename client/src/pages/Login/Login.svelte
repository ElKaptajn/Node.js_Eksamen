<script>
    import { useNavigate, useLocation } from "svelte-navigator";
    import { BASE_URL } from "../../store/globalStores.js";
    import { authStore } from "../../store/authStores.js";
    import { toast } from '@zerodevx/svelte-toast'
  
    const navigate = useNavigate();
    const location = useLocation();
  
    let username;
    let password;
  
    async function handleSubmit() {

        const res = await fetch(`${$BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, password}),
        credentials: 'include'
      });

      if (res.ok) {
        const data = await res.json();
        $authStore = { isAuthenticated: true, username: data.username, role: data.role };
        const from = ($location.state && $location.state.from) || "/";
        navigate(from, { replace: true });
      } else {
        toast.push('Wrong login information', {
          theme: {
          '--toastBackground': 'rgb(223, 71, 89)',
          '--toastBarBackground': '#3333',
          }
        })
      }
    };
  </script>

<main>
  <h3>Login</h3>
  <form on:submit|preventDefault={handleSubmit}>
    <input
      bind:value={username}
      type="text"
      name="username"
      placeholder="Username"
      class="input-field"
    />
    <br />
    <input
      bind:value={password}
      type="password"
      name="password"
      placeholder="Password"
      class="input-field"
    />
    <br />
      <button type="submit" class="submit-button">Login</button>
      <h4>Not a member? Register here:</h4>
      <button class="submit-button" on:click={ () => navigate("/register") }>Register</button>
  </form>
</main>

  <style>
    h3 {
          font-size: 30px;
          color: #333333;
          margin-bottom: 20px;
    }

    main {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 100px;  
    }

    form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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
    }
  
    .input-field:focus {
      border-color: #007BFF;
      box-shadow: 0 0 10px #A8E6CF;
    }
  
    .submit-button {
      margin-top: 0;
      padding: 10px 20px;
      font-size: 18px;
      border-radius: 5px;
      border: none;
      color: #333333;
      background-color: #A8E6CF;
      cursor: pointer;
      transition: all 0.3s ease;
    }
  
    .submit-button:hover {
      background-color: #a8cbe6;
    }

  </style>