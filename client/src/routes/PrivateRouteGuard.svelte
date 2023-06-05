<script>
  import { useNavigate, useLocation } from "svelte-navigator";
  import { authStore } from "../store/authStores.js";
  import { toast } from '@zerodevx/svelte-toast'

  export let adminOnly;

  const navigate = useNavigate();
  const location = useLocation();

  $: if (!$authStore.isAuthenticated) {
    navigate("/login", {
      state: { from: $location.pathname },
      replace: true,
    });
  } else if (adminOnly && $authStore.role !== "ROLE_ADMIN") {
    navigate("/user", {
      state: { from: $location.pathname },
      replace: true,
    });
    toast.push('Missing credentails!', {
      theme: {
      '--toastBackground': '#f0ad4e',
      '--toastBarBackground': '#3333',
      },
      duration: 5000
    })
  };
</script>

{#if $authStore.isAuthenticated}
  <slot />
{/if}
