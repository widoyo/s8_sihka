<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/pu.ico';
	import type { LayoutProps } from './$types';
	import Nav from '$lib/components/nav.svelte';
	import Footer from '$lib/components/footer.svelte';
	import { page } from '$app/state';
	
	let { data, children }: LayoutProps = $props();
	let pageTitle = page.title || 'Sistem Informasi Hidrologi BBWS Sumatera VIII';
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>{pageTitle}</title>
</svelte:head>

<Nav />
{@render children()}
<Footer />