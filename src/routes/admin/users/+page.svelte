<script lang="ts">
    export let data;
</script>

<h1>Manajemen User</h1>

<table class="table-auto">
    <thead>
        <tr>
            <th>Nama</th>
            <th>Pos</th>
            <th>Admin</th>
            <th>Status</th>
            <th>Aksi</th>
        </tr>
    </thead>
    <tbody>
        {#each data.users as u}
            <tr>
                <td>{u.username}</td>
                <td>{u.pos?.nama ?? 'Kantor'}</td>
                <td>{u.isAdmin ? '✅' : '❌'}</td>
                <td>{u.isActive ? 'Aktif' : 'Non-aktif'}</td>
                <td>
                    <form method="POST" action="?/toggleStatus">
                        <input type="hidden" name="id" value={u.id} />
                        <input type="hidden" name="status" value={u.isActive} />
                        <button type="submit">
                            {u.isActive ? 'Non-aktifkan' : 'Aktifkan'}
                        </button>
                    </form>
                </td>
            </tr>
        {/each}
    </tbody>
</table>