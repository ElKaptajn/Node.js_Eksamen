<script>
  import { Route } from "svelte-navigator";
  import PrivateRouteGuard from "./PrivateRouteGuard.svelte";

  export let path;
  export let adminOnly = false;
</script>

<Route {path} let:params let:location let:navigate>
  <PrivateRouteGuard {adminOnly}>
    <slot {params} {location} {navigate} />
  </PrivateRouteGuard>
</Route>
