<template>
  <div 
    class="relative rounded-full overflow-hidden border-[1.5px] border-gold bg-gold-light flex items-center justify-center shrink-0 transition-transform duration-200 hover:scale-105 shadow-sm"
    :style="{ width: size + 'px', height: size + 'px' }"
  >
    <img
      v-if="src && src.startsWith('http')"
      :src="src"
      :alt="alt"
      class="w-full h-full object-cover"
    >
    <div v-else class="text-gold">
      <svg xmlns="http://www.w3.org/2000/svg" :width="size * 0.6" :height="size * 0.6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    </div>
  </div>
</template>

<script setup>
defineProps({
  src: String,
  alt: String,
  size: {
    type: [Number, String],
    default: 40
  }
})
</script>
