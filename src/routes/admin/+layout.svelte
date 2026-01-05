<script lang="ts">
    import { enhance } from "$app/forms";
    let { data, children } = $props();
</script>
<ol>
    <li><a href="/admin/users">Manajemen User</a></li>
    <li><a href="/admin/pos">Manajemen Pos</a></li>
    <li><a href="/admin/devices">Manajemen Device</a></li>
</ol>
{@render children()}