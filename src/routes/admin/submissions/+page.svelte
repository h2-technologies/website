<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const formatReceived = (value: Date | string) =>
		new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(
			new Date(value)
		);
</script>

<svelte:head>
	<title>Submissions — H2 Admin</title>
</svelte:head>

<h1 class="text-2xl font-semibold tracking-tight">Contact form submissions</h1>
<p class="mt-2 text-sm text-slate-600">The 100 most recent submissions, newest first.</p>

{#if data.submissions.length === 0}
	<p class="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
		No submissions yet.
	</p>
{:else}
	<div class="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
		<table class="w-full min-w-3xl text-left text-sm">
			<caption class="sr-only">Contact form submissions with their current status</caption>
			<thead class="border-b border-slate-200 bg-slate-50">
				<tr>
					<th scope="col" class="px-4 py-3 font-semibold">Received</th>
					<th scope="col" class="px-4 py-3 font-semibold">Name</th>
					<th scope="col" class="px-4 py-3 font-semibold">Email</th>
					<th scope="col" class="px-4 py-3 font-semibold">Company</th>
					<th scope="col" class="px-4 py-3 font-semibold">Message</th>
					<th scope="col" class="px-4 py-3 font-semibold">Status</th>
					<th scope="col" class="px-4 py-3 font-semibold">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each data.submissions as submission (submission.id)}
					<tr class="border-b border-slate-100 align-top last:border-b-0">
						<td class="px-4 py-3 whitespace-nowrap">{formatReceived(submission.createdAt)}</td>
						<td class="px-4 py-3">{submission.name}</td>
						<td class="px-4 py-3">
							<a class="text-orange-700 underline" href={`mailto:${submission.email}`}>
								{submission.email}
							</a>
						</td>
						<td class="px-4 py-3">{submission.company ?? '—'}</td>
						<td class="max-w-md px-4 py-3 whitespace-pre-wrap">{submission.message}</td>
						<td class="px-4 py-3">{submission.status}</td>
						<td class="px-4 py-3 whitespace-nowrap">
							{#if submission.status !== 'read'}
								<form method="POST" action="?/markRead" use:enhance class="inline">
									<input type="hidden" name="id" value={submission.id} />
									<button type="submit" class="text-xs font-semibold text-blue-700 underline">
										Mark read
									</button>
								</form>
							{/if}
							{#if submission.status !== 'archived'}
								<form method="POST" action="?/archive" use:enhance class="ml-3 inline">
									<input type="hidden" name="id" value={submission.id} />
									<button type="submit" class="text-xs font-semibold text-slate-600 underline">
										Archive
									</button>
								</form>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}
