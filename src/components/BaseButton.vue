<template>
    <button
      :class="[
        'px-4 py-2 rounded font-medium',
        variant === 'primary' ? 'bg-primary text-white hover:bg-green-700' : '',
        variant === 'secondary' ? 'bg-gray-300 text-black hover:bg-gray-400' : ''
      ]"
      v-bind="$attrs"
    >
      <slot />
    </button>
  </template>
  
  <script setup>
  const props = defineProps({
    variant: { type: String, default: 'primary' }
  })
  </script>
  