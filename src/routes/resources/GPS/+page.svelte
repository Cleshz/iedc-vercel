<script lang="ts">
	import MonacoEditor from '$lib/MonacoEditor.svelte';
	import Navbar from '$lib/Navbar.svelte';
	import { code } from './code';
</script>

<body class="h-screen overflow-y-scroll bg-white dark:bg-neutral-900 dark:text-gray-300">
	<Navbar root="/resources" />

	<section class="mx-auto max-w-3xl p-6">
		<h1
			class="mb-6 text-center text-4xl font-bold text-pink-700 underline decoration-2 dark:text-red-700"
		>
			Live GPS Tracking
		</h1>

		<div class="space-y-8">
			<!-- Introduction -->
			<div>
				<h2 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white">Overview</h2>
				<p class="text-base leading-relaxed">Create a Realtime Tracking device.</p>
			</div>

			<!-- Components Required -->
			<div>
				<h2 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white">
					Components Required
				</h2>
				<ul class="list-disc space-y-2 pl-5">
					<li>ESP32 Development Board (Any variant)</li>
					<li>Type C USB Cable (Data-enabled)</li>
					<li>Jumper Wires</li>
					<li>Neo 6M/Neo 7M</li>
				</ul>
			</div>
		</div>
	</section>
	<section class="mx-auto max-w-4xl p-6">
		<h1
			class="mb-6 text-center text-4xl font-bold text-pink-700 underline decoration-2 dark:text-red-700"
		>
			ESP 32 Pinout
		</h1>
		<img class="scale-75 md:w-full" src="/assets/img/resources/espmini.png" alt="esppinout" />
		<h1
			class="-mb-10 mt-20 text-center text-4xl font-bold text-pink-700 underline decoration-2 dark:text-red-700"
		>
			Circuit
		</h1>
		<img class="scale-75" src="/assets/img/resources/gps.png" alt="pinout" />
	</section>
	<section class="mx-auto max-w-4xl p-6">
		<div
			class="mt-10 border-l-4 border-pink-700 bg-pink-50 p-4 dark:border-red-700 dark:bg-neutral-800"
		>
			<div class="text-sm">
				<b class="text-red-500">GPS Driver</b>
				<ul class="list-disc space-y-2 pl-5">
					<li>
						Install the <b class="text-green-400 hover:text-green-300">"TinyGPSplusplus"</b> from the
						library manager
					</li>
					<!-- <li>Install the <b class="text-green-400 hover:text-green-300">"Adafruit GFX library"</b> from the library manager</li> -->
				</ul>
			</div>
		</div>
		<h1
			class="mb-6 mt-20 text-center text-4xl font-bold text-pink-700 underline decoration-2 dark:text-red-700"
		>
			Example Code
		</h1>
		<MonacoEditor {code} />
	</section>
</body>

<style>
	body {
		@apply transition-colors duration-500;
	}
</style>
