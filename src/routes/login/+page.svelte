<script lang="ts">
	import { enhance } from "$app/forms";
    let { data, form } = $props();
</script>

<div class="hero bg-base-200 min-h-screen">
  <div class="hero-content text-center">
    <div class="max-w-md">
      <h1 class="text-5xl font-bold">Hello there</h1>
      <p class="py-6">
        Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
        quasi. In deleniti eaque aut repudiandae et a id nisi.
      </p>
      <button class="btn btn-primary">Get Started</button>
    </div>
  </div>
</div>

<div class="container">
	<h1>Login Sistem Monitoring</h1>

	{#if form?.message}
		<p class="error">{form.message}</p>
	{/if}

	<form method="POST" use:enhance>
        <input type="hidden" name="next" value={data.next} />
		<label>
			Username
			<input name="username" type="text" class="input" required />
		</label>

		<label>
			Password
			<input name="password" type="password" required />
		</label>

		<button type="submit">Masuk</button>
	</form>
</div>

