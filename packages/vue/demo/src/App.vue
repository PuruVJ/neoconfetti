<script setup lang="ts">
import { vConfetti } from '@neoconfetti/vue';
</script>

<template>
	<div v-confetti="{ force: 0.9 }"></div>
</template>

<style scoped>
:global(#app) {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}

.box {
	height: 100%;
	width: 100%;
	background-color: cyan;
}
</style>
