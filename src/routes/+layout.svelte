<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/pu.ico';
    import { enhance } from "$app/forms";
	import type { LayoutProps } from './$types';
	import Nav from '$lib/components/nav.svelte';
	
	let { data, children }: LayoutProps = $props();

</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<Nav />
{@render children()}
