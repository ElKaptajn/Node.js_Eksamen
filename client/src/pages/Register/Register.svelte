<script>
    import { useNavigate } from "svelte-navigator";
    import { BASE_URL } from "../../store/globalStores.js";
    import { toast } from '@zerodevx/svelte-toast';
  
    const navigate = useNavigate();
  
    let username;
    let password;
    let email;

    async function handleSubmit() {
        const res = await fetch(`${$BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password, email})
        });

        if (res.ok) {
            toast.push('Registration successful! Please check your email to verify your account.', {
                theme: {
                    '--toastBackground': 'rgb(90, 200, 90)',
                    '--toastBarBackground': '#3333',
                }
            });
            navigate("/login", { replace: true });
        } else {
            toast.push('Registration failed', {
                theme: {
                    '--toastBackground': 'rgb(223, 71, 89)',
                    '--toastBarBackground': '#3333',
                }
            });
        };
    };
</script>

<main>
  <h3>Register</h3>
  <form on:submit|preventDefault="{handleSubmit}">
      <input bind:value="{username}" type="text" name="username" placeholder="Username" class="input-field" required />
      <br />
      <input bind:value="{email}" type="email" name="email" placeholder="Email" class="input-field" required />
      <br />
      <input bind:value="{password}" type="password" name="password" placeholder="Password" class="input-field" required />
      <br />
      <button type="submit" class="submit-button">Register</button>
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
