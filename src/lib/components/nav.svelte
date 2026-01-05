<script>
    import { page } from '$app/stores';
</script>

<div class="navbar bg-base-100 shadow-sm">
  <div class="flex-1">
    <a href="/" class="btn btn-ghost text-xl">Home</a>
  </div>
  <div class="flex-none">
    <ul class="menu menu-horizontal px-1">
      <li><a href="/">Home</a></li>
      <li>
        <details>
          <summary>Parent</summary>
          <ul class="bg-base-100 rounded-t-none p-2">
            <li><a href="/admin/devices">Link 1</a></li>
            <li><a href="/admin/users">Link 2</a></li>
          </ul>
        </details>
      </li>
    </ul>
  </div>
</div>

<nav>
    
    {#if $page.data.user}
        <span>Halo, **{$page.data.user.username}**</span>
        <a href="/profile">Profil</a>
        <form method="POST" action="/logout">
            <button type="submit">Logout</button>
        </form>
    {:else}
        <a href="/login">Login</a>
        <a href="/register">Daftar</a>
    {/if}
</nav>
