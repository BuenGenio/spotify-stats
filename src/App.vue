<template>
  <router-view />
</template>

<script setup>
// No global auth check here - let the router guards handle it
// This prevents race conditions with the OAuth callback processing
</script>

